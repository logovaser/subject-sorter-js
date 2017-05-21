/**
 * Created by logov on 15-May-17.
 */

export default ['$scope', '$uibModal', function ($scope, $uibModal) {

    let vm = this;

    vm.$onInit = function () {

        $scope.items = vm.items;
        $scope.settings = vm.settings;

        $scope.newItem = function () {

        };

        $scope.editItem = function (item) {

        };

        $scope.delItem = function (item) {

        };

    };

}];
