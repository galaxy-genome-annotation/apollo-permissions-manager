/**
 * Filters available in HTML
 * @param {object} apolloPermissions Base angular application object
 */
export default function(apolloPermissions) {

    apolloPermissions.filter('joinBy', function () {
        return function (input,delimiter) {
            return (input || []).join(delimiter || ',');
        };
    });

    apolloPermissions.filter('scifi', function () {
        // Filter to scientific notation
        var regex = /([0-9])\.?([0-9]{0,2}).*e(.*)/;
        return function (input) {
            var results = ("" + input.toExponential()).match(regex);
            var tmp = results[1] + '.' + results[2] + 'e' + results[3];
            if(tmp === "0.e+0"){
                return '0';
            }
            return tmp
        };
    });
}
