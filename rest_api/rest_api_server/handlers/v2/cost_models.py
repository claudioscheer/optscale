import json

from rest_api.rest_api_server.controllers.cost_model import (
    CostModelAsyncController, ResourceBasedAsyncCostModelController,
    CloudBasedAsyncCostModelController, SkuBasedAsyncCostModelController)
from rest_api.rest_api_server.handlers.v2.base import BaseHandler
from rest_api.rest_api_server.handlers.v1.base_async import (
    BaseAsyncCollectionHandler, BaseAsyncItemHandler)
from rest_api.rest_api_server.handlers.v1.base import BaseAuthHandler
from rest_api.rest_api_server.utils import run_task, ModelEncoder
from tools.optscale_exceptions.http_exc import OptHTTPError
from tools.optscale_exceptions.common_exc import NotFoundException


class CostModelsAsyncCollectionHandler(BaseAsyncCollectionHandler,
                                       BaseAuthHandler, BaseHandler):
    def _get_controller_class(self):
        return CostModelAsyncController

    async def get(self, organization_id):
        """
        ---
        description: |
            Get list of organization cost models
            Required permission: INFO_ORGANIZATION or CLUSTER_SECRET
        tags: [cost_models]
        summary: List of organization cost models
        parameters:
        -   in: path
            name: organization_id
            description: Organization id
            required: true
        responses:
            200:
                description: cost models list
                schema:
                    type: object
                    example:
                        cost_models:
                            type: array
                            items:
                                type: object
                                properties:
                                        id:
                                            type: string
                                            description: Unique cost model id
                                        organization_id:
                                            type: string
                                            description: Organization id
                                        type:
                                            type: string
                                            description: Cost model type
                                            enum: [cloud_account,resource]
                                        value:
                                            type: object
                                            description: Cost model config (depends on type)
                                        deleted_at:
                                            type: integer
                                            description: Deleted timestamp (service field)
                                        created_at:
                                            type: integer
                                            description: Created timestamp (service field)
            401:
                description: |
                    Unauthorized:
                    - OE0235: Unauthorized
                    - OE0237: This resource requires authorization
            403:
                description: |
                    Forbidden:
                    - OE0234: Forbidden
                    - OE0236: Bad secret
            404:
                description: |
                    Not found:
                    - OE0002: Organization not found
        security:
        - token: []
        - secret: []
        """
        if not self.check_cluster_secret(raises=False):
            await self.check_permissions('INFO_ORGANIZATION', 'organization',
                                         organization_id)
        res = await run_task(self.controller.list, organization_id)
        cost_models = {'cost_models': [c.to_dict() for c in res]}
        self.write(json.dumps(cost_models, cls=ModelEncoder))

    def post(self, **url_params):
        self.raise405()


class RecourceCostModelsAsyncHandler(BaseAsyncItemHandler, BaseAuthHandler, BaseHandler):
    def _get_controller_class(self):
        return ResourceBasedAsyncCostModelController

    async def get(self, id):
        """
        ---
        description: |
            Get environment resource cost model by id
            Required permission: INFO_ORGANIZATION
        tags: [cost_models]
        summary: Get environment resource cost model
        parameters:
        -   name: id
            in: path
            description: Cost model id
            required: true
            type: string
        responses:
            200:
                description: Cost model data
                schema:
                    type: object
                    properties:
                        id:
                            type: string
                            description: Unique cost model id
                        organization_id:
                            type: string
                            description: Organization id
                        type:
                            type: string
                            description: Cost model type
                            enum: [cloud_account, resource]
                        value:
                            type: object
                            description: Cost model value
                            properties:
                                hourly_cost:
                                    type: number
                                    description: Hourly cost
                        deleted_at:
                            type: integer
                            description: Deleted timestamp (service field)
                        created_at:
                            type: integer
                            description: Created timestamp (service field)
            401:
                description: |
                    Unauthorized:
                    - OE0235: Unauthorized
                    - OE0237: This resource requires authorization
            403:
                description: |
                    Forbidden:
                    - OE0234: Forbidden
            404:
                description: |
                    Not found:
                    - OE0002: Object not found
        security:
        - token: []
        """
        await self.check_permissions(
            'INFO_ORGANIZATION', 'cloud_resource', id)
        await super().get(id)

    async def patch(self, id):
        """
        ---
        description: |
            Modifies an existing environment resource cost model
            Required permission: MANAGE_RESOURCES
        tags: [cost_models]
        summary: Edit environment resource cost model
        parameters:
        -   name: id
            in: path
            description: Cost model
            required: true
            type: string
        -   name: body
            in: body
            description: Body with cost model
            required: true
            schema:
                type: object
                properties:
                    value:
                        type: object
                        description: Cost model value
                        required: true
                        properties:
                            hourly_cost:
                                type: number
                                description: Hourly cost
        responses:
            200: {description: Success (returns modified object)}
            400:
                description: |
                    Wrong arguments:
                    - OE0211: Parameter is immutable
                    - OE0212: Unexpected parameters
                    - OE0216: Argument is not provided
                    - OE0219: Argument should be a string with valid JSON
                    - OE0436: Cloud type is not supported
                    - OE0344: Argument should be a dictionary
                    - OE0466: Argument should be float
                    - OE0483: Clusters are not supported
            401:
                description: |
                    Unauthorized:
                    - OE0235: Unauthorized
                    - OE0237: This resource requires authorization
            403:
                description: |
                    Forbidden:
                    - OE0234: Forbidden
                    - OE0236: Bad secret
            404:
                description: |
                    Not found:
                    - OE0002: Object not found
        security:
        - token: []
        """
        await self.check_permissions(
            'MANAGE_RESOURCES', 'cloud_resource', id)
        await super().patch(id)

    def delete(self, id, **kwargs):
        self.raise405()


