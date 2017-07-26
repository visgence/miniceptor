import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
import './../css/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

import graphController from './graphController';
import treeController from './treeController';
import timeController from './timeController';
import navController from './navController';
import streamController from './streamController';
import sensorController from './sensorController';
import generateJsonController from './generateJsonController';

angular.module('miniceptor', ['ngRoute'])
    .controller('graphController', graphController)
    .controller('timeController', timeController)
    .controller('treeController', treeController)
    .controller('navController', navController)
    .controller('streamController', streamController)
    .controller('sensorController', sensorController)
    .controller('generateJsonController', generateJsonController)
    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/base.html',
            })
            .when('/generate_json', {
                templateUrl: 'templates/generate_json.html',
            })
            .otherwise({
                redirectTo: '/',
            });
    }]);
