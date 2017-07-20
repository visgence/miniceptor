import json
import logging
from teleceptor import USE_DEBUG
import requests


class Reading:
    exposed = True

    if USE_DEBUG:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.DEBUG)
    else:
        logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)

    def GET(self, *args, **filter_arguments):
        # /api/reading/sensorname
        url = 'http://deserttest.visgence.com/api/readings?'
        for key in filter_arguments:
            if key == "ds":
                key1 = "datastream"
            else:
                key1 = key
            url += "{}={}&".format(key1, filter_arguments[key])
        url = url[:-1]
        data = requests.get(url)
        return json.dumps(data.json(), indent=2)
