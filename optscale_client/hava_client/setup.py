#!/usr/bin/env python
from setuptools import setup


requirements = ["requests==2.31.0", "retrying>=1.3.3"]

setup(
    name="hava-client",
    description="Hava API Client",
    url="http://hava.io",
    author="Hava",
    author_email="sales@hava.io",
    package_dir={"hava_client": ""},
    packages=["hava_client"],
    install_requires=requirements,
)
