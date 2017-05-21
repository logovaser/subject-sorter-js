/**
 * Created by logov on 19-May-17.
 */

import template from './base.html'

export default {
    template,
    bindings: {
        resolve: '=',
        close: '&',
        dismiss: '&'
    },
    controller: ['$scope', '$http', 'dataFactory', function ($scope, $http, dataFactory) {

        let vm = this;

        vm.$onInit = function () {
            $scope.lesson = vm.resolve.lesson;
        };

        $scope.avaliableSubjects = dataFactory.getSubjects();
        $scope.availableLessonTypes = dataFactory.getLessonTypes();
        $scope.avaliableTeachers = dataFactory.getTeachers();

        $scope.formatDate = function (date) {
            return new Date(date * 1000).toLocaleDateString('ru')
        };

    }]
}
