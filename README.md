Setup:

pip install -r requirements.txt
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
