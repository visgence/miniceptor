
import os
import cherrypy
import jinja2
import json
import requests
import time
from teleceptor.api import ResourceApi

PATH = os.path.abspath(os.path.dirname(__file__))
STATIC = os.path.join(PATH, 'static')

env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(searchpath=os.path.join(PATH, 'static/templates/')), )

with open('config.json') as data_file:
    VERSION = json.load(data_file)['VERSION']


class Root(object):
    api = ResourceApi()

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


def get_cp_config():
    config = {
        '/': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': STATIC,
            'tools.sessions.on': True
        },
        '/api': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher()
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
