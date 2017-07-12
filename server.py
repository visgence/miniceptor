
import os
import cherrypy
import jinja2
import json
import requests

PATH = os.path.abspath(os.path.dirname(__file__))
STATIC = os.path.join(PATH, 'static')

env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(searchpath=os.path.join(PATH, 'static/templates/')), )


class Root(object):

    def index(self, *args, **kwargs):
        webpack = json.load(open(os.path.join(PATH, 'webpack-stats.json')))
        context = {"bundle": webpack['chunks']['main'][0]['name']}
        t = env.get_template("index.html")
        return t.render(context)

    index.exposed = True

    def callTele(self):
        data = requests.get("http://deserttest.visgence.com/api/readings/?datastream=1&start=1498191400&end=1499896200").json()
        return json.dumps(data)
    callTele.exposed = True


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
