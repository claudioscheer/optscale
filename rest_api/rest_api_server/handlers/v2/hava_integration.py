import json
from tools.optscale_exceptions.common_exc import NotFoundException
from tools.optscale_exceptions.http_exc import OptHTTPError
from rest_api.rest_api_server.handlers.v2.base import BaseHandler
from rest_api.rest_api_server.handlers.v1.base_async import BaseAsyncItemHandler
from rest_api.rest_api_server.handlers.v1.base import BaseAuthHandler
from rest_api.rest_api_server.utils import ModelEncoder
from rest_api.rest_api_server.controllers.hava_integration import HavaIntegrationAsyncController
from rest_api.rest_api_server.utils import ModelEncoder, run_task


class HavaAsyncItemHandler(BaseAsyncItemHandler, BaseAuthHandler, BaseHandler):
    def _get_controller_class(self):
        return HavaIntegrationAsyncController

    async def _get_item(self, org_id, **kwargs):
        res = await run_task(self.controller.get, org_id, **kwargs)
        if not res:
            res = await run_task(self.controller.create, organization_id=org_id, enabled=False, **kwargs)
        return res

    async def get(self, organization_id, **kwargs):
        """
        ---
        description: >
            Gets Hava organization info by ID\n\n
            Required permission: INFO_ORGANIZATION or CLUSTER_SECRET
        tags: [hava]
        summary: Get Hava organization
        parameters:
        -   name: organization_id
            in: path
            description: Organization ID
            required: true
            type: string
        responses:
            200:
                description: Hava organization data
                schema:
                    type: object
                    properties:
                        id: {type: string,
                            description: "Unique organization id"}
                        name: {type: string,
                            description: "Organization display name"}
                        deleted_at: {type: string,
                            description: "Deleted timestamp (service field)"}
                        pool_id: {type: string,
                            description: "organization pool id"}
                        is_demo: {type: boolean,
                            description: "Is demo organization or not"}
                        currency: {type: string,
                            description: "Organization currency"}
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
                - OE0002: Hava organization data not found"}
        security:
        - token: []
        - secret: []
        """
        if not self.check_cluster_secret(raises=False):
            await self.check_permissions(
                "INFO_ORGANIZATION", "organization", organization_id
            )
        try:
            item = await self._get_item(organization_id, **kwargs)
        except NotFoundException as ex:
            raise OptHTTPError.from_opt_exception(404, ex)
        organization = item.to_dict()
        self.write(json.dumps(organization, cls=ModelEncoder))

    # async def patch(self, id, **kwargs):
    #     """
    #     ---
    #     description: |
    #         Modifies an existing organization
    #         Required permission: EDIT_PARTNER or CLUSTER_SECRET
    #     tags: [organizations]
    #     summary: Edit organization
    #     parameters:
    #     -   name: id
    #         in: path
    #         description: Organization ID
    #         required: true
    #         type: string
    #     -   in: body
    #         name: body
    #         description: Organization to modify
    #         required: true
    #         schema:
    #             type: object
    #             properties:
    #                 name:
    #                     type: string
    #                     example: new name
    #                     description: new organization display name
    #                     required: False
    #                 currency:
    #                     type: string
    #                     example: USD
    #                     description: new organization currency
    #                     required: False
    #     responses:
    #         200:
    #             description: Modified organization
    #             schema:
    #                 type: object
    #                 example:
    #                     id: 17cb0d9f-2f42-4f26-beeb-220ef946274c
    #                     pool_id: 3d5a56e1-6e48-4d65-945a-a46f3a48e6e3
    #                     created_at: 1585680056
    #                     deleted_at: 0
    #                     name: test company
    #                     is_demo: False
    #                     currency: USD
    #         400: {description: "Wrong arguments: \n\n
    #             - OE0212: Unexpected parameters \n\n
    #             - OE0211: Immutable parameters \n\n
    #             - OE0223: Argument should be integer \n\n
    #             - OE0224: Wrong int argument value \n\n
    #             - OE0214: Argument should be a string \n\n
    #             - OE0215: Wrong argument's length \n\n
    #             - OE0536: Invalid currency"}
    #         404: {description: "Not found: \n\n
    #             - OE0002: Organization not found"}
    #         403:
    #             description: |
    #                 Forbidden:
    #                 - OE0379: Target owner doesn't have enough permissions for target pool
    #                 - OE0234: Forbidden
    #         401: {description: "Unauthorized: \n\n
    #             - OE0235: Unauthorized\n\n
    #             - OE0237: This resource requires authorization"}
    #         424:
    #             description: |
    #                 Failed dependency:
    #                 - OE0500: currency cannot be changed while organization has
    #                  connected cloud accounts
    #     security:
    #     - token: []
    #     - secret: []
    #     """
    #     await super().patch(id, **kwargs)

    # async def delete(self, id, **kwargs):
    #     """
    #     ---
    #     description: >
    #         Deletes a organization with specified id\n\n
    #         Required permission: DELETE_PARTNER or CLUSTER_SECRET
    #     tags: [organizations]
    #     summary: Delete organization
    #     parameters:
    #     -   name: id
    #         in: path
    #         description: Organization ID
    #         required: true
    #         type: string
    #     responses:
    #         204: {description: Success}
    #         401: {description: "Unauthorized: \n\n
    #             - OE0235: Unauthorized\n\n
    #             - OE0237: This resource requires authorization"}
    #         403: {description: "Forbidden: \n\n
    #             - OE0234: Forbidden"}
    #         404: {description: "Not found: \n\n
    #             - OE0002: Organization not found"}
    #     security:
    #     - token: []
    #     - secret: []
    #     """
    #     await super().delete(id, **kwargs)
