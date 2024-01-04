from collections import defaultdict
from datetime import datetime, timedelta

from rest_api.rest_api_server.controllers.base import (
    BaseProfilingTokenController, MongoMixin)
from rest_api.rest_api_server.models.enums import RunStates
from rest_api.rest_api_server.models.models import CloudAccount
from rest_api.rest_api_server.utils import handle_http_exc

DAY_IN_HOURS = 24
HOUR_IN_SEC = 3600


def format_cloud_account(cloud_account: CloudAccount) -> dict:
    return {
        'id': cloud_account.id,
        'name': cloud_account.name,
        'type': cloud_account.type.value
    }


def format_application(application: dict):
    if application is None:
        return {}
    return {
        'id': application['_id'],
        'name': application['name'],
        'deleted': application['deleted_at'] != 0
    }


def format_dataset(dataset: dict) -> dict:
    return {
        'id': dataset.get('id') or dataset.get('_id'),
        'name': dataset['name'],
        'deleted': dataset['deleted_at'] != 0,
        'path': dataset['path'],
        'labels': dataset['labels'],
        'training_set': dataset['training_set'],
        'validation_set': dataset['validation_set'],
        'description': dataset.get('description')
    }


class ArceeObject:
    INNER_OBJECTS = {}
    REMOVE_KEYS = ['token']
    REPLACE_KEYS = {'_id': 'id'}

    @classmethod
    def format(cls, obj):
        for k in cls.REMOVE_KEYS:
            obj.pop(k, None)
        for k, new_k in cls.REPLACE_KEYS.items():
            if k in obj:
                obj[new_k] = obj.pop(k)
        for k, cl in cls.INNER_OBJECTS.items():
            if k in obj:
                v = obj.get(k, None)
                if not v:
                    continue
                if isinstance(v, list):
                    for i in v:
                        if isinstance(i, dict):
                            cl.format(i)
                elif isinstance(v, dict):
                    cl.format(v)


class Application(ArceeObject):
    REPLACE_KEYS = {
        **ArceeObject.REPLACE_KEYS,
        'applicationGoals': 'goals'
    }
    INNER_OBJECTS = {'goals': ArceeObject}


class Run(ArceeObject):
    REPLACE_KEYS = {
        **ArceeObject.REPLACE_KEYS,
        'runExecutors': 'executors'
    }
    INNER_OBJECTS = {
        'application': Application,
        'executors': ArceeObject
    }

    @classmethod
    def format(cls, obj):
        super().format(obj)
        if not obj.get('executors'):
            obj['executors'] = []


