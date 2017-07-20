
import os
import cherrypy
import jinja2
import json
import requests
import time

PATH = os.path.abspath(os.path.dirname(__file__))
STATIC = os.path.join(PATH, 'static')

env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(searchpath=os.path.join(PATH, 'static/templates/')), )

with open('config.json') as data_file:
    VERSION = json.load(data_file)['VERSION']


class Root(object):

    def index(self, *args, **kwargs):
        src = json.load(open(os.path.join(PATH, 'webpack-stats.json')))
        vendor = json.load(open(os.path.join(PATH, 'webpack-stats.json')))
        context = {
            "src": src['chunks']['app'][0]['name'],
            "vendor": vendor['chunks']['vendor'][0]['name'],
            "version": VERSION
        }
        t = env.get_template("index.html")
        return t.render(context)

    index.exposed = True

    def callTele(self):
        cherrypy.response.headers['Content-Type'] = 'application/json'
        try:
            data = json.loads(cherrypy.request.body.read())
        except ValueError:
            data = {}
        startTime = int(time.time() - 86000)
        endTime = int(time.time())
        if 'start' in data and data['start'] is not None:
            startTime = int(data['start'])
        if 'end' in data and data['end'] is not None:
            endTime = int(data['end'])
        url = "http://deserttest.visgence.com/api/readings/?datastream=1&start={}&end={}".format(startTime, endTime)
        print url
        try:
            data = requests.get(url).json()
        except Exception, e:
            print "\nerror:"
            print e
            data = {"error": str(e)}
        return json.dumps(data)
    callTele.exposed = True

    def getTree(self):
        url = "http://deserttest.visgence.com/api/datastreams"
        try:
            data = requests.get(url).json()
        except Exception, e:
            print "error:"
            print e
            data = {"Error": e}

        return json.dumps(data)
    getTree.exposed = True


def get_cp_config():
    config = {
        '/': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': STATIC,
            'tools.sessions.on': True
        }
    }
    return config


def runserver(config):
    cherrypy.tree.mount(Root(), '/', config)
    cherrypy.server.socket_host = "0.0.0.0"
    cherrypy.server.socket_port = 8000
    cherrypy.engine.start()
    cherrypy.engine.block()


if __name__ == "__main__":
    runserver(get_cp_config())
else:
    cherrypy.config.update({'environment': 'embedded'})
    application = cherrypy.Application(Root(), script_name=None, config=get_cp_config())
