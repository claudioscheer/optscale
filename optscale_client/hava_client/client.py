import io
import json

import requests
import logging
from abc import ABCMeta
from urllib.parse import urlencode
from retrying import retry

DEFAULT_STOP_MAX_ATTEMPT_NUMBER = 10
DEFAULT_WAIT_FIXED = 100
DEFAULT_RETRY_ARGS = dict(
    stop_max_attempt_number=DEFAULT_STOP_MAX_ATTEMPT_NUMBER,
    wait_fixed=DEFAULT_WAIT_FIXED,
)

LOG = logging.getLogger(__name__)


def retry_if_connection_error(exception):
    if isinstance(exception, requests.ConnectionError):
        return True
    if isinstance(exception, requests.HTTPError):
        if exception.response.status_code in (503,):
            return True
    return False


class AbstractHttpProvider(metaclass=ABCMeta):
    def __init__(self, token="", extra_headers=None):
        self._token = token
        self._extra_headers = extra_headers or {}

    @property
    def headers(self):
        return {
            "Authorization": str("Bearer " + str(self._token)),
            "Content-type": "application/json",
            **self._extra_headers,
        }

    @property
    def token(self):
        return self._token

    @token.setter
    def token(self, value):
        self._token = value

    @property
    def extra_headers(self):
        return self._extra_headers

    @extra_headers.setter
    def extra_headers(self, value):
        self._extra_headers = value


class RequestsHttpProvider(AbstractHttpProvider):
    def __init__(self, url, token="", extra_headers=None, verify=True):
        self.url = url
        self.verify = verify
        self.session = requests.session()
        super().__init__(token, extra_headers)

    @retry(**DEFAULT_RETRY_ARGS, retry_on_exception=retry_if_connection_error)
    def request(self, path, method, data=None):
        full_url = self.url + path

        headers = self.headers
        if data and isinstance(data, io.IOBase):
            headers["Content-type"] = "application/octet-stream"
            data.seek(0, 2)
            headers["Content-length"] = str(data.tell())
            data.seek(0, 0)

        response = self.session.request(
            method, full_url, data=data, headers=headers, verify=self.verify
        )
        response.raise_for_status()
        response_body = None
        if response.status_code != requests.codes.no_content:
            if "application/json" in response.headers["Content-Type"]:
                response_body = json.loads(response.content.decode("utf-8"))
            if "text/plain" in response.headers["Content-Type"]:
                response_body = response.content.decode()
        return response.status_code, response_body

    def close(self):
        self.session.close()


class FetchMethodHttpProvider(AbstractHttpProvider):
    def __init__(
        self, fetch_method, rethrow=True, token="", extra_headers=None
    ):
        self.fetch = fetch_method
        self._rethrow = rethrow
        super().__init__(token, extra_headers)

    def request(self, url, method, body=None):
        response = self.fetch(
            url,
            method=method,
            body=body,
            headers=self.headers,
            allow_nonstandard_methods=True,
        )
        if self._rethrow:
            response.rethrow()
        response_body = None
        try:
            content_type = response.headers.get("Content-Type")
            if content_type:
                if "application/json" in content_type:
                    response_body = json.loads(response.body.decode("utf-8"))
                elif "text/plain" in content_type:
                    response_body = response.body.decode()
        except Exception as e:
            LOG.error("failed to decode response body %s", e)
            response_body = None
        return response.code, response_body

    def close(self):
        pass


class Client:
    def __init__(
        self,
        address="api.hava.io",
        url=None,
        http_provider=None,
        token="",
        extra_headers=None,
        verify=True,
    ):
        if http_provider is None:
            if url is None:
                url = "https://%s" % (address)
            http_provider = RequestsHttpProvider(
                url, token, extra_headers, verify
            )
        self._http_provider = http_provider

    @property
    def token(self):
        return self._http_provider.token

    @token.setter
    def token(self, value):
        self._http_provider.token = value

    @property
    def extra_headers(self):
        return self._http_provider.extra_headers

    @extra_headers.setter
    def extra_headers(self, value):
        self._http_provider.extra_headers = value

    def _url(self, sub_url):
        return "/%s" % (sub_url)

    def _request(self, url, method, body=None):
        data = None
        if body is not None:
            data = json.dumps(body)
        return self._http_provider.request(self._url(url), method, data)

    def get(self, url, body=None):
        if body:
            url = url + self.query_url(**body)
        return self._request(url, "GET")

    def post(self, url, body):
        return self._request(url, "POST", body)

    def put(self, url, body):
        return self._request(url, "PUT", body)

    def patch(self, url, body):
        return self._request(url, "PATCH", body)

    def delete(self, url):
        return self._request(url, "DELETE")

    @staticmethod
    def query_url(**query):
        query = {key: value for key, value in query.items() if value is not None}
        encoded_query = urlencode(query, doseq=True)
        return "?" + encoded_query

    def __del__(self):
        self._http_provider.close()

    def health_check_url(self):
        return "sources"

    def search_environments_url(self):
        return "search/environments"

    def health_check(self):
        return self.get(self.health_check_url())

    def search_environments(self, query=None):
        url = self.search_environments_url() + self.query_url(q=query)
        return self.get(url)
