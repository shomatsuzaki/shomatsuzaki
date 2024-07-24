////////////////////////////////////////////////////////////////////////////////
//                                   GENERAL                                  //
////////////////////////////////////////////////////////////////////////////////

// get all color values of CSS variables
const root = document.documentElement; // select the root element (:root)
const transparent = getComputedStyle(root).getPropertyValue("--transparent").trim();
const offWhite = getComputedStyle(root).getPropertyValue("--off-white").trim();
const lightGrid = getComputedStyle(root).getPropertyValue("--light-grid").trim();
const darkGrid = getComputedStyle(root).getPropertyValue("--dark-grid").trim();
const lightColor = getComputedStyle(root).getPropertyValue("--light-color").trim();
const darkColor = getComputedStyle(root).getPropertyValue("--dark-color").trim();

// get elements that need to be targeted repeatedly
let grid = document.getElementById("grid-logo"); // lives within homepage div
let homepageInfo = document.getElementById("homepage-info"); // lives within homepage div
let projectFeed = document.getElementById("project-feed");
let projectRows = document.querySelectorAll(".project-row");
let projectCloses = document.querySelectorAll(".close");
let aboutMe = document.getElementById("about");
let contactMe = document.getElementById("contact");
let linkedIn = document.getElementById("linkedin");

// get viewport width and height
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

// boolean for whether or not load animation is done
let isLoaded = false;

// boolean for whether or not we are in feed view and scroll animation is done
let inFeedView = false;

// boolean for whether or not we are seeing an individual project
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

// function to hide any elements that are not in tablet/mobile
function hideElements() {
	var dateTime = document.getElementById("date-time");
	var developer = document.getElementById("developer");
	if (vw > 900) {
		linkedIn.classList.remove("hidden");
		dateTime.classList.remove("hidden");
		developer.classList.remove("hidden");
		projectRows.forEach((row) => {
			var projectCells = row.children;
			for (var i = 0; i < projectCells.length-1; i++) {
				// ignores project-view
				projectCells[i].classList.remove("hidden");
			}
		});
	} else if (vw > 600) {
		linkedIn.classList.add("hidden");
		dateTime.classList.remove("hidden");
		developer.classList.remove("hidden");
		projectRows.forEach((row) => {
			var projectCells = row.children;
			for (var i = 0; i < projectCells.length-1; i++) {
				// ignores project-view
				if (i < 4) {
					projectCells[i].classList.remove("hidden");
				} else {
					projectCells[i].classList.add("hidden");
				}
			}
		});
	} else {
		linkedIn.classList.add("hidden");
		dateTime.classList.add("hidden");
		developer.classList.add("hidden");
		projectRows.forEach((row) => {
			var projectCells = row.children;
			for (var i = 0; i < projectCells.length-1; i++) {
				// ignores project-view
				if (projectCells[i].classList.contains("project-image")) {
					projectCells[i].classList.add("hidden");
				} else {
					projectCells[i].classList.remove("hidden");
				}
			}
		});
	}
}

// resize event listener to update viewport width+height and grid
window.onresize = function() {
	// update viewport width and height
	vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

	// re-hide/show elements
	hideElements();

	// resize grid based on where we are in user flow, since SVG grid will not scale dynamically
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
	}
	if (isLoaded && !inFeedView) {
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
	}
	if (inFeedView) {
		projectRows.forEach((row, index) => {
			var infoCell = row.querySelector(".project-info");
			var projectView = row.querySelector(".project-view");
			var allImages = row.querySelectorAll(".project-cell img"); // excludes close button
			// rearrange project-info cell based on device
			row.appendChild(infoCell);
			row.appendChild(projectView);
			if (vw > 900) {
				row.insertBefore(infoCell, row.children[index % 6]);
			} else if (vw > 600) {
				row.insertBefore(infoCell, row.children[index % 4]);
			} else if (index % 2 == 0) { // for mobile, only matters if project num is even or odd
				row.insertBefore(infoCell, row.children[0]);
			}
			// for desktop and tablet, dynamically set transition delay for all cells except project view
			if (vw > 600) {
				allImages.forEach((image, index) => {
					image.style.transitionDelay = (index*50) + "ms";
				});
			}
			// dynamically set text width of project view
			var projectText = row.querySelector(".project-text");
			var projectTextRepeat = row.querySelector(".project-text-repeat");
			var projectDesc = row.querySelector(".project-desc");
			projectTextRepeat.style.width = getComputedStyle(projectText).width;
			if (vw > 900) {
				projectDesc.style.width = getComputedStyle(projectText).width;
			} else {
				projectDesc.style.width = "50%";
			}
		});
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
	if (inProjectView) {
		projectRows.forEach((row, index) => {
			var projectView = row.querySelector(".project-view");
			projectView.style.width = vw + "px";
			projectView.style.height = vh + "px";
			projectView.style.top = "0px";
			projectView.style.left = "0px";				
			if (vw > 900) {
				projectView.style.padding = .1*vw + "px";
				projectView.style.paddingBottom = "0px";
			} else {
				projectView.style.padding = .2*vw + "px " + .05*vw + "px";
				projectView.style.paddingBottom = "0px";
			}
		});
	}
};

