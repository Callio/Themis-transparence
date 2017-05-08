(function() {
"use strict";

/* Themis application that includes the public module as a dependency */
angular.module('themis', ['public'])
.config(config);

config.$inject = ['$urlRouterProvider'];
function config($urlRouterProvider) {
	// If user goes to a path that doesn't exist, redirect to public root
	$urlRouterProvider.otherwise('/');
}

})();