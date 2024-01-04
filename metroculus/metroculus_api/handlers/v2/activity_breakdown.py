import json
import logging

from metroculus.metroculus_api.controllers.activity_breakdown import (
    ActivityBreakdownAsyncController)
from metroculus.metroculus_api.handlers.v2.base import SecretHandler
from metroculus.metroculus_api.utils import ModelEncoder

from tools.optscale_exceptions.common_exc import (
    WrongArgumentsException, UnauthorizedException, NotFoundException)
from tools.optscale_exceptions.http_exc import OptHTTPError

LOG = logging.getLogger(__name__)


class ActivityBreakdownHandler(SecretHandler):
    def _get_controller_class(self):
        return ActivityBreakdownAsyncController

    async def get(self):
        """
        ---
        tags: [activity_breakdown]
        summary: Metrics breakdown per hour and day of week.
        description: |
            Matrix of metric values per hour and day of week
            Required permission: cluster secret
        parameters:
        -   in: query
            name: cloud_account_id
            description: Cloud account id
            required: true
            type: string
        -   in: query
            name: resource_id
            description: resource_id, repeated
            required: true
            type: string
        -   in: query
            name: start_date
            description: start_date in timestamp
            required: true
            type: integer
        -   in: query
            name: end_date
            description: end_date in timestamp
            required: true
            type: integer
        -   in: query
            name: meter_name
            description: meter_name (cpu, ram, disk_read_io, disk_write_io,
                network_in_io, network_out_io), repeated
            required: true
            type: string
        responses:
            200:
                description: Metrics breakdown
                schema:
                    type: object
                    example:
                        4872fd1d-e519-4bf1-a611-404d112982d7:
                            'cpu': [
                                0.5,0.5,0.5,0.8,0.9,9.1,6.1,13.9,11.1,12.4,8.6,
                                0.6,0.6,0.6,0.6,1.3,6.2,2.2,13.4,14.9,15.4,10.0,
                                0.5,0.5,0.5,0.6,1.1,1.6,7.0,15.6,18.5,6.7,13.7,
                                0.6,0.5,0.5,0.5,0.7,0.8,6.4,14.5,16.3,19.1,4.7,
                                1.6,0.6,0.5,0.5,0.6,7.6,8.5,1.71,5.54,6.82,5.16,
                                0.5,0.5,0.5,0.5,0.5,0.5,0.6,1.2,4.0,0.5,0.5,1.0,
                                0.7,0.5,0.5,0.5,0.5,0.5,0.5,1.3,0.5,0.5,0.57]
            400:
                description: |
                    Wrong arguments:
                    - OM0006: Invalid parameter
                    - OM0008: Parameter is not provided
            401:
                description: |
                    Unauthorized:
                    - OM0007: This resource requires authorization
            403:
                description: |
                    Forbidden:
                    - OM0005: Bad secret
        security:
        - secret: []
        """
        self.check_cluster_secret()
        url_params = {
            'cloud_account_id': self.get_arg('cloud_account_id', str),
            'resource_ids': self.get_arg('resource_id', str, repeated=True),
            'start_date': self.get_arg('start_date', int),
            'end_date': self.get_arg('end_date', int),
            'meter_names': self.get_arg('meter_name', str, repeated=True),
        }
        try:
            res = await self.controller.get(**url_params)
        except WrongArgumentsException as ex:
            raise OptHTTPError.from_opt_exception(400, ex)
        except UnauthorizedException as ex:
            raise OptHTTPError.from_opt_exception(401, ex)
        except NotFoundException as ex:
            raise OptHTTPError.from_opt_exception(404, ex)
        self.set_status(200)
        self.write(json.dumps(res, cls=ModelEncoder))
