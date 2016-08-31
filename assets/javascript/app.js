// Global Variables
//var isFirstTime = true;
var movies = [];
var wins;
var losses;
var unanswered;
var questionsRemaing;
var movie = null;
var timeOutId = null;

// Contants
var maxTime = 20; // in seconds, max time allowed to answer the question
var delayTime = 10; // in seconds, delay netween 2 questions
var boxClass = 'col-sm-4 rowbox';
var div = '<div>';
var buttonStr = '<button class="btn btn-warning btn-lg">';
var timeRemaining = '<p>The time remaining: <span id="timer"></span></p>';
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
	// initialize global variables and load data
	movies = loadData();
	wins = 0;
	losses = 0;
	unanswered = 0;
	questionsRemaing = movies.length;
}

function createInitialFrame() {
	// Create initial frame in this order
	// row1: leftbox, centerbox, rightbox
	// row2: imgbox1, bottombox, imgbox2
	// Create start button in bottombox
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
	// add listeners for .choice ul list items
	addListener('.choice', 'mouseenter', mouseenterChoice);
	addListener('.choice', 'mouseleave', mouseleaveChoice);
	addListener('.choice', 'click', clickChoice);
}
function removeListeners() {
	// remove listeners for .choice ul list items
	removeListener('.choice', 'mouseenter', mouseenterChoice);
	removeListener('.choice', 'mouseleave', mouseleaveChoice);
	removeListener('.choice', 'click', clickChoice);
}

