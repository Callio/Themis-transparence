$(function(){
	var entete_accueil_blank = $("#entete_accueil_blank"),
		hauteur = 0,
		test = 0;
	hauteur = $(window).height();
	entete_accueil_blank.css({height: hauteur});
	$(window).resize(function(){
		hauteur = $(window).height();
		entete_accueil_blank.css({height: hauteur});
	});
});