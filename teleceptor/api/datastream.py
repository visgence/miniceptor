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
        data = requests.get('http://deserttest.visgence.com/api/datastreams').json();
        paths = []
        # print data
        print 'here'
        for i in data['datastreams']:
            for j in i['paths']:
                paths.append('{}/{}'.format(j, i['name']))
        print paths
        paths = ['test/stream1', 'test/stream2']
        return json.dumps(paths)
