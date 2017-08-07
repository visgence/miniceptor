Setup:

pip install -r requirements.txt
npm install

Using docker:

cd docker/app
sh build.sh
sh run.sh
npm install

Usage:

npm run start
This will clear out your dist folder, build the project and start the server.
Note: There will be a message that webpack is watching and that the server has started
due to the way npm is setup to multiprocess, this does not mean that everything is ready,
please wait until webpack has finished its build.

npm run lint
runs htmllint, csslint, eslint, and pep8 (configs haven't been completed yet.)

npm run incmajorversion
npm run incminorversion
These script are use to increment the version number:
X.major.minor
They increment both the config and package.json file to the next number.

Future updates:
https://github.com/tempusdominus/bootstrap-3 for timepicker (in alpha)
bootstrap 4 (in alpha)
jquery 3 (bootstrap needs update)


Notes:
There is a post install running npm run install on node-sass. Depending on your os, node-sass doesn't always install itself on npm install.
https://github.com/sass/node-sass/blob/master/TROUBLESHOOTING.md

Bower is currently installed globally, this is because the timepicker requires bower and npm doesn't know how to link it self to bower as a dependency.

TODO:
Create EntryPoint.sh file and add phantomjs to path
