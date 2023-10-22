import logging

from tools.optscale_exceptions.common_exc import (
    NotFoundException,
)
from rest_api.rest_api_server.controllers.base import BaseController
from rest_api.rest_api_server.controllers.base_async import BaseAsyncControllerWrapper
from rest_api.rest_api_server.exceptions import Err
from rest_api.rest_api_server.models.models import (
    HavaIntegration,
    Organization,
)

LOG = logging.getLogger(__name__)


class HavaIntegrationController(BaseController):
    def _get_model_type(self):
        return HavaIntegration

    def check_org(self, org_id):
        org = (
            self.session.query(Organization)
            .filter(Organization.id == org_id, Organization.deleted.is_(False))
            .one_or_none()
        )
        if not org:
            raise NotFoundException(Err.OE0002, [Organization.__name__, org_id])

    def get(self, org_id):
        self.check_org(org_id)
        hava_integration = (
            self.session.query(HavaIntegration)
            .filter(HavaIntegration.organization_id == org_id)
            .one_or_none()
        )
        return hava_integration

    # def patch(self, org_id, option_name, data, is_secret=False):
    #     self.check_org(org_id)
    #     options = super().list(organization_id=org_id, name=option_name)
    #     if len(options) > 1:
    #         raise WrongArgumentsException(Err.OE0177, [])
    #     elif len(options) == 0:
    #         res = super().create(organization_id=org_id, name=option_name,
    #                              value=data)
    #         return res.value
    #     else:
    #         option = json.loads(options[0].value)
    #         locked_by_user_id = option.get("locked_by")
    #         if locked_by_user_id:
    #             if not is_secret:
    #                 if self.token:
    #                     cur_user_id = self.get_user_id()
    #                     if cur_user_id != locked_by_user_id:
    #                         raise ForbiddenException(Err.OE0234, [])
    #                 else:
    #                     raise ForbiddenException(Err.OE0234, [])
    #         res = super().update(options[0].id, value=data)
    #         return res.value

    # def delete(self, org_id):
    #     self.check_org(org_id)
    #     options = super().list(organization_id=org_id)
    #     if len(options) > 1:
    #         raise WrongArgumentsException(Err.OE0177, [])
    #     elif len(options) == 0:
    #         raise NotFoundException(Err.OE0002, [OrganizationOption.__name__, org_id])
    #     else:
    #         super().delete(options[0].id)


class HavaIntegrationAsyncController(BaseAsyncControllerWrapper):
    def _get_controller_class(self):
        return HavaIntegrationController
