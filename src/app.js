import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
import './pages/base.style.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

import graphcomponent from './components/graph/graph.component';
import treecomponent from './components/tree/tree.component';
import timecomponent from './components/time/time.component';
import navcomponent from './components/navbar/nav.component';
import streamcomponent from './components/streamInfo/stream.component';
import sensorcomponent from './components/sensorInfo/sensor.component';
import jsoncomponent from './components/generateJson/generateJson.component';
import apiService from './services/api.service';
import infoService from './services/info.service';
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
    .service('apiService', apiService)
    .service('infoService', infoService)
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