class CloudAccountCostModelsAsyncHandler(BaseAsyncItemHandler, BaseAuthHandler, BaseHandler):
    def _get_controller_class(self):
        return CloudBasedAsyncCostModelController

    async def get(self, id):
        """
        ---
        description: |
            Get cloud account cost model by id
            Required permission: INFO_ORGANIZATION
        tags: [cost_models]
        summary: Get cloud account cost model
        parameters:
        -   name: id
            in: path
            description: Cost model id
            required: true
            type: string
        responses:
            200:
                description: Cost model data
                schema:
                    type: object
                    properties:
                        id:
                            type: string
                            description: Unique cost model id
                        organization_id:
                            type: string
                            description: Organization id
                        type:
                            type: string
                            description: Cost model type
                            enum: [cloud_account, resource]
                        value:
                            type: object
                            description: Cost model value
                            properties:
                                cpu_hourly_cost:
                                    type: number
                                    description: CPU hourly cost
                                memory_hourly_cost:
                                    type: number
                                    description: RAM memory hourly cost
                        deleted_at:
                            type: integer
                            description: Deleted timestamp (service field)
                        created_at:
                            type: integer
                            description: Created timestamp (service field)
            401:
                description: |
                    Unauthorized:
                    - OE0235: Unauthorized
                    - OE0237: This resource requires authorization
            403:
                description: |
                    Forbidden:
                    - OE0234: Forbidden
            404:
                description: |
                    Not found:
                    - OE0002: Object not found
        security:
        - token: []
        """
        await self.check_permissions(
            'INFO_ORGANIZATION', 'cloud_account', id)
        await super().get(id)

    async def patch(self, id):
        """
        ---
        description: |
            Modifies an existing cloud account cost model
            Required permission: MANAGE_CLOUD_CREDENTIALS
        tags: [cost_models]
        summary: Edit cloud account cost model
        parameters:
        -   name: id
            in: path
            description: Cost model id
            required: true
            type: string
        -   name: body
            in: body
            description: Body with cost model
            required: true
            schema:
                type: object
                properties:
                    value:
                        type: object
                        description: Cost model value
                        required: true
                        properties:
                            cpu_hourly_cost:
                                type: number
                                description: CPU hourly cost
                            memory_hourly_cost:
                                type: number
                                description: RAM memory hourly cost
        responses:
            200: {description: Success (returns modified object)}
            400:
                description: |
                    Wrong arguments:
                    - OE0211: Parameter is immutable
                    - OE0212: Unexpected parameters
                    - OE0216: Argument is not provided
                    - OE0219: Argument should be a string with valid JSON
                    - OE0436: Cloud type is not supported
                    - OE0344: Argument should be a dictionary
                    - OE0466: Argument should be float
            401:
                description: |
                    Unauthorized:
                    - OE0235: Unauthorized
                    - OE0237: This resource requires authorization
            403:
                description: |
                    Forbidden:
                    - OE0234: Forbidden
                    - OE0236: Bad secret
            404:
                description: |
                    Not found:
                    - OE0002: Object not found
        security:
        - token: []
        """
        await self.check_permissions('MANAGE_CLOUD_CREDENTIALS',
                                     'cloud_account', id)
        await run_task(self.controller.get_cloud_account, id)
        await super().patch(id)

    def delete(self, id, **kwargs):
        self.raise405()


