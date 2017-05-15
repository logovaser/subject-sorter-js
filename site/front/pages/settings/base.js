/**
 * Created by logov on 27-Mar-17.
 */

import 'bootstrap/dist/css/bootstrap.css'
import 'ui-select/dist/select.css'
import '../../fonts/Roboto-Regular.less'
import '../../base.less'

import 'jquery'
import 'bootstrap/dist/js/bootstrap'
import angular from 'angular'
import modal from 'angular-ui-bootstrap'
import uiSelect from 'ui-select'
import dataFactory from '../../dataFactory'

let subSortApp = angular.module('subSortApp', [modal, uiSelect]);

subSortApp.factory('dataFactory', dataFactory);

subSortApp.controller('settingsCtrl', ['$scope', '$http', '$uibModal', 'dataFactory', function ($scope, $http, $uibModal, dataFactory) {

    let loadingModal = $uibModal.open({
        templateUrl: 'comp/loadingModal.html',
        backdrop: 'static',
        keyboard: false
    });

    // let baseUrl = 'http://192.168.1.111:8088';
    let baseUrl = 'http://8c0bf3d5.ngrok.io/app.php';

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

    $scope.teachers = dataFactory.getTeachers();
    $scope.subjects = dataFactory.getSubjects();
    $scope.lesson_types = dataFactory.getLessonTypes();
    $scope.platoons = dataFactory.getPlatoons();

    let promises = [
        $http.get(`${baseUrl}/subjects/list`).then(res => $scope.subjects = res.data.subjects)
    ];

    Promise.all(promises).then(() => loadingModal.close());

    $scope.addNewTeacher = function () {
        let loadingModal = $uibModal.open({
            templateUrl: 'comp/loadingModal.html',
            backdrop: 'static',
            keyboard: false
        });
        let data = angular.copy($scope.teacher);
        data.methodical_day = {day: data.methodical_day};
        data.subjects = data.subjects.map(subject => ({id: subject.id}));

        console.log(data);

        $http.post(`${baseUrl}/teachers/add`, data).then(res => {
            loadingModal.close();
        }).catch(() => {
            loadingModal.close();
            $uibModal.open({templateUrl: 'comp/errorModal.html'});
        })
    };

    $scope.addNewLessonType = function () {
        let loadingModal = $uibModal.open({
            templateUrl: 'comp/loadingModal.html',
            backdrop: 'static',
            keyboard: false
        });
        $http.post(`${baseUrl}/lessons/types/add`, $scope.subjectType).then(res => {
            loadingModal.close();
        }).catch(() => {
            loadingModal.close();
            $uibModal.open({templateUrl: 'comp/errorModal.html'});
        })
    };

    $scope.addNew = function (type) {
        let loadingModal = $uibModal.open({
            templateUrl: 'comp/loadingModal.html',
            backdrop: 'static',
            keyboard: false
        });
        $http.post(`${baseUrl}/${type}s/add`, $scope[type]).then(() => {
            loadingModal.close();
        }).catch(() => {
            loadingModal.close();
            $uibModal.open({templateUrl: 'comp/errorModal.html'});
        })
    };

    $scope.delTeacher = function (teacher) {
        let loadingModal = $uibModal.open({
            templateUrl: 'comp/loadingModal.html',
            backdrop: 'static',
            keyboard: false
        });
        $http.delete(`${baseUrl}/teachers/remove/${teacher.id}`).then(() => {
            $scope.teachers.splice($scope.teachers.indexOf(teacher), 1);
            loadingModal.close();
        }).catch(() => {
            loadingModal.close();
            $uibModal.open({templateUrl: 'comp/errorModal.html'});
        })
    };

}]);