document.addEventListener("DOMContentLoaded", () => {
	hideElements(); // hides any elements that need to be hidden
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
			var homeChildren = homepageInfo.querySelectorAll("div, a");
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

aboutMe.addEventListener("click", function() {
	console.log("clicked about!");
});

aboutMe.addEventListener("mouseover", function() {
	var blackSquare = aboutMe.nextElementSibling.querySelector(".black-square");
	blackSquare.style.transform = "translateX(0)";
	aboutMe.style.color = offWhite;
	aboutMe.querySelector(".side-arrow").style.filter = "invert(1)";
});

aboutMe.addEventListener("mouseout", function() {
	var blackSquare = aboutMe.nextElementSibling.querySelector(".black-square");
	blackSquare.style.transform = "translateX(-100%)";
	aboutMe.style.color = darkColor;
	aboutMe.querySelector(".side-arrow").style.filter = "invert(0)";
});

contactMe.addEventListener("mouseover", function() {
	var blackSquare = contactMe.nextElementSibling.querySelector(".black-square");
	blackSquare.style.transform = "translateX(0)";
	contactMe.style.color = offWhite;
	contactMe.querySelector(".side-arrow").style.filter = "invert(1)";
});

contactMe.addEventListener("mouseout", function() {
	var blackSquare = contactMe.nextElementSibling.querySelector(".black-square");
	blackSquare.style.transform = "translateX(-100%)";
	contactMe.style.color = darkColor;
	contactMe.querySelector(".side-arrow").style.filter = "invert(0)";
});

linkedIn.addEventListener("mouseover", function() {
	var blackSquare = linkedIn.nextElementSibling.querySelector(".black-square");
	blackSquare.style.transform = "translateX(0)";
	linkedIn.style.color = offWhite;
	linkedIn.querySelector(".side-arrow").style.filter = "invert(1)";
});

linkedIn.addEventListener("mouseout", function() {
	var blackSquare = linkedIn.nextElementSibling.querySelector(".black-square");
	blackSquare.style.transform = "translateX(-100%)";
	linkedIn.style.color = darkColor;
	linkedIn.querySelector(".side-arrow").style.filter = "invert(0)";
});

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
	const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, "0");
	const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, "0");
	const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, "0");
	return "#" + r + g + b;
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
			mobEndLeft = (vw*38/2)/-2 + vw/2;
		
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
			var homeChildren = homepageInfo.querySelectorAll("div");
			for (var i = 0; i < homeChildren.length; i++) {
				homeChildren[i].style.opacity = "0";
				homeChildren[i].style.filter = "blur(4px)";
			}
		}
		// if user is about to scroll back up to the very top
		else if (scrollVal < 0.2 && !scrollDirection) {
			// bring homepage info back
			var homeChildren = homepageInfo.querySelectorAll("div");
			for (var i = 0; i < homeChildren.length; i++) {
				homeChildren[i].style.opacity = "1";
				homeChildren[i].style.filter = "blur(0px)";
			}
		}

		// control grid zooming in/out between 0% and 90% scroll
		// desktop animation
		if (vw > 900) {
			grid.style.height = (deskStartHeight + ((deskEndHeight - deskStartHeight) * Math.min(1, scrollVal/.9))) + "px";
			grid.style.top = (deskStartTop + ((deskEndTop - deskStartTop) * Math.min(1, scrollVal/.9))) + "px";
			grid.style.left = (deskStartLeft + ((deskEndLeft - deskStartLeft) * Math.min(1, scrollVal/.9))) + "px";			
		}	
		// tablet animation	
		else if (vw > 600) {
			grid.style.strokeWidth = "" + (1 + scrollVal); // increase stroke width to 2 gradually
			grid.style.height = (tabStartHeight + ((tabEndHeight - tabStartHeight) * Math.min(1, scrollVal/.9))) + "px";
			grid.style.top = (tabStartTop + ((tabEndTop - tabStartTop) * Math.min(1, scrollVal/.9))) + "px";
			grid.style.left = (tabStartLeft + ((tabEndLeft - tabStartLeft) * Math.min(1, scrollVal/.9))) + "px";
		}
		// mobile animation
		else {
			grid.style.strokeWidth = "" + (1 + scrollVal); // increase stroke width to 2 gradually
			grid.style.height = (mobStartHeight + ((mobEndHeight - mobStartHeight) * Math.min(1, scrollVal/.9))) + "px";
			grid.style.top = (mobStartTop + ((mobEndTop - mobStartTop) * Math.min(1, scrollVal/.9))) + "px";
			grid.style.left = (mobStartLeft + ((mobEndLeft - mobStartLeft) * Math.min(1, scrollVal/.9))) + "px";
		}

		// control project feed and grid fading in/out between 90% and 100% scroll
		projectFeed.style.opacity = Math.max(0, (scrollVal - .9)*10);
		projectFeed.style.zIndex = Math.max(0, (scrollVal - .9)*20).toFixed(); //z-index gradually goes from 0 to 2, moving in front of grid
		grid.style.opacity = Math.min(1, (scrollVal - 1)*-10);

		// control fully entering project feed at 100% scroll
		if (scrollVal < 1) {
			projectFeed.style.overflow = "hidden";
			inFeedView = false;
			var projChildren = projectFeed.querySelectorAll(".project-text");
			for (var i = 0; i < projChildren.length; i++) {
				projChildren[i].style.opacity = "0";
				projChildren[i].style.filter = "blur(4px)";
			}
		} else {
			projectFeed.style.overflow = "scroll";
			inFeedView = true;
			var projChildren = projectFeed.querySelectorAll(".project-text");
			for (var i = 0; i < projChildren.length; i++) {
				projChildren[i].style.opacity = "1";
				projChildren[i].style.filter = "blur(0px)";
			}
		}
		
		// change grid stroke color to fully dark
		for (var i = 0; i < gridLines.length; i++) {
		   gridLines[i].style.stroke = blendColors(lightGrid, darkGrid, scrollVal);
		}
	} else {
		// make sure page is at very top while preloader runs
		window.scrollTo(0,0);
	}
}

