/**
 * Created by logov on 13-Mar-17.
 */

export default {
    remove: function (array, element) {
        const index = array.indexOf(element);
        array.splice(index, 1);
    }
}
