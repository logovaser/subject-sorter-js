/**
 * Created by logov on 20-Oct-16.
 */

import './base.less'
import template from './base.html'

import Loading from '../../modal/loading/setting'

export default {
    template,
    controller: ['$scope', '$http', 'dataFactory', '$uibModal', 'baseUrl', function ($scope, $http, dataFactory, $uibModal, baseUrl) {

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
        $scope.baseUrl = baseUrl;


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

            let loadingModal = $uibModal.open(Loading);

            dataFactory.fetchDays(+$scope.tab.dt_start / 1000, +$scope.tab.dt_end / 1000)
                .then(() => loadingModal.close())
                .catch(() => {
                    loadingModal.close();
                    $uibModal.open({component: 'errorModal'});
                });
        };

        $scope.addSchedule = function () {
            $uibModal.open({component: 'addScheduleModal'}).result.then(res => {

                let selectedDate = new Date(+res);
                let startDate = getMonday(selectedDate);
                let loadingModal = $uibModal.open(Loading);

                dataFactory.checkIfHasLessons(+startDate / 1000, +addDays(startDate, 5) / 1000)
                    .then(() => {
                        dataFactory.delAllDays();

                        for (let i = 0; i < 6; i++) {
                            let newDate = addDays(startDate, i);
                            dataFactory.addDay(+newDate / 1000);
                        }
                        loadingModal.close();
                        $scope.$apply()
                    }, () => {
                        loadingModal.close();
                        $uibModal.open({
                            component: 'errorModal',
                            resolve: {
                                text: 'На ці дати вже було створено уроки. Скористайтесь пошуком.'
                            }
                        });
                    })
                    .catch(() => {
                        loadingModal.close();
                        $uibModal.open({component:'errorModal'});
                    });
            });
        };

        $scope.addTab = function () {
            window.open('/', '_blank')
        };

    }]
}
