/**
 * JavaScript file corresponding to "Contact Me" page. Updates the school address to be visible depending on whether or
 * not school is in session.
 */

/** Changes Address to N/A in summer [May 11 - August 13] */
function nameSchoolAddress(className, addressLineInnerHMTL) {
	var schoolAddrs = document.getElementsByClassName(className);
	
	var currDate = new Date();
	var month = currDate.getMonth(); // 4 = May, 7 = August
	var day = currDate.getDate(); // First day = 1

	if ((month == 4 && day >= 11) || (month == 5) || (month == 6)
			|| (month == 7 && day <= 13)) { // between May 11 and August 13
		for (var i = 0; i < schoolAddrs.length; i++) {
			schoolAddrs[i].innerHTML = "N/A in summer";
		}
	} else {
		for (var i = 0; i < schoolAddrs.length; i++) {
			schoolAddrs[i].innerHTML = addressLineInnerHMTL;
		}
	}
}	
nameSchoolAddress("schoolAddressLine1", "03334 Bagwell Hall");
nameSchoolAddress("schoolAddressLine2", "Raleigh, NC 27607");
