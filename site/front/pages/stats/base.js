/**
 * Created by logov on 09-Apr-17.
 */

import angular from 'angular'
import 'bootstrap/dist/css/bootstrap.css'
import '../../fonts/Roboto-Regular.less'
import '../../base.less'
import './base.less'

let subSortApp = angular.module('subSortApp', []);

subSortApp.controller('statsCtrl', ['$scope', '$http', function ($scope, $http) {

    // let baseUrl = 'http://192.168.1.111:8088';
    let baseUrl = 'http://ce13c1f9.ngrok.io/app.php';

    $scope.list = [];

    $http.get(`${baseUrl}/statistic/show`).then(res => $scope.list = res.data);

}]);
