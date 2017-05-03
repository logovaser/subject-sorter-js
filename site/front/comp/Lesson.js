/**
 * Created by logov on 07-Mar-17.
 */

import './lesson.less'

export default [function () {

    let link = (scope, element, attributes) => {

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
