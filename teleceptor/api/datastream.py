import json
import logging
from teleceptor import USE_DEBUG
import requests
import cherrypy


class Datastream:
    exposed = True

    if USE_DEBUG:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.DEBUG)
    else:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

    def GET(self, stream_id=None, *args, **filter_arguments):
        print 'get request to stream'

        # print filter_arguments
        # print args
        print stream_id

        paths = []
        if stream_id is not None:
            url = 'http://deserttest.visgence.com/api/datastreams/{}'.format(stream_id)
            print url
            data = requests.get(url).json()
            return json.dumps(data, indent=4)

        data = requests.get('http://deserttest.visgence.com/api/datastreams').json()
        for i in data['datastreams']:
            if 'filter' in filter_arguments:
                if filter_arguments['filter'] == 'Sensor':
                    if not "{}".format(i['sensor']).startswith('{}'.format(filter_arguments['word'])):
                        continue
                if filter_arguments['filter'] == 'Stream':
                    if not "{}".format(i['name']).startswith('{}'.format(filter_arguments['word'])):
                        continue
            for j in i['paths']:
                if 'filter' in filter_arguments:
                    if filter_arguments['filter'] == 'Folder':
                        print j
                        if not "{}".format(j).startswith('/{}'.format(filter_arguments['word'])):
                            continue
                paths.append(['{}/{}'.format(j, i['name']), i['id'], i['sensor']])
        return json.dumps(paths)
        print data
