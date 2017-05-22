/**
 * Created by logov on 19-May-17.
 */

import template from './base.html'
import Loading from '../../modal/loading/setting'

export default {
    template,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: ['$scope', '$http', '$uibModal', 'baseUrl', function ($scope, $http, $uibModal, baseUrl) {
        let vm = this;

        vm.cancel = function () {
            vm.dismiss({$value: 'cancel'});
        };

        $scope.form = {};

        $scope.submit = function (e) {
            e.preventDefault();

            let loadingModal = $uibModal.open(Loading);

            $http.post(`${baseUrl}/subjects/add`, $scope.form).then(res => {
                loadingModal.close();
                vm.close();
            }, rej => {
                loadingModal.close();
                $uibModal.open({component: 'errorModal'});
            })
        }
    }]
}
