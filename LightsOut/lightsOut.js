/**
 * This is the javascrpit interactive part of the lights out page.
 * It controls the creation of the board of buttons, the scrambling of the board,
 * what happens when a buttons is clicked, and what happens when the board is solved.
 */

/** A 2D array of button elements to change their color when one is pressed */
var buttons;
/** The number of clicks the user has made in this solve attempt */
var clicks = 0;
/** The approximate height in pixels of the portion of the screen above the board */
var headerHeight = 110;
/** The maximum allowable board size. Larger values likely have issues displaying or cause performance problems */
var maxSize = 30;


/**
 * Creates a n x n array of elements for a given n.
 * 
 * @param size the size of the 2D array
 */
function makeArray(size) {
	buttons = new Array(size);

	for(var i = 0; i < size; i++) {
		buttons[i] = new Array(size);
	}
}


/**
 * Resets the board to a completely solved state.
 * Resets the number of clicks the user has made.
 */
function reset() {
	for(var i = 0; i < buttons.length; i++) {
		for(var j = 0; j < buttons[i].length; j++) {
			buttons[i][j].style.backgroundColor = "gray";
		}
	}

	clicks = 0;
	document.getElementById("clicksCount").innerText = "Clicks: " + clicks;
}


/**
 * Is the board in a solved state where no lights are on (red)?
 * 
 * @returns true if no lights in the board are on.
 */
function isSolved() {
	for(var i = 0; i < buttons.length; i++) {
		for(var j = 0; j < buttons[i].length; j++) {
			if(buttons[i][j].style.backgroundColor == "red") {
				return false;
			}
		}
	}
	return true;
}


/**
 * Carries out the effect of clicking a button at a given position.
 * If specified, this function will check if this click solved the board.
 * 
 * @param r the row index of the clicked button
 * @param c the column index of the clicked button
 * @param checkSolved should this function check to see if the click solved the board?
 */
function click(r, c, checkSolved) {
	clicks++;
	document.getElementById("clicksCount").innerText = "Clicks: " + clicks;

	flip(buttons[r][c]); // this
	if(r > 0) { // above
		flip(buttons[r - 1][c]);
	}
	if(r < buttons.length - 1) { // below
		flip(buttons[r + 1][c]);
	}
	if(c > 0) { // left
		flip(buttons[r][c - 1]);
	}
	if(c < buttons[0].length - 1) { // right
		flip(buttons[r][c + 1]);
	}

	if(checkSolved && isSolved()) {
		alert("Solved in "+clicks+" clicks!");
		reset();
	}
}


/**
 * Flips the state of a single button by changing its background color.
 * 
 * @param button a button element to chage it state.
 */
function flip(button) {
	var currentColor = button.style.backgroundColor;
	if(currentColor == "gray") {
		button.style.backgroundColor = "red";
	} else {
		button.style.backgroundColor = "gray";
	}
}


/**
 * Creates the n x n board of button elements and their click event listeners for a given n.
 * 
 * @param gridSize the number of buttons in one row of buttions
 */
function setup(gridSize) {
	makeArray(gridSize);

	var centering = document.createElement("center");

	for(var i = 0; i < gridSize; i++) {
		var row = document.createElement("div");
		row.textAlign = "center";
		row.style.fontSize = 0;

		for(var j = 0; j < gridSize; j++) {
			(function(i, j) {
				var btn = document.createElement("button");
				btn.className = "boardBtn";
				
				var size = Math.min(window.innerWidth, window.innerHeight) - headerHeight;
				btn.style.height = Math.max(size / gridSize, 5) + "px";
				btn.style.width = Math.max(size / gridSize, 5) + "px";

				btn.addEventListener("click", function() {
					click(i, j, true);
				});

				buttons[i][j] = btn;
				row.appendChild(btn);
			}(i, j));
		}
		centering.appendChild(row);
	}

	document.getElementById("board").appendChild(centering);
}


/**
 * Randomly clicks about half of the buttons in the grid, creating a new scramble for the user.
 * Note that expecially for small board sizes, its possible the click have no net effect and the
 * baord remains solved
 */
function scramble() {
	for(var i = 0; i < buttons.length; i++) {
		for(var j = 0; j < buttons[i].length; j++) {
			if(Math.floor(Math.random() * 100) % 2 == 0) {
				click(i, j, false);
			}
		}
	}

	clicks = 0;
	document.getElementById("clicksCount").innerText = "Clicks: " + clicks;
}


/**
 * Asks users what sized board they would like to play.
 * If the response is not a number, less than 1, or greater than 30, users will be reprompted until 
 * they provide a valid response
 */
function promptUser() {
	var boardSize = Number(prompt("Enter a board size 1 - 30", "5"));
	if(!Number.isInteger(boardSize) || boardSize < 1 || boardSize > maxSize) {
		alert("Invalid size. Please enter a numer 1 - 30.");
		promptUser();
	} else {
		setup(boardSize);
	}
}