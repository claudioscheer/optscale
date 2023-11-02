#!/usr/bin/env python
import sys
from setuptools import setup


requirements = ['tornado==6.3.3', 'requests==2.31.0']

setup(name='optscale-exceptions',
      description='OptScale Exceptions',
      url='http://hystax.com',
      author='Hystax',
      author_email='info@hystax.com',
      package_dir={'optscale_exceptions': ''},
      packages=['optscale_exceptions'],
      install_requires=requirements,
      )
