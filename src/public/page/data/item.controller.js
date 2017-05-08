(function () {
"use strict";

angular.module('public')
.controller('ItemController', ItemController);

ItemController.$inject = ['$state','dataColloc'];
function ItemController($state,dataColloc) {
	var $ctrl = this;
	$ctrl.nomColloc = dataColloc.nom;
	$ctrl.selectComptes = true;
	$ctrl.selectDette = false;
	$ctrl.selectFiscalite = false;
	
	$ctrl.categoryComptes = false;
	$ctrl.categoryDette = false;
	$ctrl.categoryFiscalite = false;
	
	$ctrl.croixComptes = false;
	
	$ctrl.changeToComptes = function(){
		$ctrl.selectComptes = true;
		$ctrl.selectDette = false;
		$ctrl.selectFiscalite = false;
		$state.go('public.page.item.comptes');
	};
	$ctrl.changeToDette = function(){
		$ctrl.selectComptes = false;
		$ctrl.selectDette = true;
		$ctrl.selectFiscalite = false;
		$ctrl.croixComptes = false;
		$ctrl.categoryComptes = false;
		$state.go('public.page.item.dette');
	};
	$ctrl.changeToFiscalite = function(){
		$ctrl.selectComptes = false;
		$ctrl.selectDette = false;
		$ctrl.selectFiscalite = true;
		$ctrl.croixComptes = false;
		$ctrl.categoryComptes = false;
		$state.go('public.page.item.fiscalite');
	};
	
	$ctrl.developComptes = function(){
		if($ctrl.categoryComptes === true){
			$ctrl.croixComptes = false;
			$ctrl.categoryComptes = false;
		}else{
			$ctrl.croixComptes = true;
			$ctrl.categoryComptes = true;
		}
		$ctrl.categoryDette = false;
		$ctrl.categoryFiscalite = false;
		$ctrl.retourneCroix = true;
		
	};
	$ctrl.developDette = function(){
		$ctrl.categoryComptes = false;
		$ctrl.categoryDette = true;
		$ctrl.categoryFiscalite = false;
	};
	$ctrl.developFiscalite = function(){
		$ctrl.categoryComptes = false;
		$ctrl.categoryDette = false;
		$ctrl.categoryFiscalite = true;
	};
}

})();