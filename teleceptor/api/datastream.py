import json
import logging
from teleceptor import USE_DEBUG


class Datastream:
    exposed = True

    if USE_DEBUG:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.DEBUG)
    else:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

    def GET(self, stream_id=None, *args, **filter_arguments):
        print 'did a get'
        # api/datastream
        # Note: uuid can be anything, just using these to talk to deserttest in the meantime
        return json.dumps([{
            'uuid': '1',
            'paths': [
                '/stream/path',
                '/my/other/path'
            ],
            'sensoruuid': 'sensor1'
        }, {
            'uuid': '2',
            'paths': ['/otherpath/path'],
            'sensoruuid': 'sensor2'
        }, {
            'uuid': '3',
            'paths': ['/stream/path'],
            'sensoruuid': 'sensor3'
        }, {
            'uuid': '4',
            'paths': ['/stream/path'],
            'sensoruuid': 'sensor4'
        }])
