/*
This file exists to provide needed javascript for the page running the Frogger game.
It does not include any game functionality.
-Created by Aaron Butler on 9/8/2015
*/
window.addEventListener('load',function(f) {

//Menu drawer open/close and hamburger icon handling
	var hamburger = document.querySelector('#hamburger');
	var topHeader = document.querySelector('#top-header');
	var navDrawer = document.querySelector('#nav-drawer');

	hamburger.addEventListener('click', function(e) {
		//console.log("hamburger clicked");
		navDrawer.classList.toggle('open');
		e.stopPropagation();
	});
	topHeader.addEventListener('click', function() {
		navDrawer.classList.remove('open');
	});

	//var menuItems = document.querySelectorAll(".menu-item");
	var menuItems = document.getElementsByClassName('menu-item');
	for (var i = 0, len=menuItems.length; i < len; i++) {
		menuItems[i].addEventListener('click',function() {
			//console.log("closing drawer after click");
			navDrawer.classList.remove('open');
		});
	}
	//end menu drawer handling
});