/**
 * Created by logov on 20-Oct-16.
 */

import angular from 'angular'
import 'bootstrap/dist/css/bootstrap.css'
import './fonts/Roboto-Regular.less'
import './base.less'
import dataFactory from './dataFactory'
import Schedule from './comp/Schedule'
import Lesson from './comp/Lesson'

let subSortApp = angular.module('subSortApp', []);

subSortApp.factory('dataFactory', dataFactory);

subSortApp.directive('schedule', Schedule);
subSortApp.directive('lesson', Lesson);

subSortApp.controller('scheduleCtrl', ['$scope', '$http', 'dataFactory', function ($scope, $http, dataFactory) {

    $scope.tab = {
        dt_start: '',
        dt_end: '',
        dt_new_sch: '',
    };
    $scope.days = dataFactory.getDays();

    dataFactory.events.addEventListener('collectionChanged', () => {
        $scope.days = dataFactory.getDays();
    });

    $scope.loadSchedule = function (e) {
        e.preventDefault();

        dataFactory.fetchDays(+$scope.tab.dt_start / 1000, +$scope.tab.dt_end / 1000);
    };

    $scope.addSchedule = function (e) {
        e.preventDefault();
        dataFactory.addDay(+$scope.tab.dt_new_sch / 1000);
    };

    $scope.addTab = function () {
        window.open('/', '_blank')
    };

}]);
