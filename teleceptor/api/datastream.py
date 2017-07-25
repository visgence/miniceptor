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
        print 'get request to stream'
        # api/datastream
        data = requests.get('http://deserttest.visgence.com/api/datastreams').json();
        paths = []
        # print data
        for i in data['datastreams']:
            for j in i['paths']:
                paths.append(['{}/{}'.format(j, i['name']), i['id']])
        paths = [['test/stream1', 1], ['test/stream2', 2]]
        return json.dumps(paths)
