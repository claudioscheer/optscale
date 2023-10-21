import unittest
import multiprocessing
from concurrencytest import ConcurrentTestSuite, fork_for_tests

TESTS_PATH = '/usr/src/app/rest_api/rest_api_server/tests/unittests'
CONCURRENT = False
PATTERN = 'test_hava_integration_api.py'


def get_concurrency_num():
    return multiprocessing.cpu_count() // 2 or 1


runner = unittest.TextTestRunner(verbosity=2)
discovered_tests = unittest.TestLoader().discover(TESTS_PATH,
                                                  pattern=PATTERN)
if CONCURRENT:
    concurrent_suite = ConcurrentTestSuite(discovered_tests,
                                           fork_for_tests(get_concurrency_num()))
    result = runner.run(concurrent_suite)
else:
    result = runner.run(discovered_tests)
if result.errors or result.failures:
    exit(1)
