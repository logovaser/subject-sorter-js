/**
 * Created by logov on 27-Mar-17.
 */

import template from './base.html'
import Loading from '../../modal/loading/setting'

export default {
    template,
    controller: ['$scope', '$http', '$uibModal', 'dataFactory', 'baseUrl', function ($scope, $http, $uibModal, dataFactory, baseUrl) {

        let loadingModal = $uibModal.open(Loading);

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
            let loadingModal = $uibModal.open(Loading);
            let data = angular.copy($scope.teacher);
            data.methodical_day = {day: data.methodical_day};
            data.subjects = data.subjects.map(subject => ({id: subject.id}));

            console.log(data);

            $http.post(`${baseUrl}/teachers/add`, data).then(res => {
                loadingModal.close();
            }).catch(() => {
                loadingModal.close();
                $uibModal.open({component:'errorModal'});
            })
        };

        $scope.addNewLessonType = function () {
            let loadingModal = $uibModal.open(Loading);
            $http.post(`${baseUrl}/lessons/types/add`, $scope.subjectType).then(res => {
                loadingModal.close();
            }).catch(() => {
                loadingModal.close();
                $uibModal.open({component:'errorModal'});
            })
        };

        $scope.addNew = function (type) {
            let loadingModal = $uibModal.open(Loading);
            $http.post(`${baseUrl}/${type}s/add`, $scope[type]).then(() => {
                loadingModal.close();
            }).catch(() => {
                loadingModal.close();
                $uibModal.open({component:'errorModal'});
            })
        };

        $scope.delTeacher = function (teacher) {
            let loadingModal = $uibModal.open(Loading);
            $http.delete(`${baseUrl}/teachers/remove/${teacher.id}`).then(() => {
                $scope.teachers.splice($scope.teachers.indexOf(teacher), 1);
                loadingModal.close();
            }).catch(() => {
                loadingModal.close();
                $uibModal.open({component:'errorModal'});
            })
        };

        $scope.delSubject = function (teacher) {
            let loadingModal = $uibModal.open(Loading);
            $http.delete(`${baseUrl}/subjects/remove/${teacher.id}`).then(() => {
                $scope.teachers.splice($scope.teachers.indexOf(teacher), 1);
                loadingModal.close();
            }).catch(() => {
                loadingModal.close();
                $uibModal.open({component:'errorModal'});
            })
        };

        $scope.delLessonType = function (teacher) {
            let loadingModal = $uibModal.open(Loading);
            $http.delete(`${baseUrl}/lessons/types/remove/${teacher.id}`).then(() => {
                $scope.teachers.splice($scope.teachers.indexOf(teacher), 1);
                loadingModal.close();
            }).catch(() => {
                loadingModal.close();
                $uibModal.open({component:'errorModal'});
            })
        };

        $scope.delPlatoon = function (teacher) {
            let loadingModal = $uibModal.open(Loading);
            $http.delete(`${baseUrl}/platoons/remove/${teacher.id}`).then(() => {
                $scope.teachers.splice($scope.teachers.indexOf(teacher), 1);
                loadingModal.close();
            }).catch(() => {
                loadingModal.close();
                $uibModal.open({component:'errorModal'});
            })
        };

    }]
}
