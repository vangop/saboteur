'use strict';
var imgElement;
function setStatus (status) {
	var lastCheck = document.getElementById("last-check");
	lastCheck.textContent = new Date();
	if (!status) {
		var ulElement = document.querySelector(".list");
		var liElement = document.createElement("li");
		liElement.className = "error";
		ulElement.appendChild(liElement);
		liElement.textContent = "cannot reach: " + new Date();
	};
	imgElement.remove();
}
function checkOnline () {
	imgElement = document.createElement("img");
	document.body.appendChild(imgElement);
	imgElement.onload = function(){
		setStatus(true);
		console.log('loaded');
	};
	imgElement.onerror = function(){
		setStatus(false);
		console.log('error');
	};
	imgElement.setAttribute("src", "https://www.google.com/images/logos/google_logo_41.png");
}
checkOnline();
setInterval(checkOnline, 60000);