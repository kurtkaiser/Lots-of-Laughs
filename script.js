"use strict"

// Arrays of names and background colors
let names = ['Matias', 'Liz', 'Becky', 'Bryukh', 'Run', 'Shasha'];
let colors = ['#5F5ECC', '#5ECC5F', '#F4B85B', '#06C5D2', '#b5aab5', '#5B97F4', '#CC5F5E', '#F45bb0'];

// Random number used for name/picture assignment
let rnd1 = Math.floor(Math.random() * 6);
let rnd2 = Math.floor(Math.random() * 6);
while(rnd2 == rnd1) rnd2 = Math.floor(Math.random() * 6);

// Variables for the fake/AKA names from jsonplaceholder
let akaName1 = '';
let akaName2 = '';
let akaRnd1 = -1;
let akaRnd2 = -1;

// Used by Vue app to access student names
function getName(num){ 
	return names[num];
}

// Used to randomize new names and images
function getNewRnd(rnd, otherRnd){
	let newRnd = Math.floor(Math.random() * 6);
	while(newRnd == otherRnd || newRnd == rnd) 
		newRnd = Math.floor(Math.random() * 6);
	return newRnd;
}

// Used for color background color randomization
function getColor(){
	if(colors.length < 1) colors = 
	['#5F5ECC', '#5ECC5F', '#F4B85B', '#06C5D2', '#b5aab5', '#5B97F4', '#CC5F5E', '#F45bb0'];
	return colors.sort(function() { return 0.5 - Math.random();}).pop();
}

// Outputs an HTML tag using the person's name
function getImgTag(name) {
	var out = `<img src="Avatars/` + name + `.png">`;
	return out;
}

// Requests aka/fake name for student one
function getFirstAKA(num){
	akaRnd1 = num;
	fetch('https://jsonplaceholder.typicode.com/users')
	.then(response => response.json())
	.then(data => akaName1 = data[num].name)
	.then(() => outputgetFirstAKA())
}

// Requests aka/fake name for student two
function getSecondAKA(num){
	akaRnd2 = num;
	fetch('https://jsonplaceholder.typicode.com/users')
	.then(response => response.json())
	.then(data => akaName2 = data[num].name)
	.then(() => outputgetSecondAKA())
}

// Updates student 1 aka name displayed on the DOM
function outputgetFirstAKA(){
	document.getElementById("player1").value = akaName1;
}

// Updates student 2 aka name displayed on the DOM
function outputgetSecondAKA(){
	document.getElementById("player2").value = akaName2;
}

// Returns student 1 aka name, used by Vue app
function returnAKA1(){
	return akaName1;
}

// Returns student 2 aka name, used by Vue app
function returnAKA2(){
	return akaName2;
}

// Returns student 1 random number, used by Vue app
function returnRnd1(){
	return akaRnd1;
}

// Returns student 2 random number, used by Vue app
function returnRnd2(){
	return akaRnd2;
}

// Run onload, gets background colors and names for both students
function startAKA(){
	akaRnd1 = Math.floor(Math.random() * 10);
	akaRnd2 = Math.floor(Math.random() * 10);
	while(akaRnd1 == akaRnd2) akaRnd2 = Math.floor(Math.random() * 10);
	getFirstAKA(akaRnd1);
	getSecondAKA(akaRnd2);
}

// Used to make top row student tiles
Vue.component("tile", {
	props: ["active", "tile", "effect"],
	template: `
		<div class="grid-item">
			<div :style="effect(tile)" class="grid-cell-top"  >
				<span
					v-html="tile.picture"
					:class="{ bounce: tile == active }"
				></span>
			</div>
			<div class="grid-cell-bottom" :style="{color: tile.color}">
			<span v-html="tile.name"></span>
			</div>
		</div>`
})

