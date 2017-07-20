import json
import logging
from teleceptor import USE_DEBUG


class Reading:
    exposed = True

    if USE_DEBUG:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.DEBUG)
    else:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

    def GET(self, stream_id=None, *args, **filter_arguments):
        print 'did a get'
        # /api/datastream
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
            },
            'readings': [
                (1, 0),
                (2, 10),
                (3, 4),
                (4, 6),
                (5, 4),
                (6, 2),
            ]
        })