////////////////////////////////////////////////////////////////////////////////
//                                 PROJECT FEED                               //
////////////////////////////////////////////////////////////////////////////////


// variables for storing the top and left values of any clicked project info cell
var infoTop = 0,
	infoLeft = 0;

projectRows.forEach((row, index) => {
	var infoCell = row.querySelector(".project-info");
	var allCells = row.querySelectorAll(".project-cell");
	var allImages = row.querySelectorAll(".project-cell img"); // excludes close button
	var projectView = row.querySelector(".project-view");
	// dynamically add project numbers to each row
	if (index < 9) {
		row.querySelector(".project-number").innerHTML = "0" + (index + 1);
	} else {
		row.querySelector(".project-number").innerHTML = "" + (index + 1);
	}
	// rearrange project-info cell based on device
	row.appendChild(infoCell);
	row.appendChild(projectView);
	if (vw > 900) {
		row.insertBefore(infoCell, row.children[index % 6]);
	} else if (vw > 600) {
		row.insertBefore(infoCell, row.children[index % 4]);
	} else if (index % 2 == 0) { // for mobile, only matters if project num is even or odd
		row.insertBefore(infoCell, row.children[0]);
	}
	// for desktop and tablet, dynamically set transition delay for all cells except project view
	if (vw > 600) {
		allImages.forEach((image, index) => {
			image.style.transitionDelay = (index*50) + "ms";
		});
	}
	// dynamically add project info to hidden project view
	var projectText = row.querySelector(".project-text");
	var projectTextRepeat = row.querySelector(".project-text-repeat");
	var projectDesc = row.querySelector(".project-desc");
	projectText.innerHTML = projectTextRepeat.innerHTML;
	// dynamically set text width of project view
	projectTextRepeat.style.width = getComputedStyle(projectText).width;
	// dynamically set width of project description
	if (vw > 900) {
		projectDesc.style.width = getComputedStyle(projectText).width;
	} else {
		projectDesc.style.width = "50%";
	}
	// add event listener for mousing over a row
	row.addEventListener("mouseover", function() {
		// rollover animation for each row
		if (vw > 600) {
			// set background to black and text to white
			infoCell.style.backgroundColor = darkColor + "";
			infoCell.style.color = lightColor + "";
			// animate in all images
			allImages.forEach((image, index) => {
				image.style.opacity = "1";
			});
		}
	});

	// add event listener for mousing out of a row
	row.addEventListener("mouseout", function() {
		// reverting rollover animation for each row
		if (vw > 600) {
			// set background to black and text to white
			infoCell.style.backgroundColor = offWhite + "";
			infoCell.style.color = darkColor + "";
			// animate out all images
			allImages.forEach((image, index) => {
				image.style.opacity = "0";
			});
		}
	});

	// add event listener for clicking on row
	row.addEventListener("click", function() {
		openProject(row, index);
	}, {once: true}); // don't let user click repeatedly
});

