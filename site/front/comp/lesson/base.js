/**
 * Created by logov on 07-Mar-17.
 */

import './base.less'
import template from './base.html'

export default function () {

    let link = (scope, element, attributes) => {

    };

    return {
        link: link,
        scope: {
            lesson: '='
        },
        restrict: 'E',
        template
    }
}
