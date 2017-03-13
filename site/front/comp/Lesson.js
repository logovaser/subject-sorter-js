/**
 * Created by logov on 07-Mar-17.
 */

import './lesson.less'

export default ['$http', 'dataFactory', function ($http, dataFactory) {

    let link = (scope, element, attributes) => {

        // scope.lesson   --- we've got this thing
        scope.state = {
            editMode: false
        };

        scope.toggleEditMode = function () {
            scope.state.editMode = !scope.state.editMode;
        };

        scope.avaliableSubjects = dataFactory.getSubjects();
        scope.availableLessonTypes = dataFactory.getLessonTypes();
        scope.avaliableTeachers = dataFactory.getTeachers();

    };

    return {
        link: link,
        scope: {
            lesson: '='
        },
        restrict: 'E',
        templateUrl: 'comp/Lesson.html'
    }
}]
