/**
 * Created by logov on 19-May-17.
 */

import template from './base.html'

export default {
    template,
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    controller: function () {
        let vm = this;

        vm.ok = function (newDate) {
            vm.close({$value: newDate});
        };

        vm.cancel = function () {
            vm.dismiss({$value: 'cancel'});
        };
    }
}
