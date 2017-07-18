import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
import './../css/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

import graphController from './graphController';
import treeController from './treeController';
import timeController from './timeController';
import navController from './navController';

angular.module('miniceptor', ['ngRoute'])
    .controller('graphController', graphController)
    .controller('timeController', timeController)
    .controller('treeController', treeController)
    .controller('navController', navController)
    .config(['$routeProvider', ($routeProvider) => {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/base.html',
            })
            .otherwise({
                redirectTo: '/',
            });
    }]);