function openProject(row, index) {
	// 1. calculate "left" of square relative to viewport (project-cell index * square width)
	var hiddenNum = 0; // need to account for hidden cells that are counted in the row index
	for (var i = 0; i < row.children.length; i++) {
		if (row.children[i].classList.contains("hidden")) {
			hiddenNum++;
		}
		else if (row.children[i].classList.contains("project-info")) {
			if (vw > 900) {
				infoLeft = (i - hiddenNum)*vw/6;
				break;
			} else if (vw > 600) {
				infoLeft = (i - hiddenNum)*vw/4;
				break;
			} else {
				infoLeft = (i - hiddenNum)*vw/2;
				break;
			}
		}
	}
	// 2. calculate "top" of square relative to viewport (row index * square width - feed scrollTop)
	if (vw > 900) {
		infoTop = index*vw/6 - projectFeed.scrollTop;
	} else if (vw > 600) {
		infoTop = index*vw/4 - projectFeed.scrollTop;
	} else {
		infoTop = index*vw/2 - projectFeed.scrollTop;
	}
	// 3. move project view (with duplicate project info) at the correct top and left
	var projectView = row.querySelector(".project-view");
	projectView.style.top = infoTop + "px";
	projectView.style.left = infoLeft + "px";
	// 4. make project view appear, in line with project-info cell already there
	projectView.style.opacity = "1";
	projectView.classList.remove("hidden");
	// 5. prevent user from scrolling while in project view
	projectFeed.style.overflow = "hidden";
	document.body.style.overflow = "hidden";		
	setTimeout(function() {
		// 6. expand project view to fill screen
		projectView.style.width = vw + "px";
		projectView.style.height = vh + "px";
		projectView.style.top = "0px";
		projectView.style.left = "0px";
		if (vw > 900) {
			projectView.style.padding = .1*vw + "px";
			projectView.style.paddingBottom = "0px";
		} else {
			projectView.style.padding = .12*vw + "px " + .05*vw + "px";
			projectView.style.paddingBottom = "0px";
		}
		inProjectView = true;
		// 7. after another 500ms, animate in project view elements
		projectView.querySelector(".close").classList.remove("hidden");
		projectView.querySelector(".project-desc").classList.remove("hidden");
		projectView.querySelector(".video").classList.remove("hidden");
		setTimeout(function() {
			projectView.querySelector(".close").style.opacity = "1";
			projectView.querySelector(".project-desc").style.opacity = "1";
			projectView.querySelector(".video").style.opacity = "1";
		}, 500);
	}, 100);
}

////////////////////////////////////////////////////////////////////////////////
//                              INDIVIDUAL PROJECT                            //
////////////////////////////////////////////////////////////////////////////////

projectCloses.forEach((close, index) => {
	close.addEventListener("click", function() {
		var projectView = close.parentNode;
		// 1. hide all project view elements except project info
		close.style.opacity = "0";
		projectView.querySelector(".project-desc").style.opacity = "0";
		projectView.querySelector(".video").style.opacity = "0";
		setTimeout(function() {
			close.classList.add("hidden");
			projectView.querySelector(".project-desc").classList.add("hidden");
			projectView.querySelector(".video").classList.add("hidden");
			// 2. shrink project view and re-align to project info cell
			projectView.style.top = infoTop + "px";
			projectView.style.left = infoLeft + "px";
			if (vw > 900) {
				projectView.style.width = vw/6 + "px";
				projectView.style.height = vw/6 + "px";
				projectView.style.padding = .02*vw + "px";
			} else if (vw > 600) {
				projectView.style.width = vw/4 + "px";
				projectView.style.height = vw/4 + "px";
				projectView.style.padding = .03*vw + "px";
			} else {
				projectView.style.width = vw/2 + "px";
				projectView.style.height = vw/2 + "px";
				projectView.style.paddingTop = .05*vw + "px";
			}
			inProjectView = false;
			// 3. allow user to scroll again
			projectFeed.style.overflow = "scroll";
			document.body.style.overflow = "auto";
			setTimeout(function() {
				// 4. fade out of black project view cell
				projectView.style.opacity = "0";
				setTimeout(function() {
					// 5. hide project view cell
					projectView.classList.add("hidden");
					// 6. re-activate click event listener for row
					projectView.parentNode.addEventListener("click", function() {
						openProject(projectView.parentNode, index);
					}, {once: true});
				}, 500);
			}, 500);
		}, 600);
	});
});
