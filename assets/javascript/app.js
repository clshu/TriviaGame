// Global Variables

// Contants
var boxClass = 'col-sm-4 rowbox';
var boxShiftClass = 'col-sm-4 col-sm-offset-4 rowbox';
var div = '<div>';
var buttonStr = '<button class="btn btn-primary btn-lg">';
var timeRemaining = '<h4>The time remaining: <span id="timer"></span></h4>';
// var spanStr = '<span class="glyphicon glyphicon-ok-sign">';

$(document).ready(readyFn);

function readyFn() {
	
	createInitialFrame();
}

function createElement(cls, id) {
	var ele = $('<div>').addClass(cls).attr('id', id);
	return ele;
}

function createButton(id, text) {

	var button = $(buttonStr).attr('id', id).text(text);
	//var row = createElement('row', 'buttonRow');
	//var col = createElement('col-sm-4 col-sm-offset-4', 'buttonCol');
	//col.append(button);
	//row.append(col);
	
	return button;
}

function createInitialFrame() {
	var box, row1, row2, button, obj;
	// create 2 rows
	row1 = createElement('row', 'row1');
	$('#wrapper').append(row1);

	row2 = createElement('row', 'row2');
	$('#wrapper').append(row2);
	// row1 boxes
	box = createElement(boxClass, 'leftbox');
	row1.append(box);
	box = createElement(boxClass, 'centerbox');
	row1.append(box);
	box = createElement(boxClass, 'rightbox');
	row1.append(box);
	// row2 box
	box = createElement(boxShiftClass, 'bottombox');
	row2.append(box);

	//obj = $(timeRemaining);
	//$('#centerbox').append(obj);
	// create button row
	//obj = createElement
	$('#bottombox').addClass('text-center');
	button = createButton('start', 'Start !');
	$('#bottombox').append(button);
	addListener('#start', 'click', clickStartButton);
}

function addListener(sel, event, fn) {
    $(sel).on(event, fn);
}

function clickStartButton() {
	// remove start button
	$(this).remove();
	createBoxContents();
}
function createBoxContents() {
	createLeftBoxContent();
}
function createLeftBoxContent() {
	var line1 = '<p>Wins: <span id="wins"></span></p><p></p>';
	var line2 = '<p>Losses: <span id="losses"></span></p><p></p>';
	var line3 = '<p>Unanswered: <span id="unanswered"></span></p><p></p>';
	var line4 = '<p>Games Remaining: <span id="gamesRemaining"></span></p><p></p>';
	$('#leftbox').append($(line1));
	$('#leftbox').append($(line2));
	$('#leftbox').append($(line3));
	$('#leftbox').append($(line4));
}


// Game Data

var gameData = [
{
	answer: "Marilyn Monroe",
	question: "Norma Jeane Mortenson was better known under her stage name:",
	choices: ["Natalie Wood", "Doris Day", "Lauren Bacall", "Marilyn Monroe"],
	comment: "Marilyn Monroe, born June 1, 1926,  was an American actress and model. Famous for playing 'dumb blonde' characters, she became one of the most popular sex symbols of the 1950s, emblematic of the era's attitudes towards sexuality.",
	img: "marilyn.jpg"
},

{
	answer: "Peter Fonda and Dennis Hopper",
	question: "What actors play the main characters in the American road movie Easy Rider?",
	choices: ["Clint Eastwood and Burt Reynolds", "Warren Beatty and Alan Alda", "Peter Fonda and Dennis Hopper", "Dustin Hoffman and Paul Newman"],
	comment: "",
	img: "peterfonda.jpg"
},

{
	answer: "Steve McQueen",
	question: "Who plays the leading character in The Thomas Crown Affair from 1968?",
	choices: ["Steve McQueen", " Clint Eastwood", "Albert Finney", "George Segal"],
	comment: "The Thomas Crown Affair is a 1968 film directed and produced by Norman Jewison. Steve McQueen plays the leading character, Thomas Crown. Faye Dunaway plays the investigator, Vicki Anderson. The film was nominated for two Academy Awards, winning Best Original Song for Michel Legrand's Windmills of Your Mind",
	img: "crownaffair.jpg"
}
/*
var mv2 = {
	answer: "",
	question: "",
	choices: ["", "", "", ""],
	comment: "",
	img: ""
}
*/
];

