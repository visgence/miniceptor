import angular from 'angular';
import angularRoute from 'angular-route';// eslint-disable-line
import './../css/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

import mainController from './mainController';

angular.module('miniceptor', ['ngRoute'])
    .controller('mainController', mainController)
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl: 'templates/base.html',
                controller: 'mainController as ctrl',
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