class RunCostsMixin(MongoMixin):
    @staticmethod
    def __is_flavor_cost(expense) -> bool:
        if (expense.get('lineItem/UsageType') and
                'BoxUsage' in expense['lineItem/UsageType']):
            return True
        elif (expense.get('meter_details', {}).get(
                'meter_category') == 'Virtual Machines'):
            return True
        elif (expense.get('BillingItem') == 'Cloud server configuration' and
              'key:acs:ecs:payType value:spot' not in expense.get('Tags', [])):
            return True
        return False

    def __calculate_instance_work(self, expenses) -> tuple[int, float]:
        total_cost = 0
        working_hours = 0
        for e in expenses:
            total_cost += e['cost']
            if self.__is_flavor_cost(e):
                if e.get('lineItem/UsageAmount'):
                    working_hours += float(e['lineItem/UsageAmount'])
                elif e.get('usage_quantity'):
                    working_hours += float(e['usage_quantity'])
                elif e.get('Usage'):
                    working_hours += float(e['Usage'])
        return working_hours or DAY_IN_HOURS, total_cost

    def _get_run_costs(self, cloud_account_ids: list, runs: list) -> dict:
        if not runs:
            return {}
        min_dt, max_dt = None, None
        executors = set()
        run_executor_duration_map = defaultdict(dict)
        now = datetime.utcnow().timestamp()
        for r in runs:
            r_start = r.get('start') or 0
            r_finish = r.get('finish') or 0
            if not r_finish and r['state'] == RunStates.running:
                r_finish = now
            duration = r_finish - r_start
            r_start = datetime.fromtimestamp(r_start).replace(
                hour=0, minute=0, second=0, microsecond=0)
            r_finish = datetime.fromtimestamp(r_finish).replace(
                hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
            if not min_dt or min_dt > r_start:
                min_dt = r_start
            if not max_dt or max_dt < r_finish:
                max_dt = r_finish
            for executor in r['executors']:
                if isinstance(executor, dict):
                    executor = executor['id']
                executors.add(executor)
                run_executor_duration_map[r['id']][executor] = duration
        pipeline = [
            {'$match': {
                'cloud_account_id': {'$in': cloud_account_ids},
                'start_date': {'$gte': min_dt, '$lt': max_dt},
                'end_date': {'$lte': max_dt},
                'resource_id': {'$in': list(executors)}
            }},
            {'$project': {
                'cost': 1,
                'resource_id': 1,
                'lineItem/UsageAmount': 1,  # aws
                'usage_quantity': 1,  # azure
                'Usage': 1,  # ali
                'lineItem/UsageType': 1,
                'meter_details': 1,
                'BillingItem': 1,
                'Tags': 1,
            }}
        ]
        exp_map = defaultdict(list)
        for exp in self.raw_expenses_collection.aggregate(pipeline):
            exp_map[exp['resource_id']].append(exp)
        result = {}
        executor_work_map = {}
        for resource_id, expenses in exp_map.items():
            executor_work_map[resource_id] = self.__calculate_instance_work(
                expenses)
        for run in runs:
            run_id = run['id']
            cost = 0
            for executor, duration in run_executor_duration_map.get(
                    run_id, {}).items():
                working_hours, w_cost = executor_work_map.get(
                    executor, (DAY_IN_HOURS, 0))
                # cost for what period in hours was collected
                w_time = working_hours * HOUR_IN_SEC
                cost += w_cost * duration / w_time
            result[run_id] = cost
        return result


class BaseProfilingController(BaseProfilingTokenController):
    def _get_cloud_accounts(self, organization_id) -> dict[str, dict]:
        cloud_accounts_q = self.session.query(CloudAccount).filter(
            CloudAccount.deleted.is_(False),
            CloudAccount.organization_id == organization_id
        )
        return {ca.id: format_cloud_account(ca)
                for ca in cloud_accounts_q.all()}

    def get_profiling_token(self, organization_id):
        profiling_token = self.get_or_create_profiling_token(organization_id)
        return profiling_token.token

    @handle_http_exc
    def create_application(self, profiling_token, application_key, **kwargs):
        arcee = self.get_arcee_client(profiling_token)
        _, app = arcee.application_create(
            application_key=application_key, **kwargs)
        Application.format(app)
        return app

    @handle_http_exc
    def get_application(self, profiling_token, application_id):
        arcee = self.get_arcee_client(profiling_token)
        _, application = arcee.application_get(application_id)
        Application.format(application)
        return application

    @handle_http_exc
    def list_applications(self, profiling_token) -> list[dict]:
        arcee = self.get_arcee_client(profiling_token)
        _, response = arcee.applications_get()
        for r in response:
            Application.format(r)
        return response

    @handle_http_exc
    def bulk_get_applications(self, profiling_token, application_ids,
                              include_deleted=False):
        arcee = self.get_arcee_client(profiling_token)
        _, applications = arcee.applications_bulk_get(
            application_ids, include_deleted)
        return applications

    @handle_http_exc
    def update_application(self, profiling_token, application_id, **kwargs):
        arcee = self.get_arcee_client(profiling_token)
        _, updated_app = arcee.application_update(application_id, **kwargs)
        return updated_app

    @handle_http_exc
    def delete_application(self, profiling_token, application_id):
        arcee = self.get_arcee_client(profiling_token)
        arcee.application_delete(application_id)

    @handle_http_exc
    def list_application_runs(self, profiling_token, application_id):
        arcee = self.get_arcee_client(profiling_token)
        _, runs = arcee.applications_runs_get(application_id)
        for r in runs:
            Run.format(r)
        return runs

    @handle_http_exc
    def list_runs(self, profiling_token):
        arcee = self.get_arcee_client(profiling_token)
        _, runs = arcee.runs_bulk_get()
        for r in runs:
            Run.format(r)
        return runs

    @handle_http_exc
    def get_executors(self, profiling_token, application_ids=None, run_ids=None):
        if not application_ids and not run_ids:
            return []
        arcee = self.get_arcee_client(profiling_token)
        _, response = arcee.executors_get(application_ids, run_ids)
        for r in response:
            ArceeObject.format(r)
        return response

    @handle_http_exc
    def list_logs(self, profiling_token, run_id):
        arcee = self.get_arcee_client(profiling_token)
        _, logs = arcee.run_logs_get(run_id)
        for log in logs:
            ArceeObject.format(log)
        return logs

    @handle_http_exc
    def list_proc_data(self, profiling_token, run_id):
        arcee = self.get_arcee_client(profiling_token)
        _, proc_data = arcee.proc_data_get(run_id)
        for d in proc_data:
            ArceeObject.format(d)
        return proc_data

    @handle_http_exc
    def get_goal(self, profiling_token, goal_id):
        arcee = self.get_arcee_client(profiling_token)
        _, goal = arcee.goal_get(goal_id)
        ArceeObject.format(goal)
        return goal

    @handle_http_exc
    def list_goals(self, profiling_token):
        arcee = self.get_arcee_client(profiling_token)
        _, response = arcee.goals_get()
        for r in response:
            ArceeObject.format(r)
        return response

    @handle_http_exc
    def create_goal(self, profiling_token, **kwargs):
        arcee = self.get_arcee_client(profiling_token)
        _, goal = arcee.goals_create(**kwargs)
        ArceeObject.format(goal)
        return goal

    @handle_http_exc
    def update_goal(self, profiling_token, goal_id, **kwargs):
        arcee = self.get_arcee_client(profiling_token)
        _, updated = arcee.goals_update(goal_id, **kwargs)
        return updated

    @handle_http_exc
    def delete_goal(self, profiling_token, goal_id):
        arcee = self.get_arcee_client(profiling_token)
        arcee.goal_delete(goal_id)

    @handle_http_exc
    def get_run(self, profiling_token, run_id):
        arcee = self.get_arcee_client(profiling_token)
        _, run = arcee.run_get(run_id)
        Run.format(run)
        return run

    @handle_http_exc
    def list_milestones(self, profiling_token, run_id):
        arcee = self.get_arcee_client(profiling_token)
        _, milestones = arcee.run_milestones_get(run_id)
        for m in milestones:
            ArceeObject.format(m)
        return milestones

    @handle_http_exc
    def list_stages(self, profiling_token, run_id):
        arcee = self.get_arcee_client(profiling_token)
        _, run = arcee.run_get(run_id)
        _, stages = arcee.stages_get(run_id)
        stages_count = len(stages)
        stages_result = list()
        for i, v in enumerate(stages):
            start = v.pop("timestamp")
            stages_result.append(v)
            stages_result[i]['start'] = start
            if i > 0:
                stages_result[i - 1]['end'] = start
            if i == stages_count - 1:
                stages_result[i]['end'] = run['finish']
            ArceeObject.format(stages_result[i])
        return stages_result

    @handle_http_exc
    def get_leaderboard(self, profiling_token, application_id):
        arcee = self.get_arcee_client(profiling_token)
        _, leaderboard = arcee.leaderboard_get(application_id)
        ArceeObject.format(leaderboard)
        return leaderboard

    @handle_http_exc
    def create_leaderboard(self, profiling_token, application_id, **kwargs):
        arcee = self.get_arcee_client(profiling_token)
        _, leaderboard = arcee.leaderboards_create(application_id, **kwargs)
        ArceeObject.format(leaderboard)
        return leaderboard

    @handle_http_exc
    def create_leaderboard_dataset(self, profiling_token, leaderboard_id, **kwargs):
        arcee = self.get_arcee_client(profiling_token)
        _, leaderboard = arcee.leaderboard_dataset_create(leaderboard_id, **kwargs)
        ArceeObject.format(leaderboard)
        return leaderboard

    @handle_http_exc
    def update_leaderboard_dataset(self, profiling_token, leaderboard_dataset_id, **kwargs):
        arcee = self.get_arcee_client(profiling_token)
        _, leaderboard_dataset = arcee.leaderboard_dataset_update(leaderboard_dataset_id, **kwargs)
        ArceeObject.format(leaderboard_dataset)
        return leaderboard_dataset

    @handle_http_exc
    def list_leaderboard_dataset(self, profiling_token, leaderboard_id, **kwargs):
        arcee = self.get_arcee_client(profiling_token)
        _, leaderboard_datasets = arcee.leaderboard_datasets_get(leaderboard_id, **kwargs)
        for leaderboard_dataset in leaderboard_datasets:
            ArceeObject.format(leaderboard_dataset)
        return leaderboard_datasets

    @handle_http_exc
    def get_leaderboard_dataset(self, profiling_token, leaderboard_dataset_id):
        arcee = self.get_arcee_client(profiling_token)
        _, leaderboard_dataset = arcee.leaderboard_dataset_get(leaderboard_dataset_id)
        ArceeObject.format(leaderboard_dataset)
        return leaderboard_dataset

    @handle_http_exc
    def delete_leaderboard_dataset(self, profiling_token, leaderboard_dataset_id):
        arcee = self.get_arcee_client(profiling_token)
        arcee.leaderboard_dataset_delete(leaderboard_dataset_id)

    @handle_http_exc
    def update_leaderboard(self, profiling_token, application_id, **kwargs):
        arcee = self.get_arcee_client(profiling_token)
        _, updated = arcee.leaderboard_update(application_id, **kwargs)
        return updated

    @handle_http_exc
    def delete_leaderboard(self, profiling_token, application_id):
        arcee = self.get_arcee_client(profiling_token)
        arcee.leaderboard_delete(application_id)

    @handle_http_exc
    def get_leaderboard_details(self, profiling_token, application_id):
        arcee = self.get_arcee_client(profiling_token)
        _, leaderboard = arcee.leaderboard_details_get(application_id)
        ArceeObject.format(leaderboard)
        return leaderboard

    @handle_http_exc
    def get_leaderboard_dataset_details(self, profiling_token, leaderboard_dataset_id):
        arcee = self.get_arcee_client(profiling_token)
        _, leaderboard_dataset_details = arcee.leaderboard_dataset_details(leaderboard_dataset_id)
        for i in leaderboard_dataset_details:
            ArceeObject.format(i)
        return leaderboard_dataset_details

    @handle_http_exc
    def generate_leaderboard(self, profiling_token, leaderboard_dataset_id):
        arcee = self.get_arcee_client(profiling_token)
        _, leaderboard = arcee.leaderboard_generate(leaderboard_dataset_id)
        return leaderboard

    @handle_http_exc
    def bulk_gen_runs(self, profiling_token, application_id, run_ids):
        arcee = self.get_arcee_client(profiling_token)
        _, runs = arcee.runs_bulk_get_by_ids(application_id, run_ids)
        return runs

    @handle_http_exc
    def get_dataset(self, profiling_token, dataset_id):
        arcee = self.get_arcee_client(profiling_token)
        _, dataset = arcee.dataset_get(dataset_id)
        ArceeObject.format(dataset)
        return dataset

    @handle_http_exc
    def list_datasets(self, profiling_token, include_deleted=False):
        arcee = self.get_arcee_client(profiling_token)
        _, response = arcee.dataset_list(include_deleted)
        for r in response:
            ArceeObject.format(r)
        return response

    @handle_http_exc
    def create_dataset(self, profiling_token, **kwargs):
        arcee = self.get_arcee_client(profiling_token)
        _, dataset = arcee.dataset_create(**kwargs)
        ArceeObject.format(dataset)
        return dataset

    @handle_http_exc
    def update_dataset(self, profiling_token, dataset_id, **kwargs):
        arcee = self.get_arcee_client(profiling_token)
        _, dataset = arcee.dataset_update(dataset_id, **kwargs)
        return dataset

    @handle_http_exc
    def delete_dataset(self, profiling_token, dataset_id):
        arcee = self.get_arcee_client(profiling_token)
        arcee.dataset_delete(dataset_id)

    @handle_http_exc
    def list_labels(self, profiling_token):
        arcee = self.get_arcee_client(profiling_token)
        _, labels = arcee.labels_list()
        return labels

    @handle_http_exc
    def get_console(self, profiling_token, run_id):
        arcee = self.get_arcee_client(profiling_token)
        _, console = arcee.console_get(run_id)
        return console

    @handle_http_exc
    def get_executors_breakdown(self, profiling_token):
        arcee = self.get_arcee_client(profiling_token)
        _, breakdown = arcee.executors_breakdown_get()
        return breakdown
