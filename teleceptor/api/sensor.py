import json
import logging
from teleceptor import USE_DEBUG


class Sensor:
    exposed = True

    if USE_DEBUG:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.DEBUG)
    else:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

    def GET(self, datastream=None, *args, **filter_arguments):
        print 'did a get'

        # /api/sensor?datastream=x
        return json.dumps({
            'sensor': {
                'uuid': 'sensor1',
                'sensor_type': 'sensor_type',
                'units': 'units',
                'description': 'description',
                'name': 'name',
                'model': 'model',
                'last_value': 'last_value',
                'sensor_IOtype': 'sensor_IOtype',
                'meta_data': 'meta_data'
            }
        })
