/**
 * Filters available in HTML
 * @param {object} apolloPermissions Base angular application object
 */
export default function(apolloPermissions) {

    apolloPermissions.filter('joinBy', function () {
        return function (input,delimiter) {
            return (input || []).join(delimiter || ',');
        };
    })
}
