////////////////////////////////////////////////////////////////////////////////
//                                   GENERAL                                  //
////////////////////////////////////////////////////////////////////////////////

// get viewport width and height
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

// cubic ease-in function, takes in and outputs a value from 0 to 1
function easeInCubic(x) {
	return x * x * x;
}

// cubic ease-out function, takes in and outputs a value from 0 to 1
function easeOutCubic(x) {
	return 1 - Math.pow(1 - x, 3);
}

// cubic ease-in-out function, takes in and outputs a value from 0 to 1
function easeInOutCubic(x) {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}


////////////////////////////////////////////////////////////////////////////////
//                                  PRELOADER                                 //
////////////////////////////////////////////////////////////////////////////////

function animateLogo() {
	var vtMask1 = document.getElementById("vt-mask1"),
		vtMask2 = document.getElementById("vt-mask2"),
		vtMask3 = document.getElementById("vt-mask3"),
		vtMask4 = document.getElementById("vt-mask4"),
		vtMask5 = document.getElementById("vt-mask5"),
		vtMask6 = document.getElementById("vt-mask6"),
		vtMask7 = document.getElementById("vt-mask7"),
		hzMask1 = document.getElementById("hz-mask1"),
		hzMask2 = document.getElementById("hz-mask2"),
		hzMask3 = document.getElementById("hz-mask3"),
		hzMask4 = document.getElementById("hz-mask4"),
		hzMask5 = document.getElementById("hz-mask5"),
		hzMask6 = document.getElementById("hz-mask6"),
		fps = 60,
		frame1 = 0,
		frame2 = 0,
		frame3 = 0,
		duration = 2, // seconds
		finish = 8; // pixels
	var handler = setInterval(function() {
		// stop animating once 3rd set of lines has finished animating
		if (frame3 == duration * fps) {
			clearInterval(handler);
		}
		// first set of lines animates in by masks moving
		if (frame1 < duration * fps) {
			vtMask1.style.transform = "translateY(" + (finish * (frame1 / (duration * fps))) + "px)";
			vtMask3.style.transform = "translateY(" + (finish * (frame1 / (duration * fps))) + "px)";
			//reverse direction for some lines
			vtMask2.style.transform = "translateY(" + (finish * (frame1 / (duration * fps)) * -1) + "px)";
			vtMask4.style.transform = "translateY(" + (finish * (frame1 / (duration * fps)) * -1) + "px)";
			frame1++;
		}
		// second set of lines animates in by masks moving
		if (frame2 < duration * fps && frame1 > (duration * 0.75) * fps) {
			hzMask3.style.transform = "translateX(" + (finish * (frame2 / (duration * fps))) + "px)";
			hzMask4.style.transform = "translateX(" + (finish * (frame2 / (duration * fps))) + "px)";
			//reverse direction for some lines
			hzMask1.style.transform = "translateX(" + (finish * (frame2 / (duration * fps)) * -1) + "px)";
			hzMask2.style.transform = "translateX(" + (finish * (frame2 / (duration * fps)) * -1) + "px)";
			frame2++;
		}
		// third set of lines animates in by masks moving
		if (frame3 < duration * fps && frame2 > (duration * 0.3) * fps) {
			vtMask5.style.transform = "translateY(" + (finish * (frame3 / (duration * fps))) + "px)";
			vtMask7.style.transform = "translateY(" + (finish * (frame3 / (duration * fps))) + "px)";
			hzMask6.style.transform = "translateX(" + (finish * (frame3 / (duration * fps))) + "px)";
			//reverse direction for some lines
			vtMask6.style.transform = "translateY(" + (finish * (frame3 / (duration * fps)) * -1) + "px)";
			hzMask5.style.transform = "translateX(" + (finish * (frame3 / (duration * fps)) * -1) + "px)";
			frame3++;
		}
	}, 1000/fps);
}

function percentLoad() {
	// get all the percentage HTML elements
	var percentages = document.getElementsByClassName("percentage"),
		fps = 25;
		targetCount = 100,
		count = 0;

	var handler = setInterval(function() {
		for (var i = 0; i < percentages.length; i++) {
			var percentage = percentages[i];
			if (count < 10) {
				percentage.innerHTML = "0" + count;
			} else {
				percentage.innerHTML = count;
			}
		}
		count++;
		if (count > targetCount) {
			document.getElementById("preloader").style.opacity = "0";
			clearInterval(handler);
		}
	}, 1000/fps);
}

document.addEventListener("DOMContentLoaded", animateLogo());
document.addEventListener("DOMContentLoaded", percentLoad());

////////////////////////////////////////////////////////////////////////////////
//                                HOMEPAGE INFO                               //
////////////////////////////////////////////////////////////////////////////////

function displayTime() {
	// get current date and time
	var now = new Date();
	const options = {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric"
	};
	var dateOnly = now.toLocaleDateString(undefined, options);
	var timeOnly = now.toLocaleTimeString();

	//insert date and time into HTML
	document.getElementById("date-time").innerHTML = dateOnly + ", " + timeOnly;
}

setInterval(displayTime, 1000); // update every second


////////////////////////////////////////////////////////////////////////////////
//                      WINDOW/DOCUMENT EVENT LISTENERS                       //
////////////////////////////////////////////////////////////////////////////////


window.addEventListener("scroll", function() {
	//pageYOffset goes from 0 to full document height minus viewport height
	//this sets the scroll variable to a decimal between 0 and 1, with 1 being full scroll
	document.body.style.setProperty("--scroll", window.pageYOffset / (document.body.offsetHeight - vh));
}, false);

