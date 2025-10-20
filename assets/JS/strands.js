/**
 * This is the JavaScript interactive part of the Strands page.
 * It controls the lifecycle of the game.
 * 
 * TODOs
 * - Touch support for mobile devices
 * - Better animations with lines connecting selected letters
 */

const board = document.getElementById("board");

const THEME = "Flavor Carousel";

// In a real game, this might come from an API
// TODO: How to hide answer from the user? Make checkWord server side?
const BOARD_LETTERS = [
    ["N", "L", "W", "E", "S", "A"],
    ["O", "W", "O", "O", "L", "M"],
    ["R", "O", "B", "U", "O", "I"],
    ["O", "T", "L", "M", "R", "H"],
    ["P", "S", "E", "C", "T", "E"],
    ["P", "S", "E", "R", "A", "W"],
    ["A", "F", "A", "C", "I", "N"],
    ["S", "T", "S", "A", "E", "G"],
];
const WORDS = [
    "SAPPORO",
    "FACINGEAST",
    "SEOULBOWL",
    "WATERCRESS",
    "LIMA",
];
const SPANOGRAM = "HOMETOWN";

const BOARD_ROWS = BOARD_LETTERS.length;
const BOARD_COLS = BOARD_LETTERS[0].length;

const SOLVED_WORD_COLOR = "green";
const SPANOGRAM_COLOR = "yellow";
const SELECTED_COLOR = "blue";
const DEFAULT_COLOR = "";

// Size of each button on the screen
const boardWidth = window.innerWidth * 0.75;
const boardHeight = window.innerHeight * 0.75;
const BUTTON_SIZE = Math.min(boardWidth/BOARD_COLS, boardHeight / BOARD_ROWS);

// Is the user currently selecting an element?
let isDragging = false;
// Selected elements
let path = [];
// Found theme words
let foundThemeWords = 0;

function setup() {
    var theme = document.createElement("div");
    theme.className = "row justify-content-center theme";
    theme.innerText = `Theme: ${THEME}`;
    board.appendChild(theme);

    for (let r = 0; r < BOARD_ROWS; r++) {
        var row = document.createElement("div");
        row.className = "row justify-content-center"

        for (let c = 0; c < BOARD_COLS; c++) {
            var btn = document.createElement("button");
            btn.className = "boardBtn";
            btn.textContent = BOARD_LETTERS[r][c];

            btn.style.height = BUTTON_SIZE + "px";
            btn.style.width = BUTTON_SIZE + "px";
            btn.style.margin = (BUTTON_SIZE * 0.08) + "px";
            btn.style.backgroundColor = DEFAULT_COLOR;

            btn.dataset.row = r;
            btn.dataset.col = c;
            row.appendChild(btn);
        }

        board.appendChild(row);
    }

    var status = document.createElement("div");
    status.className = "row justify-content-center status";
    status.id = "status"
    status.innerText = `${foundThemeWords} of ${WORDS.length+1} theme words found`;
    board.appendChild(status);
}

// Clear selection if the user mouseup'd and path. Should not be called if the selection is a correct word.
function clearPath() {
    path.forEach(oldPathBtn => {
        oldPathBtn.style.backgroundColor = DEFAULT_COLOR;
    });
    path = [];
}

// User mousedown'd, starting a new selection
function startDrag(button) {
    // Button is already part of a solved word or current selection
    if (button.style.backgroundColor !== DEFAULT_COLOR) return;

    clearPath();

    isDragging = true;
    path = [button];
    button.style.backgroundColor = SELECTED_COLOR;
}

// Whether two buttons can be connected. Diagonals are allowed.
function areNeighbors(r1, c1, r2, c2) {
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    return dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0);
}

// User has started a selection and mouseover'd, extending their selection.
function continueDrag(button) {
    if (!isDragging) {
        return;
    }
    if (path.includes(button)) {
        return;
    }
    if (path.length == 0) {
        return;
    }

    const buttonBackgroundColor = button.style.backgroundColor;
    if (buttonBackgroundColor === SOLVED_WORD_COLOR || buttonBackgroundColor === SPANOGRAM_COLOR) {
        return;
    }

    const last = path[path.length - 1];
    const lastR = +last.dataset.row;
    const lastC = +last.dataset.col;
    const r = +button.dataset.row;
    const c = +button.dataset.col;

    if (!areNeighbors(lastR, lastC, r, c)) {
        return;
    }

    path.push(button);
    button.style.backgroundColor = SELECTED_COLOR;
}

// The current path is a correct word, so color it in.
function colorPath(color) {
    board.removeEventListener("mousedown", onMouseDown);

    const delayMs = 100;
    let i = 0;
    const intervalId = setInterval(() => {
        if (i < path.length) {
            path[i].style.backgroundColor = color;
            i++;
        } else {
            clearInterval(intervalId);
            path = [];
            board.addEventListener("mousedown", onMouseDown);
        }
    }, delayMs);
}

// Check if the current selection is part of the solution.
function checkWord() {
    const word = path.map(btn => btn.textContent).join("")
    console.log(`Checking ${word}`)

    if (word === SPANOGRAM) {
        colorPath(SPANOGRAM_COLOR);
        return true;
    } else if (WORDS.includes(word)) {
        colorPath(SOLVED_WORD_COLOR);
        return true;
    } else {
        return false;
    }
}

function onMouseMove(event) {
    if (!isDragging) return;

    const el = document.elementFromPoint(event.clientX, event.clientY);
    if (el && el.matches(".boardBtn")) {
        continueDrag(el);
    }
}

function onMouseUp() {
    if (!checkWord())
    {
        clearPath();
        board.removeEventListener("mousemove", onMouseMove);
    } else {
        foundThemeWords += 1;
        document.getElementById("status").innerText = `${foundThemeWords} of ${WORDS.length+1} theme words found`;
    }

    isDragging = false;
}

function onMouseDown(event) {
    if (event.target.matches(".boardBtn")) {
        startDrag(event.target);
        // start listening for mouse move events
        board.addEventListener("mousemove", onMouseMove);
    }
}

board.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);