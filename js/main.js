////////////////////////////////////////////////////////////////////////////////
//                                   GENERAL                                  //
////////////////////////////////////////////////////////////////////////////////

// get viewport width and height
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

// boolean for whether or not page is fully loaded
let isLoaded = false;

// cubic ease-in function, takes in and outputs a value from 0 to 1
function easeInCubic(x) {
	return x*x*x;
}

// cubic ease-out function, takes in and outputs a value from 0 to 1
function easeOutCubic(x) {
	return 1 - Math.pow(1 - x, 3);
}

// cubic ease-in-out function, takes in and outputs a value from 0 to 1
function easeInOutCubic(x) {
	return x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3)/2;
}

// resize event listener to update viewport width and height
window.onresize = function() {
	// update viewport width and height
	vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
};

document.addEventListener("DOMContentLoaded", () => {
	percentLoad();
	animateLogo();
	animateGrid();
	displayTime();
	window.scrollTo(0,0);
});

////////////////////////////////////////////////////////////////////////////////
//                              OPENING ANIMATION                             //
////////////////////////////////////////////////////////////////////////////////

function percentLoad() {
	// get all the percentage HTML elements
	var percentages = document.getElementsByClassName("percentage"),
		fps = 25;
		endCount = 100,
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
		if (count > endCount) {
			document.getElementById("preloader").style.opacity = "0";
			isLoaded = true;
			clearInterval(handler);
		}
	}, 1100/fps);
}

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
		totalFrames = duration * fps,
		endTranslate = 8; // pixels
	var handler = setInterval(function() {
		// stop animating once 3rd set of lines has finished animating
		if (frame3 > totalFrames) {
			clearInterval(handler);
		}
		// first set of lines animates in by masks moving
		if (frame1 <= totalFrames) {
			vtMask1.style.transform = "translateY(" + (endTranslate * frame1 / totalFrames) + "px)";
			vtMask3.style.transform = "translateY(" + (endTranslate * frame1 / totalFrames) + "px)";
			//reverse direction for some lines
			vtMask2.style.transform = "translateY(" + (endTranslate * frame1 / totalFrames * -1) + "px)";
			vtMask4.style.transform = "translateY(" + (endTranslate * frame1 / totalFrames * -1) + "px)";
			frame1++;
		}
		// second set of lines animates in by masks moving
		if (frame2 <= totalFrames && frame1 > (duration * 0.75) * fps) {
			hzMask3.style.transform = "translateX(" + (endTranslate * frame2 / totalFrames) + "px)";
			hzMask4.style.transform = "translateX(" + (endTranslate * frame2 / totalFrames) + "px)";
			//reverse direction for some lines
			hzMask1.style.transform = "translateX(" + (endTranslate * frame2 / totalFrames * -1) + "px)";
			hzMask2.style.transform = "translateX(" + (endTranslate * frame2 / totalFrames * -1) + "px)";
			frame2++;
		}
		// third set of lines animates in by masks moving
		if (frame3 <= totalFrames && frame2 > (duration * 0.3) * fps) {
			vtMask5.style.transform = "translateY(" + (endTranslate * frame3 / totalFrames) + "px)";
			vtMask7.style.transform = "translateY(" + (endTranslate * frame3 / totalFrames) + "px)";
			hzMask6.style.transform = "translateX(" + (endTranslate * frame3 / totalFrames) + "px)";
			//reverse direction for some lines
			vtMask6.style.transform = "translateY(" + (endTranslate * frame3 / totalFrames * -1) + "px)";
			hzMask5.style.transform = "translateX(" + (endTranslate * frame3 / totalFrames * -1) + "px)";
			frame3++;
		}
	}, 1000/fps);
}

function animateGrid() {
	var grid = document.getElementById("grid-logo"),
		fps = 60,
		duration = 2, // seconds
		delay = 4, // seconds
		frame = -1*delay*fps, // start frame count at negative value for delay
		totalFrames = duration*fps,
		deskStartHeight = 3.5*vw, // grid has 38 columns and is 3.5x longer than it is wide, start with all 38 columns in view
		deskEndHeight = 3.5*vw*38/8, // zoomed so only 8 columns are in vew
		deskStartTop = deskStartHeight/-2 + vh/2, // for grid to be centered, top must be negative half of grid height (3.5x of width) + half of view
		deskEndTop = deskEndHeight/-2 + vh/2,
		deskStartLeft = 0,
		deskEndLeft = (vw*38/8)/-2 + vw/2, // for grid to be centered, left must be negative half of grid width (38/8x of width) + half of view
		mobHeight = 3.5*vw*38/32 // zoomed so 32 of 38 columns in view
		mobStartTop = mobHeight/-2 + vh/2,
		mobEndTop = mobHeight/-2 + 2.5*1/32*vw; // each square is 1/32 vw, need to move grid up half vh then down 2.5 squares
	var handler = setInterval(function() {
		if (frame > totalFrames) {
			//make homepage info visible
			document.getElementById("homepage-info").style.opacity = "1";
			//stop animation
			clearInterval(handler);
		} else if (frame >= 0) {
			// desktop animation
			if (vw > 900) {
				grid.style.strokeWidth = "" + (1 + frame / totalFrames);
				grid.style.height = (deskStartHeight + ((deskEndHeight - deskStartHeight) * easeInOutCubic(frame / totalFrames))) + "px";
				grid.style.top = (deskStartTop + ((deskEndTop - deskStartTop) * easeInOutCubic(frame / totalFrames))) + "px";
				grid.style.left = (deskStartLeft + ((deskEndLeft - deskStartLeft) * easeInOutCubic(frame / totalFrames))) + "px";
			}
			// tablet and mobile animation
			else {
				grid.style.top = (mobStartTop + ((mobEndTop - mobStartTop) * easeInOutCubic(frame / totalFrames))) + "px";
			}
		}
		frame++
	}, 1000/fps);
}

