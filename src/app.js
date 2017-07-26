import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
import './css/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

import graphcomponent from './components/graph/graph.component';
import treecomponent from './components/tree/tree.component';
import timecomponent from './components/time/time.component';
import navcomponent from './components/navbar/nav.component';
import streamcomponent from './components/streamInfo/stream.component';
import sensorcomponent from './components/sensorInfo/sensor.component';
import jsoncomponent from './components/generateJson/generateJson.component';
import basePage from './pages/base.html';
import GenerateJson from './pages/generateJson.html';


angular.module('miniceptor', ['ngRoute'])
    .component('graphcomponent', graphcomponent)
    .component('timecomponent', timecomponent)
    .component('treecomponent', treecomponent)
    .component('navcomponent', navcomponent)
    .component('streamcomponent', streamcomponent)
    .component('sensorcomponent', sensorcomponent)
    .component('jsoncomponent', jsoncomponent)
    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider
            .when('/', {
                template: basePage,
            })
            .when('/generate_json', {
                template: GenerateJson,
            })
            .otherwise({
                redirectTo: '/',
            });
    }]);
