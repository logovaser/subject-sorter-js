/**
 * Created by logov on 09-Apr-17.
 */

import './base.less'
import template from './base.html'

export default {
    template,
    controller: ['$scope', '$http', 'baseUrl', function ($scope, $http, baseUrl) {

        $scope.list = [];

        $http.get(`${baseUrl}/statistic/show`).then(res => $scope.list = res.data);

    }]
}
