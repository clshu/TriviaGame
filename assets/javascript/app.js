// Global Variables
//var isFirstTime = true;
var movies = [];
var wins;
var losses;
var unanswered;
var gamesRemaining;
var movie = null;
var timeOutId = null;

// Contants
var maxTime = 5; // in seconds
var delaytime = 5; // in seconds
var boxClass = 'col-sm-4 rowbox';
//var boxShiftClass = 'col-sm-4 col-sm-offset-4 rowbox';
var div = '<div>';
var buttonStr = '<button class="btn btn-warning btn-lg">';
var timeRemaining = '<p>The time remaining: <span id="timer"></span></p>';
//var correctMsg = '<h3 style="color: green">Correct</h3>';
//var incorrectMsg = '<h3 style="color: red">Incorrect</h3>';
var imgPath = 'assets/images/';



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
        if (timer.id != null) {
            clearInterval(timer.id);
            timer.id = null;
        }
    },    
    countDown: function(){  
        timer.time--;
        var display = timer.timeConverter(timer.time);
   
        $('#timer').html(display);
        if (timer.time == 0) {
        	timer.reset();
        	processTimeUp();
        }
    },

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

// Functions
function initialize() {
	movies = loadData();
	wins = 0;
	losses = 0;
	unanswered = 0;
	gamesRemaining = movies.length;
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
	// row2 boxes
	box = createElement(boxClass, 'imgbox1');
	row2.append(box);
	box = createElement(boxClass, 'bottombox');
	row2.append(box);
	box = createElement(boxClass, 'imgbox2');
	row2.append(box);
	// create start button and add click listener
	$('#bottombox').addClass('text-center');
	button = createButton('start', 'Start !');
	$('#bottombox').append(button);
	addListener('#start', 'click', clickStartButton);
}
// Even handling
function addListener(sel, event, fn) {
    $(sel).on(event, fn);
}
function removeListener(sel, event, fn) {
	$(sel).off(event, fn);
}
function addListeners() {
	addListener('.choice', 'mouseenter', mouseenterChoice);
	addListener('.choice', 'mouseleave', mouseleaveChoice);
	addListener('.choice', 'click', clickChoice);
}
function removeListeners() {
	removeListener('.choice', 'mouseenter', mouseenterChoice);
	removeListener('.choice', 'mouseleave', mouseleaveChoice);
	removeListener('.choice', 'click', clickChoice);
}
// testing purpose only
function clickLeftBox() {
	startNewQuestion();
}
function clickStartButton() {
	// remove start button
	$(this).remove();
	createBoxContents();
}
function clickStartOverButton() {
	$('.rowbox').empty();
	initialize();
	createBoxContents();
}
function clickChoice() {
	var result, comment;
	var id = $(this).attr('id');
	$(this).removeClass('choice-focus');
	if (id == movie.answer) {
		$(this).addClass('choice-correct');
		result = 'Correct';
		wins++;

	} else { 
		$(this).addClass('choice-incorrect');

		// find the correct answer and mark it 'choice-correct'
		var siblings = $(this).siblings();
		for (var i = 0; i < siblings.length; i++) {
			if ($(siblings[i]).attr('id') == movie.answer) {
				$(siblings[i]).addClass('choice-correct');
				break;
			}
		}
		result = 'Incorrect';
		losses++;
	}
	gamesRemaining--;
	updateLeftBoxContent();
	updateRightBoxContent(result, movie);
	updateImgBox(movie);

	timer.stop();
	removeListeners();
	if (timeOutId == null) {
		timeOutId = setTimeout(startNewQuestion, 5000);
	}
}
function mouseenterChoice() {
	$(this).addClass('choice-focus');

}
function mouseleaveChoice() {
	$(this).removeClass('choice-focus');

}
function processTimeUp() {
	unanswered++;
	gamesRemaining--;
	updateLeftBoxContent();
	updateRightBoxContent('Time Up', movie);
	updateImgBox(movie);
	var children = $('#choices').children();

	for (var i = 0; i < children.length; i++) {
		if ($(children[i]).attr('id') == movie.answer) {
			$(children[i]).addClass('choice-correct');
			break;
		}
	}

	removeListeners();
	if (timeOutId == null) {
	 	timeOutId = setTimeout(startNewQuestion, 5000);
	}
}

function startNewQuestion() {
	if (timeOutId != null) {
		clearTimeout(timeOutId);
		timeOutId = null;
	}
	if (gamesRemaining == 0) {
		$('#bottombox').empty();
		var button = createButton('startover', 'Start Over?');
		$('#bottombox').append(button);
		addListener('#startover', 'click', clickStartOverButton);
		return;
	}
	$('#question').empty();
	$('#rightbox').empty();
	$('#bottombox').empty();
	$('#imgbox1').empty();
	$('#imgbox2').empty();

	movie = null;
	movie = getMovie();

	updateCenterBoxContent(movie);
	//createImgBoxContent('#imgbox1', 'img1');
	createBottomBoxContent(movie);
	//createImgBoxContent('#imgbox2', 'img2');
	
	timer.reset();
	timer.start();
}
// DOM manipulation
function createElement(cls, id) {
	var ele = $('<div>').addClass(cls).attr('id', id);
	return ele;
}

function createButton(id, text) {
	var button = $(buttonStr).attr('id', id).text(text);
	return button;
}
function createBoxContents() {
	movie = getMovie();
	createLeftBoxContent();
	createCenterBoxContent(movie);
	//createRightBoxContent();
	//createImgBoxContent('#imgbox1', 'img1');
	createBottomBoxContent(movie);
	//createImgBoxContent('#imgbox2', 'img2');
	timer.start();
}

