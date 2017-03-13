/**
 * Created by logov on 13-Mar-17.
 */

import './lesson.less'

export default ['$http', 'dataFactory', function ($http, dataFactory) {

    let link = (scope, element, attributes) => {



    };

    return {
        link: link,
        scope: {
        },
        restrict: 'E',
        templateUrl: 'comp/Lesson.html'
    }
}]
