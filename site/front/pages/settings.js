/**
 * Created by logov on 27-Mar-17.
 */

import angular from 'angular'
import 'bootstrap/dist/css/bootstrap.css'
import '../fonts/Roboto-Regular.less'
import '../base.less'

let subSortApp = angular.module('subSortApp', []);

subSortApp.controller('settingsCtrl', ['$scope', '$http', function ($scope, $http) {

    let baseUrl = 'http://192.168.1.111:8088';

    $scope.subjects = [];

    $scope.teacher = {};
    $scope.subject = {};
    $scope.subjectType = {};
    $scope.platoon = {};

    $http.get('/subjects/list').then(res => $scope.subjects = res.data.subjects);

    $scope.addNewTeacher = function () {
        console.log($scope.teacher);

        // $http.post($scope.teacher).then(res => {
        //
        // })
    };

    $scope.addNewSubject = function () {

    };

    $scope.addNewSubjectType = function () {

    };

    $scope.addNewPlatoon = function () {

    }

}]);