function createLeftBoxContent() {
	var obj = createElement('well', 'leftbox-container');
	var line1 = '<p>Wins: <span id="wins"></span></p><p></p>';
	var line2 = '<p>Losses: <span id="losses"></span></p><p></p>';
	var line3 = '<p>Unanswered: <span id="unanswered"></span></p><p></p>';
	var line4 = '<p>Questions Remaining: <span id="gamesRemaining"></span></p><p></p>';
	$('#leftbox').append(obj);
	obj.append($(line1));
	obj.append($(line2));
	obj.append($(line3));
	obj.append($(line4));
	updateLeftBoxContent();
	addListener('#leftbox', 'click', clickLeftBox);
}

function updateLeftBoxContent() {
	$('#wins').html(wins);
	$('#losses').html(losses);
	$('#unanswered').html(unanswered);
	$('#gamesRemaining').html(gamesRemaining);
}
function createCenterBoxContent(movie) {
	var obj = createElement('well','remaining');
	obj.append($(timeRemaining));
	$('#centerbox').append(obj);

	obj = createElement('well', 'question');
	$('#centerbox').append(obj);
	updateCenterBoxContent(movie);	
}
function updateCenterBoxContent(movie) {
	var str = timer.timeConverter(maxTime);
	$('#timer').html(str);
	$('#question').html(movie.question);
}
function updateRightBoxContent(result, movie) {
	var obj = createElement('well', 'rightbox-container');
	var resultStr = createResult(result, movie.answer);
	obj.append($(resultStr));
	var comment = createComment(movie.comment);
	obj.append($(comment));
	$('#rightbox').append(obj);
}
function createResult(result, answer) {
	var msg = '<h4 style="color: ';
	if (result == 'Correct') {
		msg += 'green' + '">' + result +'</h4>';
	} else {
		msg += 'red' + '">' + result +'</h4>';
		msg += '<p>Answer: ' + answer + '</p>'; 
	}
	return msg;
}
function createComment(comment) {
	//var msg = '<p></p><p>' + comment + '</p>';
	return ('<p></p><p>' + comment + '</p>');
}

function createBottomBoxContent(movie) {
	var ul = $('<ul class="list-group text-center" id="choices">');
	for (var i = 0; i < movie.choices.length; i++) {
		var li = '<li class="list-group-item choice">' + movie.choices[i] + '</li>';
		var liObj = $(li).attr('id', movie.choices[i]);
		ul.append(liObj);
	}
	$('#bottombox').append(ul);
	addListeners();
}

function createImgBoxContent(cls, id) {
	var path;
	var thumbnail = $('<div>').addClass('thumbnail').attr('id', id);
	if (cls == "#imgbox1") {
		path = imgPath + movie.img1;
	} else if (cls == "#imgbox2") {
		path = imgPath + movie.img2;
	}
	var img = $('<img>').attr('src', path).attr('alt', movie.answer);
	thumbnail.append(img);
	$(cls).append(thumbnail);
}

function updateImgBox(movie) {
	if (movie == null) {
		$('#imgbox1').empty();
		$('#imgbox2').empty();
	} else {
		createImgBoxContent("#imgbox1", "img1"); 
		createImgBoxContent("#imgbox2", "img2");
	}
}

// Helper functions

function loadData() {
	var arr = [];
	for (var i = 0; i < gameData.length; i++) {
		arr.push(gameData[i]);
	}
	return arr;
}
// Snippet from mozilla developer network
// Generate random integer between min(included) and max (excluded)
function getRandomInt(min, max) {
	var min = Math.ceil(min);
	var max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
function getMovie() {
	var index = getRandomInt(0, movies.length);
	var obj = Object.assign({}, movies[index]);
	movies.splice(index, 1);
	return obj;
}
// ===== Execution ====

$(document).ready(readyFn);

function readyFn() {

	initialize();
	createInitialFrame()
}

// Game Data

var gameData = [
{
	answer: "Marilyn Monroe",
	question: "Norma Jeane Mortenson was better known under her stage name:",
	choices: ["Natalie Wood", "Doris Day", "Lauren Bacall", "Marilyn Monroe"],
	comment: "Marilyn Monroe, born June 1, 1926,  was an American actress and model. Famous for playing 'dumb blonde' characters, she became one of the most popular sex symbols of the 1950s, emblematic of the era's attitudes towards sexuality.",
	img1: "marilyn.jpg",
	img2: "marilyn.jpg"
},

{
	answer: "Peter Fonda and Dennis Hopper",
	question: "What actors play the main characters in the American road movie Easy Rider?",
	choices: ["Clint Eastwood and Burt Reynolds", "Warren Beatty and Alan Alda", "Peter Fonda and Dennis Hopper", "Dustin Hoffman and Paul Newman"],
	comment: "This is a comment",
	img1: "peterfonda.jpg",
	img2: "peterfonda.jpg"
},

{
	answer: "Steve McQueen",
	question: "Who plays the leading character in The Thomas Crown Affair from 1968?",
	choices: ["Steve McQueen", " Clint Eastwood", "Albert Finney", "George Segal"],
	comment: "The Thomas Crown Affair is a 1968 film directed and produced by Norman Jewison. Steve McQueen plays the leading character, Thomas Crown. Faye Dunaway plays the investigator, Vicki Anderson. The film was nominated for two Academy Awards, winning Best Original Song for Michel Legrand's Windmills of Your Mind",
	img1: "crownaffair.jpg",
	img2: "crownaffair.jpg"
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