////////////////////////////////////////////////////////////////////////////////
//                                HOMEPAGE INFO                               //
////////////////////////////////////////////////////////////////////////////////

function displayTime() {
	var now, dateOnly, timeOnly;
	var handler = setInterval(function() {
		// get current date and time
		now = new Date();
		const options = {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric"
		};
		dateOnly = now.toLocaleDateString(undefined, options);
		timeOnly = now.toLocaleTimeString();

		// insert date and time into HTML, update every second
		document.getElementById("date-time").innerHTML = dateOnly + ", " + timeOnly;
	}, 1000);
}

////////////////////////////////////////////////////////////////////////////////
//                              SCROLL TO PROJECTS                            //
////////////////////////////////////////////////////////////////////////////////

// boolean for whether or not scroll animation has happened before
let firstTime = true;

function projectView() {
	// pageYOffset goes from 0 to full document height minus viewport height
	// this sets the scroll value to a decimal between 0 and 1, with 1 being full scroll
	var scrollVal = window.pageYOffset / (document.body.offsetHeight - vh),
		grid = document.getElementById("grid-logo"),
		deskStartHeight = 3.5*vw*38/8, // zoomed so 8 of 38 columns in view
		deskEndHeight = 3.5*vw*38/6, // zoomed so 6 of 38 columns in view
		tabStartHeight = 3.5*vw*38/32, // zoomed so 32 of 38 columns in view
		tabEndHeight = 3.5*vw*38/4, // zoomed so 4 of 38 columns in view
		mobStartHeight = tabStartHeight,
		mobEndHeight = 3.5*vw*38/2, // zoomed so 2 of 38 columns in view
		deskStartTop = deskStartHeight/-2 + vh/2, // center grid
		deskEndTop = deskEndHeight/-2 + 1.5*1/6*vw, // center grid to top of view, then down 1.5 squares
		tabStartTop = tabStartHeight/-2 + 2.5*1/32*vw,
		tabEndTop = tabEndHeight/-2 + 1.5*1/4*vw,
		mobStartTop = tabStartTop,
		mobEndTop = mobEndHeight/-2 + 1.5*1/2*vw,
		deskStartLeft = (vw*38/8)/-2 + vw/2, // for grid to be centered, left must be negative half of grid width (38/8x of width) + half of view
		deskEndLeft = (vw*38/6)/-2 + vw/2,
		tabStartLeft = (vw*38/32)/-2 + vw/2,
		tabEndLeft = (vw*38/4)/-2 + vw/2,
		mobStartLeft = tabStartLeft,
		mobEndLeft = (vw*38/2)/-2 + vw/2;
	if (isLoaded) {
		if (firstTime) {
			// move scroll to the very top while doc is not fully loaded
			window.scrollTo(0,0);
			firstTime = false;
		}
		// desktop animation
		if (vw > 900) {
			grid.style.height = (deskStartHeight + ((deskEndHeight - deskStartHeight) * scrollVal)) + "px";
			grid.style.top = (deskStartTop + ((deskEndTop - deskStartTop) * scrollVal)) + "px";
			grid.style.left = (deskStartLeft + ((deskEndLeft - deskStartLeft) * scrollVal)) + "px";
		}	
		// tablet animation	
		else if (vw > 600) {
			grid.style.strokeWidth = "" + (1 + scrollVal);
			grid.style.height = (tabStartHeight + ((tabEndHeight - tabStartHeight) * scrollVal)) + "px";
			grid.style.top = (tabStartTop + ((tabEndTop - tabStartTop) * scrollVal)) + "px";
			grid.style.left = (tabStartLeft + ((tabEndLeft - tabStartLeft) * scrollVal)) + "px";
		}
		// mobile animation
		else {
			grid.style.strokeWidth = "" + (1 + scrollVal);
			grid.style.height = (mobStartHeight + ((mobEndHeight - mobStartHeight) * scrollVal)) + "px";
			grid.style.top = (mobStartTop + ((mobEndTop - mobStartTop) * scrollVal)) + "px";
			grid.style.left = (mobStartLeft + ((mobEndLeft - mobStartLeft) * scrollVal)) + "px";
		}
	} else {
		// move scroll to the very top while doc is not fully loaded
		window.scrollTo(0,0);
	}
}

window.addEventListener("scroll", () => {
	projectView();
});


