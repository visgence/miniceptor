import json
import logging
import requests
from teleceptor import USE_DEBUG


class Sensor:
    exposed = True

    if USE_DEBUG:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.DEBUG)
    else:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

    def GET(self, sensor=None, *args, **filter_arguments):
        print 'did a get to sensor'

        # /api/sensor/sensorname
        return json.dumps(requests.get('http://deserttest.visgence.com/api/sensors/{}'.format(sensor)).json())
