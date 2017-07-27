import json
import sys
import os

if __name__ == "__main__":
    args = sys.argv
    if len(args) < 2:
        print "Which version would you like to increment?"
    else:
        minor = False
        if(args[1] == '-minor'):
            minor = True

        with open('config.json', 'r') as config:
            data = json.load(config)
            version = data['VERSION'].split('.')
            print "Current Version: {}".format(data['VERSION'])
            if minor:
                newVersion = "{}.{}.{}".format(version[0], version[1], int(version[2]) + 1)
            else:
                newVersion = "{}.{}.0".format(version[0], int(version[1]) + 1)
            print "New Version: {}".format(newVersion)
            data['VERSION'] = newVersion
        os.remove('config.json')
        with open('config.json', 'w') as f:
            json.dump(data, f, indent=4, sort_keys=True)
        with open('package.json') as package:
            data = json.load(package)
            data['version'] = newVersion
        os.remove('package.json')
        with open('package.json', 'w') as package:
            json.dump(data, package, indent=2, sort_keys=True)