class SkuCostModelsAsyncHandler(BaseAsyncItemHandler, BaseAuthHandler,
                                BaseHandler):
    def _get_controller_class(self):
        return SkuBasedAsyncCostModelController

    async def get(self, id):
        """
        ---
        description: |
            Get sku cost model by id
            Required permission: INFO_ORGANIZATION
        tags: [cost_models]
        summary: Get sku cost model
        parameters:
        -   name: id
            in: path
            description: Cost model id
            required: true
            type: string
        -   name: details
            in: query
            type: boolean
            description: Cost model details
            required: false
        responses:
            200:
                description: Cost model data
                schema:
                    type: object
                    properties:
                        id:
                            type: string
                            description: Unique cost model id
                        organization_id:
                            type: string
                            description: Organization id
                        type:
                            type: string
                            description: Cost model type
                            enum: [cloud_account, resource]
                        value:
                            type: object
                            description: Cost model value
                            properties:
                                sku_name_1:
                                    type: number
                                    description: sku cost
                                sku_name_2:
                                    type: number
                                    description: sku cost
                        used_skus:
                            type: array
                            items:
                                type: string
                                description: found sku
                        deleted_at:
                            type: integer
                            description: Deleted timestamp (service field)
                        created_at:
                            type: integer
                            description: Created timestamp (service field)
            401:
                description: |
                    Unauthorized:
                    - OE0235: Unauthorized
                    - OE0237: This resource requires authorization
            403:
                description: |
                    Forbidden:
                    - OE0234: Forbidden
            404:
                description: |
                    Not found:
                    - OE0002: Object not found
        security:
        - token: []
        """
        details = self.get_arg('details', bool, False)
        await self.check_permissions('INFO_ORGANIZATION', 'cloud_account', id)
        try:
            item = await run_task(self.controller.get_cost_model_info, id,
                                  details=details)
        except NotFoundException as ex:
            raise OptHTTPError.from_opt_exception(404, ex)
        self.write(json.dumps(item, cls=ModelEncoder))

    async def patch(self, id):
        """
        ---
        description: |
            Modifies an existing sku cost model
            Required permission: MANAGE_CLOUD_CREDENTIALS
        tags: [cost_models]
        summary: Edit sku cost model
        parameters:
        -   name: id
            in: path
            description: Cost model id
            required: true
            type: string
        -   name: body
            in: body
            description: Body with cost model
            required: true
            schema:
                type: object
                properties:
                    value:
                        type: object
                        description: Cost model value
                        required: true
                        properties:
                            sku_name_1:
                                type: number
                                description: sku cost
                            sku_name_2:
                                type: number
                                description: sku cost
        responses:
            200: {description: Success (returns modified object)}
            400:
                description: |
                    Wrong arguments:
                    - OE0211: Parameter is immutable
                    - OE0212: Unexpected parameters
                    - OE0216: Argument is not provided
                    - OE0219: Argument should be a string with valid JSON
                    - OE0436: Cloud type is not supported
                    - OE0344: Argument should be a dictionary
                    - OE0466: Argument should be float
            401:
                description: |
                    Unauthorized:
                    - OE0235: Unauthorized
                    - OE0237: This resource requires authorization
            403:
                description: |
                    Forbidden:
                    - OE0234: Forbidden
                    - OE0236: Bad secret
            404:
                description: |
                    Not found:
                    - OE0002: Object not found
        security:
        - token: []
        """
        if not self.check_cluster_secret(raises=False):
            await self.check_permissions('MANAGE_CLOUD_CREDENTIALS',
                                         'cloud_account', id)
        await run_task(self.controller.get_cloud_account, id)
        await super().patch(id)

    def delete(self, id, **kwargs):
        self.raise405()
