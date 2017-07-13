import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
import './../css/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

import graphController from './graphController';
import treeController from './treeController';
import timeController from './timeController';

angular.module('miniceptor', ['ngRoute'])
    .controller('graphController', graphController)
    .controller('timeController', timeController)
    .controller('treeController', treeController)
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/base.html',
            })
            .otherwise({
                redirectTo: '/',
            });
    }]);
