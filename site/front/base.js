/**
 * Created by logov on 19-May-17.
 */

import 'bootstrap/dist/css/bootstrap.css'
import 'ui-select/dist/select.css'
import './base.less'
import './fonts/Roboto-Regular.less'

import angular from 'angular'
import uiRouter from '@uirouter/angularjs'
import 'angular-bootstrap-contextmenu/contextMenu'
import uib from 'angular-ui-bootstrap'
import uiSelect from 'ui-select'

import Routes from './routes'

import dataFactory from './dataFactory'

import Schedule from './comp/schedule/base'
import Lesson from './comp/lesson/base'

import LessonModal from './modal/lesson/base'
import AddScheduleModal from './modal/addSchedule/base'
import LoadingModal from './modal/loading/base'
import ErrorModal from './modal/error/base'

import Home from './page/home/base'
import Settings from './page/settings/base'
import Stats from './page/stats/base'

let app = angular.module('subjectSorterApp', [uiRouter, 'ui.bootstrap.contextMenu', uib, uiSelect]);

app.factory('dataFactory', dataFactory);
// app.value('baseUrl', 'http://192.168.1.111:8088');
app.value('baseUrl', 'http://747907a5.ngrok.io/app_dev.php');

app.directive('schedule', Schedule);
app.directive('lesson', Lesson);

app.component('lessonModal', LessonModal);
app.component('addScheduleModal', AddScheduleModal);
app.component('loadingModal', LoadingModal);
app.component('errorModal', ErrorModal);

app.component('homePage', Home);
app.component('settingsPage', Settings);
app.component('statsPage', Stats);

app.config(['$compileProvider', '$stateProvider', '$locationProvider', function ($compile, $state, $location) {
    $location.hashPrefix('');
    $location.html5Mode(true);
    $compile.debugInfoEnabled(false);
    Routes($state);
}]);
