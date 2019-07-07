/**
 * JavaScript file corresponding to projects page
 */

/** Behavior of animated collapsible menus */
function collapsible(className){
	var coll = document.getElementsByClassName(className);

	for (var i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", function() {
			this.classList.toggle("active");
			var content = this.nextElementSibling;
			if (content.style.maxHeight) {
				content.style.maxHeight = null;
			} else {
				content.style.maxHeight = content.scrollHeight + "px";
			}
		});
	}
}
collapsible("collapsible");

/** Adds current domain name to text */
function nameDomain(className){
	var links = document.getElementsByClassName(className);
	var domainName = window.location.hostname;
	if (domainName) {
		for (var i = 0; i < links.length; i++) {
			links[i].innerHTML = domainName;
		}
	} else{
		//Leave any inner HTML already present
	}
}
nameDomain("myDomain");