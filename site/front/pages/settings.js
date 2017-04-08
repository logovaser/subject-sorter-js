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
    $scope.weekdays = [
        {id: 1, alias: 'monday', name: 'Понеділок'},
        {id: 1, alias: 'tuesday', name: 'Вівторок'},
        {id: 1, alias: 'wednesday', name: 'Середа'},
        {id: 1, alias: 'thursday', name: 'Четвер'},
        {id: 1, alias: 'friday', name: "П'ятниця"},
        {id: 1, alias: 'saturday', name: 'Субота'},
        {id: 1, alias: 'sunday', name: 'Неділя'},
    ];

    $scope.teacher = {};
    $scope.subject = {};
    $scope.subjectType = {};
    $scope.platoon = {};

    $http.get(`${baseUrl}/subjects/list`).then(res => $scope.subjects = res.data.subjects);

    $scope.addNewTeacher = function () {
        let data = angular.copy($scope.teacher);
        data.methodical_day = {day: data.methodical_day};
        data.subjects = data.subjects.map(subject => ({id: subject.id}));

        console.log(data);

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
