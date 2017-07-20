import json
import os

PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

if os.path.exists(os.path.join(PATH, 'config.json')):
    conf = json.load(open(os.path.join(PATH, 'config.json')))

if 'USE_DEBUG' in conf:
    USE_DEBUG = conf['USE_DEBUG']
else:
    USE_DEBUG = False

if 'VERSION' in conf:
    USE_DEBUG = conf['VERSION']
else:
    USE_DEBUG = False