function clickStartButton() {
	// remove start button first
	$(this).remove();
	createBoxContents();
}
function clickStartOverButton() {
	// remove contents in all 6 boxes first
	$('.rowbox').empty();
	initialize();
	createBoxContents();
}
function clickChoice() {
	var result, comment;
	var id = $(this).attr('id');
	// remove choice-focus color
	$(this).removeClass('choice-focus');
	if (id == movie.answer) {
		// answer matched, add choice-correct color and update stats, result
		$(this).addClass('choice-correct');
		result = 'Correct';
		wins++;

	} else { 
		// answer not matched, add choice-incorrect color to selected list item
		$(this).addClass('choice-incorrect');

		// find the correct list item and add choice-correct color
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
	questionsRemaing--;
	// update stats
	updateLeftBoxContent();
	// load result and comment
	updateRightBoxContent(result, movie);
	// load images
	updateImgBox(movie);

	timer.stop();
	// make ul list items unclickable
	removeListeners();
	// set delay before starting new question
	if (timeOutId == null) {
		timeOutId = setTimeout(startNewQuestion, delayTime * 1000);
	}
}
// use mouseenter and mouseleave to toggle colors
function mouseenterChoice() {
	$(this).addClass('choice-focus');
}
function mouseleaveChoice() {
	$(this).removeClass('choice-focus');
}
function processTimeUp() {
	unanswered++;
	questionsRemaing--;
	// update stats
	updateLeftBoxContent();
	// load result and comment
	updateRightBoxContent('Time Up', movie);
	// load images
	updateImgBox(movie);

	var children = $('#choices').children();
	// find correct list item and add choice-correct color
	// also remove choice-focus color in case the mouse cursor stays on
	// one of list item when time is up
	for (var i = 0; i < children.length; i++) {
		// Use both way to access children for practice
		if (children.eq(i).hasClass('choice-focus')) {
			children.eq(i).removeClass('choice-focus');
		}
		if ($(children[i]).attr('id') == movie.answer) {
			$(children[i]).addClass('choice-correct');
		}
	}
	// make ul list items unclickable
	removeListeners();

	// timer is reset by timer.countDown at this point

	// set delay before starting a new question
	if (timeOutId == null) {
	 	timeOutId = setTimeout(startNewQuestion, delayTime * 1000);
	}
}

function startNewQuestion() {
	if (timeOutId != null) {
		clearTimeout(timeOutId);
		timeOutId = null;
	}
	if (questionsRemaing == 0) {
		// if end of game, add start over button in bottombox
		$('#bottombox').empty();
		var button = createButton('startover', 'Start Over?');
		$('#bottombox').append(button);
		addListener('#startover', 'click', clickStartOverButton);
		return;
	}
	// Leave leftbox(with all stats) and timer section intact,
	// clean up everything else
	$('#question').empty();
	$('#rightbox').empty();
	$('#bottombox').empty();
	$('#imgbox1').empty();
	$('#imgbox2').empty();
	// get a new move for the new question
	movie = null;
	movie = getMovie();
	// load timer and new question
	updateCenterBoxContent(movie);
	// load choices for the answer and add listeners
	createBottomBoxContent(movie);

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
	// get new movie for the question
	movie = getMovie();
	// load stats
	createLeftBoxContent();
	// load timer and question
	createCenterBoxContent(movie);
	// load choices for the answer and add listeners
	createBottomBoxContent(movie);

	timer.start();
}

function createLeftBoxContent() {
	// leftbox contains wins, losses, unanswered, and questionsRemaing
	var obj = createElement('well', 'leftbox-container');
	var line1 = '<p>Wins: <span id="wins"></span></p><p></p>';
	var line2 = '<p>Losses: <span id="losses"></span></p><p></p>';
	var line3 = '<p>Unanswered: <span id="unanswered"></span></p><p></p>';
	var line4 = '<p>Questions Remaining: <span id="questionsRemaing"></span></p><p></p>';
	$('#leftbox').append(obj);
	obj.append($(line1));
	obj.append($(line2));
	obj.append($(line3));
	obj.append($(line4));
	updateLeftBoxContent();
}

function updateLeftBoxContent() {
	// update stats
	$('#wins').html(wins);
	$('#losses').html(losses);
	$('#unanswered').html(unanswered);
	$('#questionsRemaing').html(questionsRemaing);
}
function createCenterBoxContent(movie) {
	// centerbox contains timer and question
	var obj = createElement('well','remaining');
	obj.append($(timeRemaining));
	$('#centerbox').append(obj);

	obj = createElement('well', 'question');
	$('#centerbox').append(obj);
	updateCenterBoxContent(movie);	
}
function updateCenterBoxContent(movie) {
	// update timer display and looad question
	var str = timer.timeConverter(maxTime);
	$('#timer').html(str);
	$('#question').html(movie.question);
}
function updateRightBoxContent(result, movie) {
	// load result and comment to rightbox
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
	return ('<p></p><p>' + comment + '</p>');
}

function createBottomBoxContent(movie) {
	// create ul list items in bottombox to hold choices for the answer
	// also add listeners
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
	// load images to imgbox1 and imgbox2
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
	createImgBoxContent("#imgbox1", "img1"); 
	createImgBoxContent("#imgbox2", "img2");
}

// Helper functions

function loadData() {
	// load game data
	var arr = [];
	for (var i = 0; i < gameData.length; i++) {
		arr.push(gameData[i]);
	}
	return arr;
}

// Generate random integer between min(included) and max (excluded)
function getRandomInt(min, max) {
	var min = Math.ceil(min);
	var max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
function getMovie() {
	// randomly select a movie from 'movies'
	// then remove slected movie from 'movies'
	// to ensure the same movie won't be selected again

	// get random number
	var index = getRandomInt(0, movies.length);
	// save a deep copy 
	var obj = Object.assign({}, movies[index]);
	// reomove it
	movies.splice(index, 1);
	// return saved copy
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
	img1: "marilyn1.jpeg",
	img2: "marilyn.jpg"
},

{
	answer: "Peter Fonda and Dennis Hopper",
	question: "What actors play the main characters in the American road movie Easy Rider?",
	choices: ["Clint Eastwood and Burt Reynolds", "Warren Beatty and Alan Alda", "Peter Fonda and Dennis Hopper", "Dustin Hoffman and Paul Newman"],
	comment: "Easy Rider is a 1969 American road movie written by Peter Fonda, Dennis Hopper, and Terry Southern, produced by Fonda and directed by Hopper. As a landmark counterculture film, the film was added to the Library of Congress National Registry in 1998.",
	img1: "peterdennis.jpeg",
	img2: "peterfonda.jpg"
},

{
	answer: "Steve McQueen",
	question: "Who plays the leading character in The Thomas Crown Affair from 1968?",
	choices: ["Steve McQueen", " Clint Eastwood", "Albert Finney", "George Segal"],
	comment: "The Thomas Crown Affair is a 1968 film directed and produced by Norman Jewison. Steve McQueen plays the leading character, Thomas Crown. Faye Dunaway plays the investigator, Vicki Anderson. The film was nominated for two Academy Awards, winning Best Original Song for Michel Legrand's Windmills of Your Mind",	
	img1: "mcqueen.jpeg",
	img2: "crownaffair.jpg"
},

{
	answer: "Gregory Peck",
	question: "The film To Kill a Mockingbird is based on a novel. Who is the leading actor?",
	choices: ["Dean Martin", "Gregory Peck", "Cary Grant", "James Stewart"],
	comment: "To Kill a Mockingbird is a 1962 American film directed by Robert Mulligan. The film is based on a novel by Harper Lee published in 1960.",
	img1: "peck.jpeg",
	img2: "mockingbird.jpg"
},

{
	answer: "Anne Bancroft",
	question: "Who plays the role as Mrs. Robinson in the 1967 movie The Graduate?",
	choices: ["Jeanne Moreau", "Lauren Bacall", "Anne Bancroft", "Angie Dickinson"],
	comment: "The Graduate is a 1967 American comedy-drama film directed by Mike Nichols. The role as the older woman, Mrs. Robinson, is played by Anne Bancroft.",
	img1: "bancroft.jpg",
	img2: "graduate.jpg"
},

{
	answer: "Janet Leigh",
	question: "Who plays the role as Marion Crane in the 1960 American film Psycho?",
	choices: ["Doris Day", "Natalie Wood", "Goldie Hawn", "Janet Leigh"],
	comment: "Janet Leigh was awarded the Golden Globe Award for Best Supporting Actress and received an Academy Award nomination for her role as Marion Crane in Psycho.",
	img1: "leigh.jpeg",
	img2: "psycho.jpg"
},


{
	answer: "Elizabeth Taylor",
	question: "Who plays Cleopatra in the 1963 movie directed by Joseph L. Mankiewicz?",
	choices: ["Anne Bancroft", "Elizabeth Taylor", "Katharine Hepburn", "Sophia Loren"],
	comment: "Cleopatra is a 1963 epic film directed by Joseph L. Mankiewicz. Adjusted for inflation, it is one of the most expensive films ever made, partly because production troubles. The film nearly bankrupted 20th Century Fox.",
	img1: "taylor.jpeg",
	img2: "cleopatra.jpg"
},

{
	answer: "Aqaba",
	question: "In Lawrence of Arabia, the British officer Lawrence was sent to the Middle East desert to start a revolt against Ottoman Empire during WW I. What is the first city he captured from the enemy?",
	choices: ["Medina", "Mecca", "Aqaba", "Riyadh"],
	comment: "Lawrence of Arabia is a 1962 epic historical drama film based on the life of T. E. Lawrence. The film stars Peter O'Toole in the title role. It is widely considered one of the greatest and most influential films in the history of cinema.",
	img1: "otoole.jpeg",
	img2: "lawrence.jpeg"
},

{
	answer: "Galapagos",
	question: "In Master and Commander, the British Captain Jack Aubrey pursued his enemy's ship to these islands, which are also rich with flora and fauna. What is the islands' name?",
	choices: ["Hawaii", "Galapagos", "Tahiti", "Fiji"],
	comment: "Master and Commander: The Far Side of the World is a 2003 American epic historical drama film. The film's plot and characters are adapted from three novels in author Patrick O'Brian's Aubrey–Maturin series. It was nominated for 10 Oscars.",
	img1: "galapagos.jpeg",
	img2: "master.jpeg"
},

{
	answer: "Mondoshawans",
	question: "In The Fifth Element, the leading female character Leeloo is an alien sent to save the Earth. What is the name of her alien race?",
	choices: ["Akritirian", "Plavalaguna", "Mangalores", "Mondoshawans"],
	comment: "The Fifth Element (French: Le Cinquième Élément) is a 1997 English-language French science fiction action film directed and co-written by Luc Besson. Besson started writing the story that became The Fifth Element when he was 16 years old; he was 38 when the film opened in cinemas.",
	img1: "leeloo.jpeg",
	img2: "fifth.jpeg"
},

{
	answer: "Nautilus",
	question: "In this Sci-Fi movie classic, it involves sea monsters, giant squids and a mysterious Captain Nemo. What's the name of his vessel?",
	choices: ["Poseidon", "Nautilus", "Oceanus", "Thetis"],
	comment: "20,000 Leagues Under the Sea is a 1954 American Technicolor adventure film and the first science fiction film shot in CinemaScope.  The film is adapted from Jules Verne's 19th-century novel Twenty Thousand Leagues Under the Sea. It is considered an early precursor of the steampunk genre",
	img1: "squid.jpeg",
	img2: "20000.jpeg"
},

{
	answer: "Edelweiss",
	question: "In The Sound of Music, Captain Georg von Trapp sings this song as a goodbye to his homeland, while using Austria's national flower as a symbol to declare his loyalty to the country. What is the song's name?",
	choices: ["The Lonely Goatherd", "Do-Re-Mi", "No Way to Stop It", "Edelweiss"],
	comment: "The Sound of Music is a 1965 American musical drama film, an adaptation of the 1959 Broadway musical The Sound of Music. In 2001, the United States Library of Congress selected the film for preservation in the National Film Registry, finding it \"culturally, historically, or aesthetically significant\".",
	img1: "trapps.jpeg",
	img2: "sound.jpeg"
},


{
	answer: "Apocalypse Now",
	question: "In this Vietnam War movie, the leading character, an US Army Captain, was sent to the jungle to terminate a lunatic US Colonel. What is title of the move?",
	choices: ["The Deer Hunter", "Platoon", "Apocalypse Now", "Full Metal Jacket"],
	comment: "Apocalypse Now is a 1979 American epic war adventure film set during the Vietnam War, produced and directed by Francis Ford Coppola. Apocalypse Now was released to universal acclaim and considered to be one of the greatest films ever made.",
	img1: "apocalypse1.jpeg",
	img2: "apocalypse.jpeg"
},


{
	answer: "Buffalo Bill",
	question: "In The Silence of the Lambs, what is the serial killer's nick name?",
	choices: ["The Cannibal", "Killer Clown", "Tennessee Jack the Ripper", "Buffalo Bill"],
	comment: "The Silence of the Lambs is a 1991 American psychological thriller film. It was only the third film to win Academy Awards in all the top five categories. It is also the first (and so far only) Best Picture winner widely considered to be a horror film, and only the third such film to be nominated in the category",
	img1: "lector.jpeg",
	img2: "silence.jpeg"
},

{
	answer: "1975",
	question: "In Good Will Hunting, Will is particularly struck by Sean's story of how he met his wife by giving up his ticket to the historic game six of this year's World Series. Which year of World Series Sean gave up?",
	choices: ["1974", "1975", "1976", "1977"],
	comment: "Good Will Hunting is a 1997 American drama film. Written by Affleck and Damon. It was nominated for nine Academy Awards and wond two.",
	img1: "will.jpeg",
	img2: "goodwill.jpg"
},

{
	answer: "Lyndon B. Johnson",
	question: "In Forrest Gump, Forrest Gump is awarded the Medal of Honor, presented to him by this President at the White House. What is the President's name?",
	choices: ["Richard Nixon", "Lyndon B. Johnson", "Gerald Ford", "John F. Kennedy"],
	comment: "Forrest Gump is a 1994 American comedy-drama film based on the 1986 novel of the same name by Winston Groom. The film became a commercial success and won 6 Academy Awards.",
	img1: "forrest-lbj.jpg",
	img2: "gump.jpeg"
},


{
	answer: "Unicorn",
	question: "In Blade Runner, officer Gaff likes to make tin-foil origami animals. Deckard recieved one at the end of the movie. What kind of origami animal is that?",
	choices: ["Unicorn", "Crane", "Goose", "Horse"],
	comment: "Blade Runner is a 1982 American science fiction tech-noir film. Blade Runner initially polarized critics: some were displeased with the pacing, while others enjoyed its thematic complexity.",
	img1: "harrisonford.jpeg",
	img2: "bladerunner.jpeg"
},

{
	answer: "Cisco",
	question: "In Dances with Wolves, First Lieutenant Dunbar has a very fast and smart horse. It saves him from the enemy fire and escapes from being captured by Sioux kids by itself. What is the name of the horse?",
	choices: ["Cisco", "Tatanka", "Lightning", "Lakota"],
	comment: "Dances with Wolves is a 1990 American epic Western film directed by, produced by, and starring Kevin Costner. It won seven Academy Awards including Best Picture. The film is credited as a leading influence for the revitalization of the Western genre of filmmaking in Hollywood.",
	img1: "dunbar.jpeg",
	img2: "wolves.jpeg"
},

{
	answer: "Gene Hackman",
	question: "In the Western movie Unforgiven, who plays the role of the ruthless local sheriff Little Bill?",
	choices: ["Clint Eastwood", "Gene Hackman", "Morgan Freeman", "Richard Harris"],
	comment: "Unforgiven is a 1992 dark Western that deals frankly with the uglier aspects of violence and how complicated truths are distorted into simplistic myths about the Old West, it stars and directed by Clint Eastwood. Eastwood dedicated the movie to deceased directors and mentors Don Siegel and Sergio Leone. The film won four Academy Awards.",
	img1: "littlebill.jpeg",
	img2: "unforgiven.jpeg"
},

{
	answer: "Unknown",
	question: "In The Good, the Bad and the Ugly, three leading characters pursue the stolen cache of Confederate Gold buried under a grave. What is the name on that grave?",
	choices: ["Arch Stanton", "Angel Eyes", "Unknown", "Bill Carson"],
	comment: "The Good, the Bad and the Ugly is a 1966 Italian epic Spaghetti Western film directed by Sergio Leone known for his use of long shots and close-up cinematography, and his distinctive use of violence, tension, and stylistic gunfights. It is now seen as a highly influential example of the Western film genre and one of the greatest films of all time.",
	img1: "eastwood.jpeg",
	img2: "goodbadugly.jpg"
}

];