var app = new Vue({
	el: "#app",
	data: {
        image: { url: "http://www.amstareuropet.com/loading-dog.gif"},
        showDog: false,
		active: "",
		students: [
			{one: { 
				name:  getName(rnd1), 
				inputName: '',
				defaultFake: returnAKA1(),
				hp: Math.floor(Math.random() * -250) + 1,
				dps: Math.floor(Math.random() * 25)+1,
				picture: getImgTag(getName(rnd1)), 
				boxId: 'student1',
				color: getColor(),
			}},
			{two: { 
				name:  getName(rnd2), 
				inputName: '',
				defaultFake: returnAKA2(),
				hp: Math.floor(Math.random() * -250) + 1,
				dps: Math.floor(Math.random() * 25)+1,
				picture: getImgTag(getName(rnd2)), 
				color: getColor(),
				boxId: 'student2',
			}},
			{three: { 
				color: getColor(), 
			}},
		],
	},
	methods: {
		activate: function (tile) {
			this.active = tile
		},
		// Create a gradient for the tiles
		gradient: function (tile) {
			return {
				background: "linear-gradient(100deg, #dcdcdc -100%," + tile.color + ")",
			}
		},
		// Use to set font center font color to be the same as the winners background
		fontColor: function (tile) {
			return {
				color: tile.color
			}
		},
		// User clicks computer, compare, output winner info
		compete: function () {
			this.showDog = true;
			this.loadNextImage();
			this.updateNames();
			let winner = this.students[0].one;
			let sec1 = Math.abs(this.students[0].one.hp / this.students[0].one.dps);
			let sec2 = Math.abs(this.students[1].two.hp / this.students[1].two.dps);
			if(sec2 < sec1) winner = this.students[1].two;
			//if(winner.inputName == '') winner.fakeName = winner.defaultFake;
			this.flash(document.getElementById(winner.boxId));
			let begin = winner.name == "Matias" ? "-Hello Matias!!-" : "Lots of Laughter";
			document.getElementById("winnerBox").innerHTML = 
			"<div id='textbox' style='color: " + winner.color + ";'>"+
			"<p style='font-size: 2rem;'>" + begin + "</p><br>" +
			 this.students[0].one.name + ": " + Math.round(sec1* 10) / 10 + " seconds <br>" + 
			 this.students[1].two.name + ": " + Math.round(sec2* 10) / 10 + " seconds <br><br>" +
			 "WINNNER<br>" + winner.name +"<span style='font-size: 1.02rem;'><br>AKA<br>"+ winner.defaultFake +"</span></div>";
		},
		// Randomize all parts of student1
		randomize1: function(){
			rnd1 = getNewRnd(rnd1, rnd2);
			this.students[0].one.name = getName(rnd1),
			this.students[0].one.picture = getImgTag(getName(rnd1)),
			this.updateNames();
			let rnd = Math.floor(Math.random() * 10);
			while(rnd == returnRnd1() || rnd == returnRnd2()) rnd = Math.floor(Math.random() * 10);
			getFirstAKA(rnd);
			this.students[0].one.hp = Math.floor(Math.random() * -250) - 1 ;
			this.students[0].one.dps = Math.floor(Math.random() * 25) + 1;
			let newColor = getColor();
			while( newColor == this.students[1].two.color || newColor == this.students[0].one.color || 
				newColor == this.students[2].three.color) newColor = getColor();
				this.students[0].one.color = newColor;
			this.students[0].one.inputName = '';
		},
		// Randomize all parts of student2
		randomize2: function(){
			rnd2 = getNewRnd(rnd2, rnd1);
			this.students[1].two.name = getName(rnd2),
			this.students[1].two.picture = getImgTag(getName(rnd2)),
			this.updateNames();
			let rnd = Math.floor(Math.random() * 10);
			while(rnd == returnRnd1() || rnd == returnRnd2()) rnd = Math.floor(Math.random() * 10);
			getSecondAKA(rnd);
			this.students[1].two.hp = Math.floor(Math.random() * -250) - 1;
			this.students[1].two.dps= Math.floor(Math.random() * 25) + 1;
			let newColor = getColor();
			while( newColor == this.students[1].two.color || newColor == this.students[0].one.color || 
				newColor == this.students[2].three.color) newColor = getColor();
			this.students[1].two.color = newColor;
			this.students[1].two.inputName = '';
		},
		// Updates student name variables each time changes are needed
		updateNames: function(){
			if(this.students[0].one.inputName == '') {
				this.students[0].one.defaultFake = returnAKA1();
				this.students[0].one.inputName = returnAKA1();
			} else {
				this.students[0].one.defaultFake = this.students[0].one.inputName;
			}
			if(this.students[1].two.inputName == ''){
				this.students[1].two.defaultFake = returnAKA2();
				this.students[1].two.inputName = returnAKA2();
			}
			else {
				this.students[1].two.defaultFake = this.students[1].two.inputName;
			}
		},
		// Used to load the cat and dog images
		async loadNextImage()
		{
			// Okay, so a bit of dog favoritism going on
			let catDog1998 = Math.random() < 0.4 ? 'thecatapi' : 'thedogapi';
			try{
				axios.defaults.headers.common['x-api-key'] = "a08cf223-a755-459f-bd1b-52bfa84b524b" 
				let response = await axios.get('https://api.' + catDog1998 + '.com/v1/images/search', 
				{ params: { limit:1, size:"full" } } ) 
				this.image = response.data[0] 
			}catch(err){
				console.log("catDog api: " + err);
			}
		},
		// Hightlights the winners name with the center tile background color
		flash: function(element) {
			element.style.background = this.students[2].three.color;
			setTimeout(()=>{ element.style.background = 'white'; } ,500)}
		}
})



