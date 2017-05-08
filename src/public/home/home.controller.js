(function () {
"use strict";

angular.module('public')
.controller('AccueilController', AccueilController);

AccueilController.$inject = ['$state','listeColloc'];
function AccueilController($state,listeColloc) {
	var $ctrl = this;
	$ctrl.searchItems = [];
	for (var i = 0; i < listeColloc.length; i++) {
		$ctrl.searchItems.push(listeColloc[i].nom)
	};
	//Sort Array
	$ctrl.searchItems.sort();
	//Define Suggestions List
	$ctrl.suggestions = [];
	//Define Selected Suggestion Item
	$ctrl.selectedIndex = -1;
	$ctrl.test = false;
	$ctrl.noResult = false;
	
	//Function To Call On ng-change
	$ctrl.search = function(){
		$ctrl.suggestions = [];
		$ctrl.test = false;
		var myMaxSuggestionListLength = 0;
		for(var i=0; i<$ctrl.searchItems.length; i++){
			var searchItemsSmallLetters = angular.lowercase($ctrl.searchItems[i]);
			var searchTextSmallLetters = angular.lowercase($ctrl.searchText);
			if( searchItemsSmallLetters.indexOf(searchTextSmallLetters) !== -1){
				$ctrl.test = true;
				$ctrl.noResult = false;
				$ctrl.suggestions.push(searchItemsSmallLetters.charAt(0).toUpperCase() + searchItemsSmallLetters.substr(1).toLowerCase().replace(/-[a-z]/g,function(x){return x.toUpperCase();}));
				myMaxSuggestionListLength += 1;
				if(myMaxSuggestionListLength === 5){
					break;
				}
			}
		}
		if(myMaxSuggestionListLength === 0){
			$ctrl.noResult = true;
		}
	};
	
	//======================================
	//Text Field Events
	//======================================
	
	//Function To Call on ng-keydown
	$ctrl.checkKeyDown = function(event){
		if(event.keyCode === 40){//down key, increment selectedIndex
			event.preventDefault();
			if($ctrl.selectedIndex+1 < $ctrl.suggestions.length){
				$ctrl.selectedIndex++;
				$ctrl.searchText = $ctrl.suggestions[$ctrl.selectedIndex];
			}else{
				$ctrl.selectedIndex = 0;
			}
		}else if(event.keyCode === 38){ //up key, decrement selectedIndex
			event.preventDefault();
			if($ctrl.selectedIndex-1 >= 0){
				$ctrl.selectedIndex--;
				$ctrl.searchText = $ctrl.suggestions[$ctrl.selectedIndex];
			}else{
				$ctrl.selectedIndex = $ctrl.suggestions.length-1;
			}
		}else if(event.keyCode === 13){ //enter key, empty suggestions array
			event.preventDefault();
			if ($ctrl.selectedIndex !== -1){
				$ctrl.searchText = $ctrl.suggestions[$ctrl.selectedIndex];
			}
			$ctrl.suggestions = [];
			$ctrl.test = false;
			$ctrl.selectedIndex = -1;
			if ($ctrl.searchItems.includes($ctrl.searchText.toUpperCase()) === false){
				$ctrl.noResult = true
				var divel = $("#carre_entete_accueil div"),
					x = 500;
				divel.css("background", "#f6bdb1");
				divel.css("color", "#ffffff");
				setTimeout(function(){
					divel.css("background", "#ffffff");
					divel.css("color", "#f6bdb1");
				}, x);
			}else{
				$state.go('public.page.item.comptes',{paramColloc:$ctrl.searchText});
			}
		}else if(event.keyCode === 27){ //ESC key, empty suggestions array
			event.preventDefault();
			$ctrl.suggestions = [];
			$ctrl.test = false;
			$ctrl.selectedIndex = -1; 
		}else{
			if(event.keyCode !== 8 || event.keyCode !== 46){//delete or backspace
				if($ctrl.searchText === ""){
					$ctrl.suggestions = [];
					$ctrl.test = false;
					$ctrl.selectedIndex = -1;
				}
			}else{
				$ctrl.search();
			}
		}
	};
	//======================================
	
	//Function To Call on ng-keyup
	$ctrl.checkKeyUp = function(event){
		if(event.keyCode !== 8 || event.keyCode !== 46){//delete or backspace
			if($ctrl.searchText === ""){
				$ctrl.suggestions = [];
				$ctrl.test = false;
				$ctrl.selectedIndex = -1;
			}
		}
	};	
	//======================================
	
	//Function To Call on ng-click
	$ctrl.AssignValueAndHide = function(index){
		$ctrl.searchText = $ctrl.suggestions[index];
		$ctrl.suggestions=[];
		$ctrl.test = false;
		$ctrl.selectedIndex = -1;
	};
	$ctrl.changeState = function(){
		$ctrl.suggestions = [];
		$ctrl.test = false;
		$ctrl.selectedIndex = -1;
		if ($ctrl.searchItems.includes($ctrl.searchText.toUpperCase()) === false){
			$ctrl.noResult = true
			var divel = $("#carre_entete_accueil div"),
				x = 500;
			divel.css("background", "#f6bdb1");
			divel.css("color", "#ffffff");
			setTimeout(function(){
				divel.css("background", "#ffffff");
				divel.css("color", "#f6bdb1");
			}, x);
		}else{
			$state.go('public.page.item.comptes',{paramColloc:$ctrl.searchText});			
		}
	};
	//======================================

	//Function To Call on ClickOutSide
	var exclude = document.getElementById('carre_entete_accueil');
	$ctrl.hideMenu = function(event){
		if(event.target !== exclude) {
			$ctrl.suggestions = [];
			$ctrl.test = false;
			$ctrl.selectedIndex = -1;
		}
	};
}

})();