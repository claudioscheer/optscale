import json
from tools.optscale_exceptions.common_exc import NotFoundException
from tools.optscale_exceptions.http_exc import OptHTTPError
from rest_api.rest_api_server.handlers.v2.base import BaseHandler
from rest_api.rest_api_server.handlers.v1.base_async import (
    BaseAsyncCollectionHandler,
    BaseAsyncItemHandler,
)
from rest_api.rest_api_server.handlers.v1.base import BaseAuthHandler
from rest_api.rest_api_server.utils import ModelEncoder
from rest_api.rest_api_server.controllers.hava_integration import (
    HavaIntegrationAsyncController,
)
from rest_api.rest_api_server.utils import ModelEncoder, run_task


class HavaIntegrationAsyncCollectionHandler(BaseAsyncCollectionHandler, BaseHandler):
    def _get_controller_class(self):
        return HavaIntegrationAsyncController

    async def post(self, **url_params):
        """
        ---
        description: |
            Create new Hava integration
            Required permission: TOKEN
        summary: Create Hava integration
        tags: [hava]
        parameters:
        -   in: body
            name: body
            description: Hava integration to create
            required: true
            schema:
                type: object
                properties:
                    organization_id:
                        type: string
                        description: Organization ID
                        required: True
                        example: 17cb0d9f-2f42-4f26-beeb-220ef946274c
                    hava_api_key:
                        type: string
                        description: Hava API key
                        required: True
                        example: eyJhbGciOiJIUz.eyJzd.SflKxwR
                    enabled:
                        type: boolean
                        example: True
                        description: Hava integration enabled
                        required: True
                        default: False
        responses:
            201:
                description: Success (returns created object)
                schema:
                    type: object
                    example:
                        organization_id: 17cb0d9f-2f42-4f26-beeb-220ef946274c
                        hava_api_key: eyJhbGciOiJIUz.eyJzd.SflKxwR
                        enabled: True
            400:
                description: |
                    Wrong arguments:
                    - OE0212: Unexpected parameters
                    - OE0211: Immutable parameters
                    - OE0216: Argument not provided
                    - OE0214: Argument should be a string
                    - OE0215: Wrong argument's length
            401: {description: "Unauthorized: \n\n
                - OE0235: Unauthorized\n\n
                - OE0237: This resource requires authorization"}
            403: {description: "Forbidden: \n\n
                - OE0234: Forbidden"}
        security:
        - token: []
        """
        data = self._request_body()
        res = await run_task(self.controller.create, **data)

        self.set_status(201)
        self.write(res.to_json())


class HavaAsyncItemHandler(BaseAsyncItemHandler, BaseAuthHandler, BaseHandler):
    def _get_controller_class(self):
        return HavaIntegrationAsyncController

    async def get(self, organization_id, **kwargs):
        """
        ---
        description: >
            Gets Hava integration info by ID\n\n
            Required permission: INFO_ORGANIZATION or CLUSTER_SECRET
        tags: [hava]
        summary: Get Hava integration
        parameters:
        -   name: organization_id
            in: path
            description: Organization ID
            required: true
            type: string
        responses:
            200:
                description: Hava integration data
                schema:
                    type: object
                    properties:
                        organization_id: {type: string,
                            description: "Organization ID"}
                        hava_api_key: {type: string,
                            description: "Hava API key"}
                        enabled: {type: boolean,
                            description: "Hava integration enabled"}
            400:
                description: |
                    Wrong arguments:
                    - OE0217: Invalid query parameter
            401: {description: "Unauthorized: \n\n
                - OE0235: Unauthorized\n\n
                - OE0237: This resource requires authorization"}
            403: {description: "Forbidden: \n\n
                - OE0234: Forbidden\n\n
                - OE0236: Bad secret"}
            404: {description: "Not found: \n\n
                - OE0002: Organization not found"}
        security:
        - token: []
        - secret: []
        """
        if not self.check_cluster_secret(raises=False):
            await self.check_permissions(
                "INFO_ORGANIZATION", "organization", organization_id
            )

        item = await run_task(self.controller.get, organization_id, **kwargs)
        if not item:
            self.write(json.dumps({}))
        else:
            hava_integration = item.to_dict()
            self.write(json.dumps(hava_integration, cls=ModelEncoder))

    async def patch(self, organization_id, **kwargs):
        """
        ---
        description: |
            Modifies an existing Hava integration\n\n
            Required permission: EDIT_PARTNER or CLUSTER_SECRET
        tags: [organizations]
        summary: Edit Hava integration
        parameters:
        -   name: id
            in: path
            description: Organization ID
            required: true
            type: string
        -   in: body
            name: body
            description: Hava integration to modify
            required: true
            schema:
                type: object
                properties:
                    hava_api_key:
                        type: string
                        description: Hava API key
                        required: True
                        example: eyJhbGciOiJIUz.eyJzd.SflKxwR
                    enabled:
                        type: boolean
                        example: True
                        description: Hava integration enabled
                        required: True
                        default: False
        responses:
            200:
                description: Modified Hava integration
                schema:
                    type: object
                    example:
                        organization_id: 17cb0d9f-2f42-4f26-beeb-220ef946274c
                        hava_api_key: eyJhbGciOiJIUz.eyJzd.SflKxwR
                        enabled: True
            400: {description: "Wrong arguments: \n\n
                - OE0212: Unexpected parameters \n\n
                - OE0211: Immutable parameters \n\n
                - OE0223: Argument should be integer \n\n
                - OE0224: Wrong int argument value \n\n
                - OE0214: Argument should be a string \n\n
                - OE0215: Wrong argument's length \n\n
                - OE0536: Invalid currency"}
            404: {description: "Not found: \n\n
                - OE0002: Organization or Hava integration not found"}
            403:
                description: |
                    Forbidden:
                    - OE0379: Target owner doesn't have enough permissions for target pool
                    - OE0234: Forbidden
            401: {description: "Unauthorized: \n\n
                - OE0235: Unauthorized\n\n
                - OE0237: This resource requires authorization"}
            424:
                description: |
                    Failed dependency:
                    - OE0500: currency cannot be changed while organization has
                     connected cloud accounts
        security:
        - token: []
        - secret: []
        """
        await super().patch(organization_id, **kwargs)
