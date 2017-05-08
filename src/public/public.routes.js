(function() {
'use strict';

angular.module('public')
.config(routeConfig);

/* Configures the routes and views */
routeConfig.$inject = ['$stateProvider'];
function routeConfig ($stateProvider) {
	// Routes
	$stateProvider
	.state('public', {
		absract: true,
		templateUrl: 'src/public/public.html'
	})
    .state('public.home', {
		url: '/',
		templateUrl: 'src/public/home/home.html',
		controller: 'AccueilController',
		controllerAs: 'accueilCtrl',
		resolve: {
			listeColloc: ['DataService', function (DataService) {
				return DataService.getListe();
			}]
		}
    })
	.state('public.page', {
		absract: true,
		templateUrl: 'src/public/page/page.html'
	})
	.state('public.page.ranking', {
		url: '/ranking',
		templateUrl: 'src/public/page/ranking/ranking.html'
    })
	.state('public.page.solution', {
		url: '/solution',
		templateUrl: 'src/public/page/solution/solution.html'
    })
	.state('public.page.data', {
		url: '/data',
		templateUrl: 'src/public/page/data/data.html'
    })
	
	.state('public.page.item', {
		absract: true,
		url: '/data/{paramColloc}',
		templateUrl: 'src/public/page/data/item.html',
		controller: 'ItemController',
		controllerAs: 'itemCtrl',
		resolve: {
			dataColloc: ['$stateParams','DataService', function ($stateParams, DataService) {
				return DataService.getData($stateParams.paramColloc);
			}]
		}
    })
	
	.state('public.page.item.comptes', {
		url: '/comptes',
		templateUrl: 'src/public/page/data/comptes.html',
		controller: 'ComptesController',
		controllerAs: 'comptesCtrl',
    })
	.state('public.page.item.dette', {
		url: '/dette',
		templateUrl: 'src/public/page/data/dette.html',
		controller: 'DetteController',
		controllerAs: 'detteCtrl',
    })
	.state('public.page.item.fiscalite', {
		url: '/fiscalite',
		templateUrl: 'src/public/page/data/fiscalite.html',
		controller: 'FiscaliteController',
		controllerAs: 'fiscaliteCtrl',
    })

	.state('public.page.aventure', {
		url: '/aventure',
		templateUrl: 'src/public/page/footer/aventure.html'
    })
	.state('public.page.equipe', {
		url: '/equipe',
		templateUrl: 'src/public/page/footer/equipe.html'
    });
}
})();
