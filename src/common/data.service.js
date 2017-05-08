(function () {
"use strict";

angular.module('common')
.service('DataService', DataService);

DataService.$inject = ['$http', 'ApiPath'];
function DataService($http, ApiPath) {
	var service = this;

	service.getData = function (paramColloc) {
		var config = {};
		var paramURL = "";
		if (paramColloc) {
			paramURL = paramColloc.toUpperCase();
		}
		return $http.get(ApiPath + '/data-region/' + paramURL + '.json').then(function (response) {
			return response.data;
		});
	};
	
	service.getListe = function () {
		return $http.get(ApiPath + '/liste-region.json').then(function (response) {
			return response.data;
		});
	};
}

})();