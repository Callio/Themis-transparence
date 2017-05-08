(function () {
"use strict";

angular.module('public')
.controller('ComptesController', ComptesController);

ComptesController.$inject = ['dataColloc'];
function ComptesController(dataColloc) {
	var $ctrl = this;
	
	//************************
	//Affichage des graphiques
	//************************
	$ctrl.histogramme = true;
	$ctrl.courbe = false;
	$ctrl.changeGraph = function(){
		if ($ctrl.histogramme === true){
			$ctrl.courbe = true;
			$ctrl.histogramme = false;
		}else{
			$ctrl.histogramme = true;
			$ctrl.courbe = false;
		}
	}
		
	//***********************
	//Création des graphiques
	//***********************
	
	//Initialisation de la zone de graphique
	var FRconfig = d3.formatDefaultLocale({
        "decimal": ",",
        "thousands": "",
        "grouping": [3],
        "currency": ["€", ""],
        "dateTime": "%a %b %e %X %Y",
        "date": "%d.%m.%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        "shortDays": ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        "months": ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        "shortMonths": ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Déc"]
    })
	var w = 400;
	var h = w;
	var padding = Math.min(h/20,20);
	var ecart = Math.max(h/80,2);
	var decalage = ecart + padding;
	var svgHist = d3.select("#histogramme")
				.append("svg")
				.attr("width", w)
				.attr("height", h+3*padding+ecart);
	var svgCour = d3.select("#courbe")
				.append("svg")
				.attr("width", w)
				.attr("height", h+3*padding+ecart);
	
	//Création de l'histogramme
	var datasetHist = [dataColloc.comptes["2008"].totprodfonct, dataColloc.comptes["2008"].resinvbudg, dataColloc.comptes["2008"].totcharfonct, dataColloc.comptes["2008"].totempinv];

	/*Initialisation des variables liées aux unités des grandeurs*/
	var label_abs = "";
	var label_rel = "";
	var power = 0;
	var unite = "";
	var var_aux = Math.min(parseInt(datasetHist[0])+parseInt(datasetHist[1]),parseInt(datasetHist[2])+parseInt(datasetHist[3]));
	while(var_aux/10>1){
		power++;
		var_aux = var_aux/10;
	}
	power = Math.min(power - power % 3,6);
	switch (power){
		case 0 :
			unite = "";
			break;
		case 3 :
			unite = "k";
			break;
		case 6 :
			unite = "M";
			break;
		default :
			unite = "";
			break;
	}
	
	/*Création de l'axe et de la grille*/
	var scale = d3.scaleLinear()
				  .domain([0,Math.max(parseInt(datasetHist[0])+parseInt(datasetHist[1]),parseInt(datasetHist[2])+parseInt(datasetHist[3]))])
                  .range([0,h]);
	var yscale = d3.scaleLinear()
				  .domain([0,Math.max(parseInt(datasetHist[0])+parseInt(datasetHist[1]),parseInt(datasetHist[2])+parseInt(datasetHist[3]))])
                  .range([h,0]);
	var yaxis = d3.axisRight(yscale).ticks(5).tickFormat(FRconfig.formatPrefix("$,.0", Math.pow(10,power)));
	svgHist.append("g")
	   .attr("class","axe")
	   .attr("transform", "translate(0," + decalage + ")")
	   .call(yaxis);
	svgHist.select(".axe")
	   .selectAll("line")
	   .attr("x2",w)
	   .attr("x1",50);
	   
	/*Création des éléments de l'histogramme*/
	svgHist.append("g")
	   .attr("class","produit_fonct")
	   .append("rect")
	   .attr("x", 1.5*w/5)
	   .attr("y", h + padding + ecart - scale(datasetHist[0]))
	   .attr("width", w/5)
	   .attr("height", scale(datasetHist[0]));
	svgHist.append("g")
	   .attr("class","produit_invest")
	   .append("rect")
	   .attr("x", 1.5*w/5)
	   .attr("y", h + padding - scale(datasetHist[0])-scale(datasetHist[1]))
	   .attr("width", w/5)
	   .attr("height", scale(datasetHist[1]));
	svgHist.append("g")
	   .attr("class","charge_fonct")
	   .append("rect")
	   .attr("x", 3.5*w/5)
	   .attr("y", h + padding + ecart - scale(datasetHist[2]))
	   .attr("width", w/5)
	   .attr("height", scale(datasetHist[2]));
	svgHist.append("g")
	   .attr("class","charge_invest")
	   .append("rect")
	   .attr("x", 3.5*w/5)
	   .attr("y", h + padding - scale(datasetHist[2]) - scale(datasetHist[3]))
	   .attr("width", w/5)
	   .attr("height", scale(datasetHist[3]));
	svgHist.append("text")
	   .text("Recettes")
	   .attr("x", 1.5*w/5+5)
	   .attr("y", h+2.5*padding)
	   .attr("class","texte_comptes");
	svgHist.append("text")
	   .text("Dépenses")
	   .attr("x", 3.5*w/5+2)
	   .attr("y", h+2.5*padding)
	   .attr("class","texte_comptes");
	
	/*Création des commentaires*/
	svgHist.select(".produit_fonct")
	   .append("rect")
	   .attr("x", 1.9*w/5)
	   .attr("y", h + padding + ecart - 1.3*scale(datasetHist[0])/2)
	   .attr("width", 118)
	   .attr("height", 50)
	   .attr("class","graph_comment")
	   .attr("id","grcomment_produit_fonct");
	label_abs = Math.round(parseInt(datasetHist[0])/(Math.pow(10,power)));
	svgHist.select(".produit_fonct")
		.append("text")
	    .text( label_abs.toString() + " " + unite + "€")
	    .attr("x", 1.9*w/5+10)
	    .attr("y", h + 2*padding + ecart - 1.3*scale(datasetHist[0])/2)
	    .attr("class","texte_comment")
		.attr("id","tx1comment_produit_fonct");
	label_rel = Math.round(parseInt(datasetHist[0])/parseInt(dataColloc.comptes["2008"].population));
	svgHist.select(".produit_fonct")
		.append("text")
	    .text( label_rel.toString() + " €/habitant")
	    .attr("x", 1.9*w/5+10)
	    .attr("y", h + 2*padding + 25 - 1.3*scale(datasetHist[0])/2)
	    .attr("class","texte_comment")
		.attr("id","tx2comment_produit_fonct");
		
	svgHist.select(".produit_invest")
	   .append("rect")
	   .attr("x", 1.9*w/5)
	   .attr("y", h + padding + ecart - scale(datasetHist[0])-1.3*scale(datasetHist[1])/2)
	   .attr("width", 118)
	   .attr("height", 50)
	   .attr("class","graph_comment")
	   .attr("id","grcomment_produit_invest");
	label_abs = Math.round(parseInt(datasetHist[1])/(Math.pow(10,power)));
	svgHist.select(".produit_invest")
		.append("text")
	    .text( label_abs.toString() + " " + unite + "€")
	    .attr("x", 1.9*w/5+10)
	    .attr("y", h + 2*padding + ecart - scale(datasetHist[0])-1.3*scale(datasetHist[1])/2)
	    .attr("class","texte_comment")
		.attr("id","tx1comment_produit_invest");
	label_rel = Math.round(parseInt(datasetHist[1])/parseInt(dataColloc.comptes["2008"].population));
	svgHist.select(".produit_invest")
		.append("text")
	    .text( label_rel.toString() + " €/habitant")
	    .attr("x", 1.9*w/5+10)
	    .attr("y", h + 2*padding + 25 - scale(datasetHist[0])-1.3*scale(datasetHist[1])/2)
	    .attr("class","texte_comment")
		.attr("id","tx2comment_produit_invest");
	
	svgHist.select(".charge_fonct")
	   .append("rect")
	   .attr("x", 2.8*w/5)
	   .attr("y", h + padding + ecart - 1.3*scale(datasetHist[2])/2)
	   .attr("width", 118)
	   .attr("height", 50)
	   .attr("class","graph_comment")
	   .attr("id","grcomment_charge_fonct");
	label_abs = Math.round(parseInt(datasetHist[2])/(Math.pow(10,power)));
	svgHist.select(".charge_fonct")
		.append("text")
	    .text( label_abs.toString() + " " + unite + "€")
	    .attr("x", 2.8*w/5+10)
	    .attr("y", h + 2*padding + ecart - 1.3*scale(datasetHist[2])/2)
	    .attr("class","texte_comment")
		.attr("id","tx1comment_charge_fonct");
	label_rel = Math.round(parseInt(datasetHist[2])/parseInt(dataColloc.comptes["2008"].population));
	svgHist.select(".charge_fonct")
		.append("text")
	    .text( label_rel.toString() + " €/habitant")
	    .attr("x", 2.8*w/5+10)
	    .attr("y", h + 2*padding + 25 - 1.3*scale(datasetHist[2])/2)
	    .attr("class","texte_comment")
		.attr("id","tx2comment_charge_fonct");
	
	svgHist.select(".charge_invest")
	   .append("rect")
	   .attr("x", 2.8*w/5)
	   .attr("y", h + padding + ecart - scale(datasetHist[2])-1.3*scale(datasetHist[3])/2)
	   .attr("width", 118)
	   .attr("height", 50)
	   .attr("class","graph_comment")
	   .attr("id","grcomment_charge_invest");
	label_abs = Math.round(parseInt(datasetHist[3])/(Math.pow(10,power)));
	svgHist.select(".charge_invest")
		.append("text")
	    .text( label_abs.toString() + " " + unite + "€")
	    .attr("x", 2.8*w/5+10)
	    .attr("y", h + 2*padding + ecart - scale(datasetHist[2])-1.3*scale(datasetHist[3])/2)
	    .attr("class","texte_comment")
		.attr("id","tx1comment_charge_invest");
	label_rel = Math.round(parseInt(datasetHist[3])/parseInt(dataColloc.comptes["2008"].population));
	svgHist.select(".charge_invest")
		.append("text")
	    .text( label_rel.toString() + " €/habitant")
	    .attr("x", 2.8*w/5+10)
	    .attr("y", h + 2*padding + 25 - scale(datasetHist[2])-1.3*scale(datasetHist[3])/2)
	    .attr("class","texte_comment")
		.attr("id","tx2comment_charge_invest");
	
	/*Création des effets sur le graphique*/	
	$('.produit_fonct').mouseenter(function(){
		$('#grcomment_produit_fonct').css("display","block");
		$('#tx1comment_produit_fonct').css("display","block");
		$('#tx2comment_produit_fonct').css("display","block");
		$('.charge_fonct').css("opacity","0.5");
		$('.produit_invest').css("opacity","0.5");
		$('.charge_invest').css("opacity","0.5");
		$('#charge_fonct_legende').css("opacity","0.5");
		$('#produit_invest_legende').css("opacity","0.5");
		$('#charge_invest_legende').css("opacity","0.5");
	});
	$('.produit_fonct').mouseleave(function(){
		$('#grcomment_produit_fonct').css("display","none");
		$('#tx1comment_produit_fonct').css("display","none");
		$('#tx2comment_produit_fonct').css("display","none");
		$('.charge_fonct').css("opacity","1");
		$('.produit_invest').css("opacity","1");
		$('.charge_invest').css("opacity","1");
		$('#charge_fonct_legende').css("opacity","1");
		$('#produit_invest_legende').css("opacity","1");
		$('#charge_invest_legende').css("opacity","1");
	});
	
	$('.charge_fonct').mouseenter(function(){
		$('#grcomment_charge_fonct').css("display","block");
		$('#tx1comment_charge_fonct').css("display","block");
		$('#tx2comment_charge_fonct').css("display","block");
		$('.produit_fonct').css("opacity","0.5");
		$('.produit_invest').css("opacity","0.5");
		$('.charge_invest').css("opacity","0.5");
		$('#produit_fonct_legende').css("opacity","0.5");
		$('#produit_invest_legende').css("opacity","0.5");
		$('#charge_invest_legende').css("opacity","0.5");
	});
	$('.charge_fonct').mouseleave(function(){
		$('#grcomment_charge_fonct').css("display","none");
		$('#tx1comment_charge_fonct').css("display","none");
		$('#tx2comment_charge_fonct').css("display","none");
		$('.produit_fonct').css("opacity","1");
		$('.produit_invest').css("opacity","1");
		$('.charge_invest').css("opacity","1");
		$('#produit_fonct_legende').css("opacity","1");
		$('#produit_invest_legende').css("opacity","1");
		$('#charge_invest_legende').css("opacity","1");
	});
	
	$('.produit_invest').mouseenter(function(){
		$('#grcomment_produit_invest').css("display","block");
		$('#tx1comment_produit_invest').css("display","block");
		$('#tx2comment_produit_invest').css("display","block");
		$('.produit_fonct').css("opacity","0.5");
		$('.charge_fonct').css("opacity","0.5");
		$('.charge_invest').css("opacity","0.5");
		$('#produit_fonct_legende').css("opacity","0.5");
		$('#charge_fonct_legende').css("opacity","0.5");
		$('#charge_invest_legende').css("opacity","0.5");
	});
	$('.produit_invest').mouseleave(function(){
		$('#grcomment_produit_invest').css("display","none");
		$('#tx1comment_produit_invest').css("display","none");
		$('#tx2comment_produit_invest').css("display","none");
		$('.produit_fonct').css("opacity","1");
		$('.charge_fonct').css("opacity","1");
		$('.charge_invest').css("opacity","1");
		$('#produit_fonct_legende').css("opacity","1");
		$('#charge_fonct_legende').css("opacity","1");
		$('#charge_invest_legende').css("opacity","1");
	});
		
	$('.charge_invest').mouseenter(function(){
		$('#grcomment_charge_invest').css("display","block");
		$('#tx1comment_charge_invest').css("display","block");
		$('#tx2comment_charge_invest').css("display","block");
		$('.produit_fonct').css("opacity","0.5");
		$('.charge_fonct').css("opacity","0.5");
		$('.produit_invest').css("opacity","0.5");
		$('#produit_fonct_legende').css("opacity","0.5");
		$('#charge_fonct_legende').css("opacity","0.5");
		$('#produit_invest_legende').css("opacity","0.5");
	});
	$('.charge_invest').mouseleave(function(){
		$('#grcomment_charge_invest').css("display","none");
		$('#tx1comment_charge_invest').css("display","none");
		$('#tx2comment_charge_invest').css("display","none");
		$('.produit_fonct').css("opacity","1");
		$('.charge_fonct').css("opacity","1");
		$('.produit_invest').css("opacity","1");
		$('#produit_fonct_legende').css("opacity","1");
		$('#charge_fonct_legende').css("opacity","1");
		$('#produit_invest_legende').css("opacity","1");
	});
	
	$('#produit_fonct_legende').mouseenter(function(){
		$('#grcomment_produit_fonct').css("display","block");
		$('#tx1comment_produit_fonct').css("display","block");
		$('#tx2comment_produit_fonct').css("display","block");
		$('.charge_fonct').css("opacity","0.5");
		$('.produit_invest').css("opacity","0.5");
		$('.charge_invest').css("opacity","0.5");
		$('#charge_fonct_legende').css("opacity","0.5");
		$('#produit_invest_legende').css("opacity","0.5");
		$('#charge_invest_legende').css("opacity","0.5");
	});
	$('#produit_fonct_legende').mouseleave(function(){
		$('#grcomment_produit_fonct').css("display","none");
		$('#tx1comment_produit_fonct').css("display","none");
		$('#tx2comment_produit_fonct').css("display","none");
		$('.charge_fonct').css("opacity","1");
		$('.produit_invest').css("opacity","1");
		$('.charge_invest').css("opacity","1");
		$('#charge_fonct_legende').css("opacity","1");
		$('#produit_invest_legende').css("opacity","1");
		$('#charge_invest_legende').css("opacity","1");
	});
	
	$('#charge_fonct_legende').mouseenter(function(){
		$('#grcomment_charge_fonct').css("display","block");
		$('#tx1comment_charge_fonct').css("display","block");
		$('#tx2comment_charge_fonct').css("display","block");
		$('.produit_fonct').css("opacity","0.5");
		$('.produit_invest').css("opacity","0.5");
		$('.charge_invest').css("opacity","0.5");
		$('#produit_fonct_legende').css("opacity","0.5");
		$('#produit_invest_legende').css("opacity","0.5");
		$('#charge_invest_legende').css("opacity","0.5");
	});
	$('#charge_fonct_legende').mouseleave(function(){
		$('#grcomment_charge_fonct').css("display","none");
		$('#tx1comment_charge_fonct').css("display","none");
		$('#tx2comment_charge_fonct').css("display","none");
		$('.produit_fonct').css("opacity","1");
		$('.produit_invest').css("opacity","1");
		$('.charge_invest').css("opacity","1");
		$('#produit_fonct_legende').css("opacity","1");
		$('#produit_invest_legende').css("opacity","1");
		$('#charge_invest_legende').css("opacity","1");
	});
	
	$('#produit_invest_legende').mouseenter(function(){
		$('#grcomment_produit_invest').css("display","block");
		$('#tx1comment_produit_invest').css("display","block");
		$('#tx2comment_produit_invest').css("display","block");
		$('.produit_fonct').css("opacity","0.5");
		$('.charge_fonct').css("opacity","0.5");
		$('.charge_invest').css("opacity","0.5");
		$('#produit_fonct_legende').css("opacity","0.5");
		$('#charge_fonct_legende').css("opacity","0.5");
		$('#charge_invest_legende').css("opacity","0.5");
	});
	$('#produit_invest_legende').mouseleave(function(){
		$('#grcomment_produit_invest').css("display","none");
		$('#tx1comment_produit_invest').css("display","none");
		$('#tx2comment_produit_invest').css("display","none");
		$('.produit_fonct').css("opacity","1");
		$('.charge_fonct').css("opacity","1");
		$('.charge_invest').css("opacity","1");
		$('#produit_fonct_legende').css("opacity","1");
		$('#charge_fonct_legende').css("opacity","1");
		$('#charge_invest_legende').css("opacity","1");
	});
		
	$('#charge_invest_legende').mouseenter(function(){
		$('#grcomment_charge_invest').css("display","block");
		$('#tx1comment_charge_invest').css("display","block");
		$('#tx2comment_charge_invest').css("display","block");
		$('.produit_fonct').css("opacity","0.5");
		$('.charge_fonct').css("opacity","0.5");
		$('.produit_invest').css("opacity","0.5");
		$('#produit_fonct_legende').css("opacity","0.5");
		$('#charge_fonct_legende').css("opacity","0.5");
		$('#produit_invest_legende').css("opacity","0.5");
	});
	$('#charge_invest_legende').mouseleave(function(){
		$('#grcomment_charge_invest').css("display","none");
		$('#tx1comment_charge_invest').css("display","none");
		$('#tx2comment_charge_invest').css("display","none");
		$('.produit_fonct').css("opacity","1");
		$('.charge_fonct').css("opacity","1");
		$('.produit_invest').css("opacity","1");
		$('#produit_fonct_legende').css("opacity","1");
		$('#charge_fonct_legende').css("opacity","1");
		$('#produit_invest_legende').css("opacity","1");
	});

	
	//Création de la courbe
	var datasetCourProdfonct = [];
	var datasetCourProdinv = [];
	var datasetCourCharfonct = [];
	var datasetCourCharinv = [];
	var aux=0;
	for(var i = 2008; i < 2016; i++){
		aux = Math.max(aux,parseInt(dataColloc.comptes[i.toString()].totprodfonct),parseInt(dataColloc.comptes[i.toString()].resinvbudg),parseInt(dataColloc.comptes[i.toString()].totcharfonct),parseInt(dataColloc.comptes[i.toString()].totempinv));
		datasetCourProdfonct.push({
			"x":i,
			"y":parseInt(dataColloc.comptes[i.toString()].totprodfonct)
		});
		datasetCourProdinv.push({
			"x":i,
			"y":parseInt(dataColloc.comptes[i.toString()].resinvbudg)
		});
		datasetCourCharfonct.push({
			"x":i,
			"y":parseInt(dataColloc.comptes[i.toString()].totcharfonct)
		});
		datasetCourCharinv.push({
			"x":i,
			"y":parseInt(dataColloc.comptes[i.toString()].totempinv)
		});
	};
	console.log(datasetCourCharfonct)
	
	/*Initialisation des variables liées aux unités des grandeurs*/
	/*var label_abs = "";
	var label_rel = "";
	var power = 0;
	var unite = "";
	var var_aux = Math.min(parseInt(datasetHist[0])+parseInt(datasetHist[1]),parseInt(datasetHist[2])+parseInt(datasetHist[3]));
	while(var_aux/10>1){
		power++;
		var_aux = var_aux/10;
	}
	power = Math.min(power - power % 3,6);
	switch (power){
		case 0 :
			unite = "";
			break;
		case 3 :
			unite = "k";
			break;
		case 6 :
			unite = "M";
			break;
		default :
			unite = "";
			break;
	}
	
	/*Création de l'axe et de la grille*/
	
	/*Création des éléments de l'histogramme*/	
	var lineFunction = d3.line()
                         .x(function(d) { return d.x; })
                         .y(function(d) { return d.y; })
						 .curve(d3.curveLinear);
	svgCour.append("path")
						.attr("d", lineFunction(datasetCourProdfonct))
						.attr("stroke", "blue")
						.attr("stroke-width", 2);
						
	
	
}

})();