/**
 * Created by logov on 05-May-17.
 */

export default function ($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            component: 'homePage'
        })
        .state('settings', {
            url: '/settings',
            component: 'settingsPage'
        })
        .state('stats', {
            url: '/stats',
            component: 'statsPage'
        })
}
