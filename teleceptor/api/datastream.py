import json
import logging
from teleceptor import USE_DEBUG
import requests


class Datastream:
    exposed = True

    if USE_DEBUG:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.DEBUG)
    else:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

    def GET(self, stream_id=None, *args, **filter_arguments):
        print 'did a get'
        # api/datastream
        return json.dumps(requests.get('http://deserttest.visgence.com/api/datastreams').json())
