////////////////////////////////////////////////////////////////////////////////
//                                   GENERAL                                  //
////////////////////////////////////////////////////////////////////////////////

// get elements that need to be targeted repeatedly
let grid = document.getElementById("grid-logo"); // lives within homepage div
let homepageInfo = document.getElementById("homepage-info"); // lives within homepage div
let projectFeed = document.getElementById("project-feed");

// get viewport width and height
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

// boolean for whether or not load animation is done
let isLoaded = false;

// boolean for whether or not we're in project view and scroll animation is done
let inProjectView = false;

// cubic functions for easing, take in and output a value from 0 to 1
function easeInCubic(x) {
	return x*x*x;
}
function easeOutCubic(x) {
	return 1 - Math.pow(1 - x, 3);
}
function easeInOutCubic(x) {
	return x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3)/2;
}

// resize event listener to update viewport width+height and grid
window.onresize = function() {
	// update viewport width and height
	vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

	// resize grid based on where we are in user flow, since SVG grid won't scale dynamically
	if (!isLoaded) {
		if (vw > 900) {
			// desktop
			grid.style.height = (3.5*vw) + "px";
			grid.style.top = (3.5*vw/-2 + vh/2) + "px";
			grid.style.left = "0px";
			grid.style.strokeWidth = "1px";
		} else {
			// tablet and mobile
			grid.style.height = (3.5*vw*38/32) + "px";
			grid.style.top = (3.5*vw*38/32/-2 + vh/2) + "px";
			grid.style.left = ((vw*38/32)/-2 + vw/2) + "px";
			grid.style.strokeWidth = "1px";
		}
	} else if (isLoaded && !inProjectView) {
		if (vw > 900) {
			// desktop
			grid.style.height = (3.5*vw*38/8) + "px";
			grid.style.top = (3.5*vw*38/8/-2 + vh/2) + "px";
			grid.style.left = ((vw*38/8)/-2 + vw/2) + "px";
			grid.style.strokeWidth = "2px";
		} else {
			// tablet and mobile
			grid.style.height = (3.5*vw*38/32) + "px";
			grid.style.top = (3.5*vw*38/32/-2 + 2.5*1/32*vw) + "px";
			grid.style.left = ((vw*38/32)/-2 + vw/2) + "px";
			grid.style.strokeWidth = "1px";
		}
	} else {
		if (vw > 900) {
			// desktop
			grid.style.height = (3.5*vw*38/6) + "px";
			grid.style.top = (3.5*vw*38/6/-2 + 1.5*1/6*vw) + "px";
			grid.style.left = ((vw*38/6)/-2 + vw/2) + "px";
			grid.style.strokeWidth = "2px";
		} else if (vw > 600) {
			// tablet
			grid.style.height = (3.5*vw*38/4) + "px";
			grid.style.top = (3.5*vw*38/4/-2 + 1.5*1/4*vw) + "px";
			grid.style.left = ((vw*38/4)/-2 + vw/2) + "px";
			grid.style.strokeWidth = "2px";
		} else {
			// mobile
			grid.style.height = (3.5*vw*38/2) + "px";
			grid.style.top = (3.5*vw*38/2/-2 + 1.5*1/2*vw) + "px";
			grid.style.left = ((vw*38/2)/-2 + vw/2) + "px";
			grid.style.strokeWidth = "2px";
		}
	}
};

document.addEventListener("DOMContentLoaded", () => {
	percentLoad(); // runs preloader percent animation
	animateLogo(); // runs SHO logo animation during preloader
	displayTime(); // runs current time display in homepage info
	window.scrollTo(0,0); // moves scroll position to top for smooth initial scroll animation
});

////////////////////////////////////////////////////////////////////////////////
//                              OPENING ANIMATION                             //
////////////////////////////////////////////////////////////////////////////////

function percentLoad() {
	// get all the percentage HTML elements
	var percentages = document.getElementsByClassName("percentage"),
		fps = 60;
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
			var preloader = document.getElementById("preloader");
			preloader.style.opacity = "0";
			preloader.style.filter = "blur(4px)";
			isLoaded = true;
			clearInterval(handler);
		}
	}, 1800/fps); // runs every 30ms for total of 3s animation
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
			animateGrid();
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
	var fps = 60,
		duration = 2, // seconds
		frame = 0,
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
			//make homepage info children visible
			var homeChildren = homepageInfo.querySelectorAll('div');
			for (var i = 0; i < homeChildren.length; i++) {
				homeChildren[i].style.opacity = "1";
				homeChildren[i].style.filter = "blur(0px)";
			}
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

window.addEventListener("scroll", () => {
	scrollAnimation();
});

// boolean for whether or not scroll animation has happened before
let firstTime = true;

// boolean for which direction user is scrolling, true is down
let scrollDirection = true;

// value for storing last scroll val, for scrollDirection to work
let lastScrollVal = 0;

// function to blend two hex code colors by an amount from 0 to 1
// used to gradually darken grid
function blendColors(colorA, colorB, amount) {
	const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
	const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
	const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
	const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
	const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
	return '#' + r + g + b;
}

