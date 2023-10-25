from unittest.mock import patch
from rest_api.rest_api_server.tests.unittests.test_api_base import TestApiBase


class TestHavaIntegrationApi(TestApiBase):
    def setUp(self, version="v2"):
        super().setUp(version)

        code, self.root = self.create_organization("root_name")
        self.code, self.organization = self.create_organization("test_name")
        patch(
            "rest_api.rest_api_server.controllers.employee.EmployeeController."
            "notification_domain_blacklist"
        ).start()
        self.auth_user = self.gen_id()
        _, self.employee = self.client.employee_create(
            self.organization["id"],
            {"name": "employee", "auth_user_id": self.auth_user},
        )

    def create_organization(self, name):
        bu_dict = {"name": name}
        return self.client.organization_create(bu_dict)

    def test_create_hava_integration(self):
        organization_id = self.organization["id"]
        code, hava_integration = self.client.hava_integration_create(
            {
                "hava_api_key": "test_key",
                "enabled": True,
                "organization_id": organization_id,
            }
        )
        self.assertIsNotNone(hava_integration)
        self.assertEqual(hava_integration["organization_id"], organization_id)
        self.assertEqual(code, 201)

    def test_hava_integration_not_found(self):
        organization_id = self.organization["id"]
        code, hava_integration = self.client.hava_integration_get(organization_id)

        self.assertIsNotNone(hava_integration)
        self.assertEqual(code, 404)

    def test_get_hava_integration(self):
        organization_id = self.organization["id"]
        code, hava_integration = self.client.hava_integration_create(
            {
                "hava_api_key": "test_key",
                "enabled": True,
                "organization_id": organization_id,
            }
        )
        self.assertIsNotNone(hava_integration)
        self.assertEqual(hava_integration["organization_id"], organization_id)
        self.assertEqual(code, 201)

        code, response = self.client.hava_integration_get(organization_id)

        self.assertIsNotNone(response)
        self.assertEqual(response["hava_api_key"], "test_key")
        self.assertEqual(code, 200)

    def test_patch_hava_integration(self):
        organization_id = self.organization["id"]
        code, hava_integration = self.client.hava_integration_create(
            {
                "hava_api_key": "test_key",
                "enabled": True,
                "organization_id": organization_id,
            }
        )
        self.assertIsNotNone(hava_integration)
        self.assertEqual(hava_integration["organization_id"], organization_id)
        self.assertEqual(hava_integration["enabled"], True)
        self.assertEqual(code, 201)

        code, response = self.client.hava_integration_patch(
            organization_id,
            {
                "hava_api_key": "test_key_2",
                "enabled": False,
            },
        )

        self.assertIsNotNone(response)
        self.assertEqual(response["hava_api_key"], "test_key_2")
        self.assertEqual(response["enabled"], False)
        self.assertEqual(code, 200)
