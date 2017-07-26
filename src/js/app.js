import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
import './../css/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

import graphcomponent from './graph.component';
import treecomponent from './tree.component';
import timecomponent from './time.component';
import navcomponent from './nav.component';
import streamcomponent from './stream.component';
import sensorcomponent from './sensor.component';
import generateJsoncomponent from './generateJson.component';

angular.module('miniceptor', ['ngRoute'])
    .component('graphcomponent', graphcomponent)
    .component('timecomponent', timecomponent)
    .component('treecomponent', treecomponent)
    .component('navcomponent', navcomponent)
    .component('streamcomponent', streamcomponent)
    .component('sensorcomponent', sensorcomponent)
    .component('jsoncomponent', generateJsoncomponent)
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
