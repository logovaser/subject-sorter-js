/**
 * Created by logov on 23-Apr-17.
 */

export default ['$scope', '$http', 'dataFactory', '$uibModalInstance', 'lesson', function ($scope, $http, dataFactory, $uibModalInstance, lesson) {

    $scope.avaliableSubjects = dataFactory.getSubjects();
    $scope.availableLessonTypes = dataFactory.getLessonTypes();
    $scope.avaliableTeachers = dataFactory.getTeachers();

    $scope.lesson = lesson;

    $scope.formatDate = function (date) {
        return new Date(date * 1000).toLocaleDateString('ru')
    };

}]
