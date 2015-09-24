'use strict';

console.log('\'Allo \'Allo! Popup');
var blokkForm = document.getElementById('blokk-form');
var button = document.getElementById('blokk-button');
var blurImg = document.getElementById('blurImg');
var fontOpacity = document.getElementById('fontOpacity');
var inputsOpt = document.getElementById('inputsOpt');


blokkForm.addEventListener('submit', function(event) {
	if (event.preventDefault) event.preventDefault();
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {
	  	blurImg: blurImg.checked,
	  	fontOpacity: fontOpacity.value,
	  	inputsOpt: inputsOpt.value,
	  	path: chrome.extension.getURL('')
	  }, function(response) {
	    console.log(response.farewell);
	  });
	});
	return false;
});