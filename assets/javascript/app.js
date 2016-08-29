// Global Variables

// Contants
var maxTime = 20; // in seconds
var delaytime = 5; // in seconds
var boxClass = 'col-sm-4 rowbox';
var boxShiftClass = 'col-sm-4 col-sm-offset-4 rowbox';
var div = '<div>';
var buttonStr = '<button class="btn btn-primary btn-lg">';
var timeRemaining = '<h4>The time remaining: <span id="timer"></span></h4>';

// ===== Execution ====

$(document).ready(readyFn);

function readyFn() {
	
	createInitialFrame();
}

// Objects
var timer = {
	time: maxTime,
	id: null,

	reset: function () {
		timer.stop();
		timer.time = maxTime;
	},
	start: function(){
		// make sure only one copy timer
        if (timer.id == null) {
             timer.id = setInterval(timer.countDown, 1000);
        }
      
    },
    stop: function(){
        // TODO: Use clearInterval to stop the count here.
        if (timer.id != null) {
            clearInterval(timer.id);
            timer.id = null;
        }
    },    
    countDown: function(){
        // TODO: decrement time by 1, remember we cant use "this" here.
        timer.time--;

        // TODO: Get the current time, pass that into the timer.timeConverter function, 
        //       and save the result in a variable.
        var display = timer.timeConverter(timer.time);
        // TODO: Use the variable you just created to show the converted time in the "display" div.
        $('#timer').html(display);
        if (timer.time == 0) {
        	timer.reset();
        }
    },
	// THIS FUNCTION IS DONE FOR YOU!
    // You do not need to touch it.
    timeConverter: function(t){
        // Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
        var minutes = Math.floor(t/60);
        var seconds = t - (minutes * 60);
        if (seconds < 10){
            seconds = "0" + seconds;
        }
        if (minutes === 0){
            minutes = "00";
        } else if (minutes < 10){
            minutes = "0" + minutes;
        }

        return minutes + ":" + seconds;
    }

}

function createElement(cls, id) {
	var ele = $('<div>').addClass(cls).attr('id', id);
	return ele;
}

function createButton(id, text) {
	var button = $(buttonStr).attr('id', id).text(text);
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
	createCenterBoxContent();
	timer.start();
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
function createCenterBoxContent() {
	
	$('#centerbox').append($(timeRemaining));
	var obj = createElement('well', 'question');
	$('#centerbox').append(obj);
	var str = timer.timeConverter(maxTime);
	$('#timer').html(str);
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