function scrollAnimation() {
	// pageYOffset goes from 0 to full document height minus viewport height
	// sets the scroll value to a decimal between 0 and 1, with 1 being full scroll
	var scrollVal = window.pageYOffset / (document.body.offsetHeight - vh);

	// store scroll direction
	if (scrollVal >= lastScrollVal) {
		scrollDirection = true; // scrolling down
	} else {
		scrollDirection = false; // scrolling up
	}
	lastScrollVal = scrollVal <= 0 ? 0 : scrollVal;

	// only run if preloader animation is done
	if (isLoaded) {
		var gridLines = document.getElementsByClassName("grid-line"),
			logoLines = document.getElementsByClassName("logo-line"),
			deskStartHeight = 3.5*vw*38/8, // zoomed so 8 of 38 columns in view
			deskEndHeight = 3.5*vw*38/6, // zoomed so 6 of 38 columns in view
			tabStartHeight = 3.5*vw*38/32, // zoomed so 32 of 38 columns in view
			tabEndHeight = 3.5*vw*38/4, // zoomed so 4 of 38 columns in view
			mobStartHeight = tabStartHeight,
			mobEndHeight = 3.5*vw*38/2, // zoomed so 2 of 38 columns in view
			deskStartTop = deskStartHeight/-2 + vh/2, // center grid
			deskEndTop = deskEndHeight/-2 + 1.5*1/6*vw, // center grid to top of view, then down 1.5 squares
			tabStartTop = tabStartHeight/-2 + 2.5*1/32*vw, //center grid to top of view, then down 2.5 squares (for one grid padding at top)
			tabEndTop = tabEndHeight/-2 + 1.5*1/4*vw, // center grid to top of view, then down 1.5 squares
			mobStartTop = tabStartTop,
			mobEndTop = mobEndHeight/-2 + 1.5*1/2*vw, // center grid to top of view, then down 1.5 squares
			deskStartLeft = (vw*38/8)/-2 + vw/2, // center grid
			deskEndLeft = (vw*38/6)/-2 + vw/2,
			tabStartLeft = (vw*38/32)/-2 + vw/2,
			tabEndLeft = (vw*38/4)/-2 + vw/2,
			mobStartLeft = tabStartLeft,
			mobEndLeft = (vw*38/2)/-2 + vw/2,
			startColor = getComputedStyle(gridLines[0]).getPropertyValue("--light-grid"),
			endColor = getComputedStyle(logoLines[0]).getPropertyValue("--dark-grid");
		
		// set scroll position to 0 so initial animation is smooth
		if (firstTime) {
			// move scroll to the very top while doc is not fully loaded
			window.scrollTo(0,0);
			firstTime = false;
		}

		// control homepage info appear and disappearing
		// if user started to scroll down
		if (scrollVal > 0 && scrollDirection) {
			// make homepage info children disappear
			var homeChildren = homepageInfo.querySelectorAll('div');
			for (var i = 0; i < homeChildren.length; i++) {
				homeChildren[i].style.opacity = "0";
				homeChildren[i].style.filter = "blur(4px)";
			}
		}
		// if user is about to scroll back up to the very top
		else if (scrollVal < 0.2 && !scrollDirection) {
			// bring homepage info back
			var homeChildren = homepageInfo.querySelectorAll('div');
			for (var i = 0; i < homeChildren.length; i++) {
				homeChildren[i].style.opacity = "1";
				homeChildren[i].style.filter = "blur(0px)";
			}
		}

		// control grid zooming in/out between 0% and 80% scroll
		// desktop animation
		if (vw > 900) {
			grid.style.height = (deskStartHeight + ((deskEndHeight - deskStartHeight) * Math.min(1, scrollVal/.8))) + "px";
			grid.style.top = (deskStartTop + ((deskEndTop - deskStartTop) * Math.min(1, scrollVal/.8))) + "px";
			grid.style.left = (deskStartLeft + ((deskEndLeft - deskStartLeft) * Math.min(1, scrollVal/.8))) + "px";			
		}	
		// tablet animation	
		else if (vw > 600) {
			grid.style.strokeWidth = "" + (1 + scrollVal); // increase stroke width to 2 gradually
			grid.style.height = (tabStartHeight + ((tabEndHeight - tabStartHeight) * Math.min(1, scrollVal/.8))) + "px";
			grid.style.top = (tabStartTop + ((tabEndTop - tabStartTop) * Math.min(1, scrollVal/.8))) + "px";
			grid.style.left = (tabStartLeft + ((tabEndLeft - tabStartLeft) * Math.min(1, scrollVal/.8))) + "px";
		}
		// mobile animation
		else {
			grid.style.strokeWidth = "" + (1 + scrollVal); // increase stroke width to 2 gradually
			grid.style.height = (mobStartHeight + ((mobEndHeight - mobStartHeight) * Math.min(1, scrollVal/.8))) + "px";
			grid.style.top = (mobStartTop + ((mobEndTop - mobStartTop) * Math.min(1, scrollVal/.8))) + "px";
			grid.style.left = (mobStartLeft + ((mobEndLeft - mobStartLeft) * Math.min(1, scrollVal/.8))) + "px";
		}

		// control project feed and grid fading in/out between 80% and 100% scroll
		projectFeed.style.opacity = Math.max(0, (scrollVal - .8)*5);
		grid.style.opacity = Math.min(1, (scrollVal - 1)*-5);

		// control fully entering project feed at 100% scroll
		if (scrollVal < 1) {
			projectFeed.style.overflow = "hidden";
			inProjectView = false;
			var projChildren = projectFeed.querySelectorAll('span');
			for (var i = 0; i < projChildren.length; i++) {
				projChildren[i].style.opacity = "0";
				projChildren[i].style.filter = "blur(4px)";
			}
		} else {
			projectFeed.style.overflow = "scroll";
			inProjectView = true;
			var projChildren = projectFeed.querySelectorAll('span');
			for (var i = 0; i < projChildren.length; i++) {
				projChildren[i].style.opacity = "1";
				projChildren[i].style.filter = "blur(0px)";
			}
		}
		
		// change grid stroke color to fully dark
		// for (var i = 0; i < gridLines.length; i++) {
		//    gridLines[i].style.stroke = blendColors(startColor, endColor, scrollVal);
		// }
	} else {
		// make sure page is at very top while preloader runs
		window.scrollTo(0,0);
	}
}


