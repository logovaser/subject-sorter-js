/**
 * Created by logov on 20-Oct-16.
 */

import angular from 'angular'
import 'angular-bootstrap-contextmenu/contextMenu'
import modal from 'angular-ui-bootstrap'
import 'jquery'
import 'bootstrap/dist/js/bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import './fonts/Roboto-Regular.less'
import './base.less'
import './home.less'
import dataFactory from './dataFactory'
import Schedule from './comp/Schedule'
import Lesson from './comp/Lesson'
import LessonPopup from './comp/LessonPopup'

let subSortApp = angular.module('subSortApp', ['ui.bootstrap.contextMenu', modal]);

subSortApp.factory('dataFactory', dataFactory);

subSortApp.directive('schedule', Schedule);
subSortApp.directive('lesson', Lesson);

subSortApp.controller('lessonPopupCtrl', LessonPopup);

subSortApp.controller('scheduleCtrl', ['$scope', '$http', 'dataFactory', '$uibModal', function ($scope, $http, dataFactory, $uibModal) {

    $scope.tab = {
        dt_start: '',
        dt_end: '',
        dt_new_sch: '',
    };
    $scope.days = dataFactory.getDays();
    $scope.styles = {
        schedules: {
            zoom: '100%'
        }
    };


    dataFactory.events.addEventListener('collectionChanged', () => {
        $scope.days = dataFactory.getDays();
    });

    function addDays(date, days) {
        let result = new Date(date);
        result.setDate(result.getDate() + parseInt(days));
        return new Date(result);
    }

    function getMonday(d) {
        d = new Date(d);
        let day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    $scope.loadSchedule = function (e) {
        e.preventDefault();

        let loadingModal = $uibModal.open({
            templateUrl: 'comp/loadingModal.html',
            backdrop: 'static',
            keyboard: false
        });

        dataFactory.fetchDays(+$scope.tab.dt_start / 1000, +$scope.tab.dt_end / 1000).then(() => loadingModal.close());
    };

    $scope.addSchedule = function () {
        let selectedDate = new Date(+$scope.tab.dt_new_sch);
        let startDate = getMonday(selectedDate);

        dataFactory.checkIfHasLessons(+startDate / 1000, +addDays(startDate, 5) / 1000)
            .then(() => {
                dataFactory.delAllDays();

                for (let i = 0; i < 6; i++) {
                    let newDate = addDays(startDate, i);
                    dataFactory.addDay(+newDate / 1000);
                }
                $scope.$apply()
            }, () => {
                alert('На ці дати вже було створено уроки. Скористайтесь пошуком.')
            });

    };

    $scope.addTab = function () {
        window.open('/', '_blank')
    };

}]);
