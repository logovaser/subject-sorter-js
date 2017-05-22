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


        $scope.addItem = function (type) {
            switch (type) {
                case 'teacher':
                    $uibModal.open({
                        component: 'addTeacherModal',
                        resolve: {
                            subjects: () => $scope.subjects,
                            weekdays: () => $scope.weekdays
                        }
                    });
                    break;
                case 'subject':
                    $uibModal.open({
                        component: 'addSubjectModal'
                    });
                    break;
                case 'lesson_type':
                    $uibModal.open({
                        component: 'addLessonTypeModal'
                    });
                    break;
                case 'platoon':
                    $uibModal.open({
                        component: 'addPlatoonModal',
                        resolve: {
                            weekdays: () => $scope.weekdays
                        }
                    });
                    break;
            }
        };

        $scope.delTeacher = function (teacher) {
            let loadingModal = $uibModal.open(Loading);
            $http.delete(`${baseUrl}/teachers/remove/${teacher.id}`).then(() => {
                $scope.teachers.splice($scope.teachers.indexOf(teacher), 1);
                loadingModal.close();
            }).catch(() => {
                loadingModal.close();
                $uibModal.open({component: 'errorModal'});
            })
        };

        $scope.delSubject = function (subject) {
            let loadingModal = $uibModal.open(Loading);
            $http.delete(`${baseUrl}/subjects/remove/${subject.id}`).then(() => {
                $scope.subjects.splice($scope.subjects.indexOf(subject), 1);
                loadingModal.close();
            }).catch(() => {
                loadingModal.close();
                $uibModal.open({component: 'errorModal'});
            })
        };

        $scope.delLessonType = function (lesson_type) {
            let loadingModal = $uibModal.open(Loading);
            $http.delete(`${baseUrl}/lessons/types/remove/${lesson_type.id}`).then(() => {
                $scope.lesson_types.splice($scope.lesson_types.indexOf(lesson_type), 1);
                loadingModal.close();
            }).catch(() => {
                loadingModal.close();
                $uibModal.open({component: 'errorModal'});
            })
        };

        $scope.delPlatoon = function (platoon) {
            let loadingModal = $uibModal.open(Loading);
            $http.delete(`${baseUrl}/platoons/remove/${platoon.id}`).then(() => {
                $scope.platoons.splice($scope.platoons.indexOf(platoon), 1);
                loadingModal.close();
            }).catch(() => {
                loadingModal.close();
                $uibModal.open({component: 'errorModal'});
            })
        };

    }]
}
