/**
 * Created by lex on 21/09/15.
 */

    angular.module('udooCfgFilters', []).filter('whitespacesplitter', function() {
        return function(input) {
            return input.split(' ');
        }
    });