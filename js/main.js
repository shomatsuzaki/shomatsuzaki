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
let grid = document.getElementById("grid-logo");
let homepageInfo = document.getElementById("homepage-info");
let projectFeed = document.getElementById("project-feed");
let projectRows = document.querySelectorAll(".project-row");
let projectCloses = document.querySelectorAll(".project-close");
let aboutMe = document.getElementById("about-btn");
let contactMe = document.getElementById("contact-btn");
let projectBtn = document.getElementById("project-btn");
let tapProjects = document.getElementById("tap-projects");
let homepageClose = document.getElementById("homepage-close");
let homepageWindow = document.getElementById("homepage-window");
let returnHome = document.getElementById("return-home");

// get viewport width and height
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

// booleans for where user is in journey
let isLoaded = false; // whether or not load animation is done
let inFeedView = false; // whether or not we are in project feed
let inProjectView = false; // whether or not we are seeing individual project
let inAbout = false; // whether or not we are in about me view
let inContact = false; // whether or not we are in contact me view

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
	if (vw > 900) { // for desktop
		tapProjects.classList.add("hidden");
		projectBtn.classList.remove("hidden");
		projectBtn.nextElementSibling.classList.remove("hidden");
		dateTime.classList.remove("hidden");
		developer.classList.remove("hidden");
		// don't hide any project thumbnails
		projectRows.forEach((row) => {
			var projectCells = row.children;
			for (var i = 0; i < projectCells.length-1; i++) {
				// ignores project-view
				projectCells[i].classList.remove("hidden");
			}
		});
	} else if (vw > 600) { // for tablet
		projectBtn.classList.add("hidden");
		projectBtn.nextElementSibling.classList.add("hidden");
		tapProjects.classList.remove("hidden");
		dateTime.classList.remove("hidden");
		developer.classList.remove("hidden");
		// remove the last two project thumbnails
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
	} else { // for mobile
		projectBtn.classList.add("hidden");
		projectBtn.nextElementSibling.classList.add("hidden");
		dateTime.classList.add("hidden");
		developer.classList.add("hidden");
		tapProjects.classList.remove("hidden");
		// remove all thumbnails except hero image and project info
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

	// re-arrange order of project thumbnails
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
	else if (isLoaded && !inFeedView) {
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
		if (inAbout) {
			if (vw > 900) {
				homepageInfo.querySelector("#name").style.marginTop = "0";
				homepageWindow.style.transform = "translate(-50%,100%) scale(6,3)";
				homepageWindow.style.margin = "0.5px 0 0 0.5px";
				homepageWindow.style.gridRow = "2 / 3";
			} else if (vw > 600) {
				homepageInfo.querySelector("#name").style.marginTop = "-19.5vw";
				homepageWindow.style.transform = "translate(0%,0%) scale(6,60)";
				homepageWindow.style.margin = "0";
				homepageWindow.style.gridRow = "2 / 5";
			} else {
				homepageInfo.querySelector("#name").style.marginTop = "-18vw";
				homepageWindow.style.transform = "translate(0%,0%) scale(6,60)";
				homepageWindow.style.margin = "0";
				homepageWindow.style.gridRow = "2 / 5";
			}
		}
		if (inContact) {
			if (vw > 900) {
				homepageWindow.style.transform = "translate(-50%,-100%) scale(6,3)";
				homepageWindow.style.margin = "0.5px 0 0 0.5px";
				homepageWindow.style.gridRow = "4 / 5";
			} else if (vw > 600) {
				homepageWindow.style.transform = "translate(0%,0%) scale(6,60)";
				homepageWindow.style.margin = "0";
				homepageWindow.style.gridRow = "2 / 5";
			} else {
				homepageWindow.style.transform = "translate(0%,0%) scale(6,60)";
				homepageWindow.style.margin = "0";
				homepageWindow.style.gridRow = "2 / 5";
			}
		}
	}
	else if (isLoaded && inFeedView) {
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
	else if (isLoaded && inProjectView) {
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

// adjust for change from portrait to landscape
screen.orientation.addEventListener("change", function() {
	var noLandscape = document.getElementById("no-landscape");
	if (screen.orientation.type.includes("landscape")) {
		if (!inProjectView) {
			noLandscape.classList.remove("hidden");
			document.body.style.overflow = "hidden";
		}
	}
	else if (screen.orientation.type.includes("portrait")) {
		noLandscape.classList.add("hidden");
		document.body.style.overflow = "hidden";
		if (!isLoaded) {
			window.scrollTo(0,0);
	    	projectFeed.style.overflow = "scroll";
			document.body.style.overflow = "auto";
			console.log("Returned to portrait from load screen");
		}
		if (isLoaded && !inFeedView) {
			window.scrollTo(0,0);
	    	projectFeed.style.overflow = "scroll";
			document.body.style.overflow = "auto";
			console.log("Returned to portrait from homepage");
		}
	    if (inFeedView) {
	    	window.scrollTo(0, document.body.scrollHeight);
	    	projectFeed.scrollTo(0, 0);
	    	projectFeed.style.overflow = "scroll";
			document.body.style.overflow = "auto";
			console.log("Returned to portrait from project feed");
	    }
	    if (inProjectView) {
	    	window.scrollTo(0, document.body.scrollHeight);
	    	projectFeed.style.overflow = "hidden";
			document.body.style.overflow = "hidden";
			console.log("Returned to portrait from individual project view");
	    }
    }
});

////////////////////////////////////////////////////////////////////////////////
//                              OPENING ANIMATION                             //
////////////////////////////////////////////////////////////////////////////////

function percentLoad() {
	// get all the percentage HTML elements
	var percentages = document.getElementsByClassName("percentage"),
		count = 0,
		endCount = 100,
		duration = 3; // in seconds
	// count up every 30ms for a total of 3s
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
			clearInterval(handler);
		}
	}, duration*10);
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
		hzMask6 = document.getElementById("hz-mask6");
	// 1. animate first set of lines
	vtMask1.style.transform = "translateY(8px)";
	vtMask3.style.transform = "translateY(8px)";
	//reverse direction for some lines
	vtMask2.style.transform = "translateY(-8px)";
	vtMask4.style.transform = "translateY(-8px)";
	// 2. animate second set of lines
	setTimeout(function() {
		hzMask3.style.transform = "translateX(8px)";
		hzMask4.style.transform = "translateX(8px)";
		//reverse direction for some lines
		hzMask1.style.transform = "translateX(-8px)";
		hzMask2.style.transform = "translateX(-8px)";
		// 3. animate third set of lines
		setTimeout(function() {
			vtMask5.style.transform = "translateY(8px)";
			vtMask7.style.transform = "translateY(8px)";
			hzMask6.style.transform = "translateX(8px)";
			//reverse direction for some lines
			vtMask6.style.transform = "translateY(-8px)";
			hzMask5.style.transform = "translateX(-8px)";
			// 4. initiate grid zoom
			setTimeout(function() {
				isLoaded = true;
				animateGrid();
			}, 1800);
		}, 600);
	}, 1500);
}

function animateGrid() {
	var deskEndHeight = 3.5*vw*38/8, // zoomed so only 8 columns are in vew
		deskEndTop = deskEndHeight/-2 + vh/2,
		deskEndLeft = (vw*38/8)/-2 + vw/2, // for grid to be centered, left must be negative half of grid width (38/8x of width) + half of view
		mobHeight = 3.5*vw*38/32 // zoomed so 32 of 38 columns in view
		mobEndTop = mobHeight/-2 + 2.5*1/32*vw; // each square is 1/32 vw, need to move grid up half vh then down 2.5 squares
	// 1. animate grid
	if (vw > 900) { // for desktop
		grid.style.strokeWidth = "2";
		grid.style.height = deskEndHeight + "px";
		grid.style.top = deskEndTop + "px";
		grid.style.left = deskEndLeft + "px";
	} else { // for tablet and mobile
		grid.style.top = mobEndTop + "px";
	}
	// 2. make homepage info visible
	setTimeout(function() {
		homepageInfo.classList.remove("hidden");
		setTimeout(function() {
			homepageInfo.style.opacity = "1";
			homepageInfo.style.filter = "blur(0px)";
			// 3. trigger hover events on desktop
			if (vw > 900) {
				var mouseoverEvent = new Event("mouseover");
				var mouseoutEvent = new Event("mouseout");
				setTimeout(function() {
					aboutMe.dispatchEvent(mouseoverEvent);
					setTimeout(function() {
						aboutMe.dispatchEvent(mouseoutEvent);
						setTimeout(function() {
							contactMe.dispatchEvent(mouseoverEvent);
							setTimeout(function() {
								contactMe.dispatchEvent(mouseoutEvent);
								setTimeout(function() {
									projectBtn.dispatchEvent(mouseoverEvent);
										setTimeout(function() {
											projectBtn.dispatchEvent(mouseoutEvent);
										}, 500);
								}, 500);
							}, 500);
						}, 500);
					}, 500);
				}, 500);
			}
		}, 100);
	}, 1500);
}

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

document.addEventListener("DOMContentLoaded", () => {
	hideElements(); // hides any elements that need to be hidden for responsiveness
	percentLoad(); // runs preloader percent animation
	animateLogo(); // runs SHO logo animation during preloader
	displayTime(); // runs current time display in homepage info
	window.scrollTo(0,0); // moves scroll position to top for smooth initial scroll animation
});

////////////////////////////////////////////////////////////////////////////////
//                                HOMEPAGE INFO                               //
////////////////////////////////////////////////////////////////////////////////

aboutMe.addEventListener("click", function() {
	var aboutInfo = homepageInfo.querySelector("#about-info");
	var aboutPic = homepageInfo.querySelector("#about-pic");
	// remove hidden class from hidden elements (still invisible except window)
	aboutInfo.classList.remove("hidden");
	aboutPic.classList.remove("hidden");
	homepageClose.classList.remove("hidden");
	document.body.style.cursor = "url('./icons/yellow-dot.svg') 10 10, auto";
	inAbout = true;
	if (vw > 900) {
		// 1. move homepage window to contact square
		homepageWindow.style.gridRow = "2 / 3";
		// 2. remove hidden class from homepage window, making it visible
		homepageWindow.classList.remove("hidden");
		setTimeout(function() {
			// 3. set name to white
			homepageInfo.querySelector("#name").style.color = offWhite;
			// 4. transform window to fill sho logo
			homepageWindow.style.transform = "translate(-50%,100%) scale(6,3)";
			homepageWindow.style.margin = "0.5px 0 0 0.5px";
			setTimeout(function() {
				// 5. fade in all about me info
				aboutInfo.style.opacity = "1";
				aboutInfo.style.filter = "blur(0px)";
				aboutPic.style.opacity = "1";
				aboutPic.style.filter = "blur(0px)";
				homepageClose.style.opacity = "1";
				homepageClose.style.filter = "blur(0px)";
				// 6. prevent scroll
				projectFeed.style.overflow = "hidden";
				document.body.style.overflow = "hidden";
			}, 500);
		}, 100);
	} else { // for tablet and mobile only
		// 1. animate black square across sho logo
		var blackSquare = aboutMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(0)";
		setTimeout(function() {
			// 2. remove hidden class from homepage window, making it visible
			homepageWindow.classList.remove("hidden");
			setTimeout(function() {
				// 2. set name to white and shift up
				homepageInfo.querySelector("#name").style.color = offWhite;
				if (vw > 600) {
					homepageInfo.querySelector("#name").style.marginTop = "-19.5vw";
				} else {
					homepageInfo.querySelector("#name").style.marginTop = "-18vw";
				}
				// 3. transform window to fill screen
				homepageWindow.style.transform = "scale(6,60)";
				setTimeout(function() {
					// 4. fade in all about me info
					aboutInfo.style.opacity = "1";
					aboutInfo.style.filter = "blur(0px)";
					aboutPic.style.opacity = "1";
					aboutPic.style.filter = "blur(0px)";
					homepageClose.style.opacity = "1";
					homepageClose.style.filter = "blur(0px)";
					// 5. prevent scroll
					projectFeed.style.overflow = "hidden";
					document.body.style.overflow = "hidden";
				}, 500);
			}, 100);
		}, 300);
	}
});

contactMe.addEventListener("click", function() {
	var contactInfo = homepageInfo.querySelector("#contact-info");
	// remove hidden class from hidden elements (still invisible except window)
	contactInfo.classList.remove("hidden");
	homepageClose.classList.remove("hidden");
	document.body.style.cursor = "url('./icons/green-dot.svg') 10 10, auto";
	inContact = true;
	if (vw > 900) {
		// 1. move homepage window to contact square
		homepageWindow.style.gridRow = "4 / 5";
		// 2. remove hidden class from homepage window, making it visible
		homepageWindow.classList.remove("hidden");
		setTimeout(function() {
			// 3. set name to white
			homepageInfo.querySelector("#name").style.color = offWhite;
			// 4. transform window to fill sho logo
			homepageWindow.style.transform = "translate(-50%,-100%) scale(6,3)";
			homepageWindow.style.margin = "0.5px 0 0 0.5px";
			setTimeout(function() {
				// 5. fade in all about me info
				contactInfo.style.opacity = "1";
				contactInfo.style.filter = "blur(0px)";
				homepageClose.style.opacity = "1";
				homepageClose.style.filter = "blur(0px)";
				// 6. prevent scroll
				projectFeed.style.overflow = "hidden";
				document.body.style.overflow = "hidden";
			}, 500);
		}, 100);
	} else { // for tablet and mobile only
		// 1. animate black square across sho logo
		var blackSquare = contactMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(0)";
		setTimeout(function() {
			// 2. remove hidden class from homepage window, making it visible
			homepageWindow.classList.remove("hidden");
			setTimeout(function() {
				// 2. set name to white but do NOT shift up
				homepageInfo.querySelector("#name").style.color = offWhite;
				// 3. transform window to fill screen
				homepageWindow.style.transform = "scale(6,60)";
				setTimeout(function() {
					// 4. fade in all about me info
					contactInfo.style.opacity = "1";
					contactInfo.style.filter = "blur(0px)";
					homepageClose.style.opacity = "1";
					homepageClose.style.filter = "blur(0px)";
					// 5. prevent scroll
					projectFeed.style.overflow = "hidden";
					document.body.style.overflow = "hidden";
				}, 500);
			}, 100);
		}, 300);
	}
});

homepageClose.addEventListener("click", function() {
	// 1. allow scroll
	projectFeed.style.overflow = "scroll";
	document.body.style.overflow = "auto";
	// 2. check which view is open, about or contact
	if (inAbout) {
		var aboutInfo = homepageInfo.querySelector("#about-info");
		var aboutPic = homepageInfo.querySelector("#about-pic");
		// 3. fade out all about me info
		aboutInfo.style.opacity = "0";
		aboutInfo.style.filter = "blur(4px)";
		aboutPic.style.opacity = "0";
		aboutPic.style.filter = "blur(4px)";
		homepageClose.style.opacity = "0";
		homepageClose.style.filter = "blur(4px)";
		document.body.style.cursor = "url('./icons/blue-dot.svg') 10 10, auto";
		if (vw > 900) {
			setTimeout(function() {
				// 4. transform window back to single square
				homepageWindow.style.transform = "translate(0,0) scale(1,1)";
				homepageWindow.style.margin = "0";
				// 5. set name back to black
				homepageInfo.querySelector("#name").style.color = darkColor;
				// 6. reset about square to mouseover position
				var blackSquare = aboutMe.nextElementSibling.querySelector(".black-square");
				blackSquare.style.transform = "translateX(0)";
				aboutMe.style.color = offWhite;
				aboutMe.querySelector(".side-arrow").style.filter = "invert(1)";
				setTimeout(function() {
					// 7. add hidden class back to hidden elements
					homepageWindow.classList.add("hidden");
					aboutInfo.classList.add("hidden");
					aboutPic.classList.add("hidden");
					homepageClose.classList.add("hidden");
					// 8. reset about square to mouseout position
					blackSquare.style.transform = "translateX(-101%)";
					aboutMe.style.color = darkColor;
					aboutMe.querySelector(".side-arrow").style.filter = "invert(0)";
				}, 700);
			}, 500);
		} else { // for tablet and mobile only
			setTimeout(function() {
				// 4. transform window back to single square
				homepageWindow.style.transform = "scale(1,1)";
				homepageWindow.style.margin = "0";
				// 5. set name back to black and shift down
				homepageInfo.querySelector("#name").style.color = darkColor;
				if (vw > 600) {
					homepageInfo.querySelector("#name").style.marginTop = "0";
				} else {
					homepageInfo.querySelector("#name").style.marginTop = "1.4vw";
				}
				// 6. reset about square to mouseover position
				var blackSquare = aboutMe.nextElementSibling.querySelector(".black-square");
				blackSquare.style.transform = "translateX(0)";
				setTimeout(function() {
					// 7. add hidden class back to hidden elements
					homepageWindow.classList.add("hidden");
					aboutInfo.classList.add("hidden");
					aboutPic.classList.add("hidden");
					homepageClose.classList.add("hidden");
					// 8. reset about square to mouseout position
					blackSquare.style.transform = "translateX(-101%)";
				}, 800);
			}, 500);
		}
		inAbout = false;
	} else if (inContact) {
		var contactInfo = homepageInfo.querySelector("#contact-info");
		// 3. fade out all contact info
		contactInfo.style.opacity = "0";
		contactInfo.style.filter = "blur(4px)";
		homepageClose.style.opacity = "0";
		homepageClose.style.filter = "blur(4px)";
		document.body.style.cursor = "url('./icons/blue-dot.svg') 10 10, auto";
		if (vw > 900) {
			setTimeout(function() {
				// 4. transform window back to single square
				homepageWindow.style.transform = "translate(0,0) scale(1,1)";
				homepageWindow.style.margin = "0";
				// 5. set name back to black
				homepageInfo.querySelector("#name").style.color = darkColor;
				// 6. reset about square to mouseover position
				var blackSquare = contactMe.nextElementSibling.querySelector(".black-square");
				blackSquare.style.transform = "translateX(0)";
				contactMe.style.color = offWhite;
				contactMe.querySelector(".side-arrow").style.filter = "invert(1)";
				setTimeout(function() {
					// 7. add hidden class back to hidden elements
					homepageWindow.classList.add("hidden");
					contactInfo.classList.add("hidden");
					homepageClose.classList.add("hidden");
					// 8. reset about square to mouseout position
					blackSquare.style.transform = "translateX(-101%)";
					contactMe.style.color = darkColor;
					contactMe.querySelector(".side-arrow").style.filter = "invert(0)";
				}, 700);
			}, 500);
		} else { // for tablet and mobile only
			setTimeout(function() {
				// 4. transform window back to single square
				homepageWindow.style.transform = "scale(1,1)";
				homepageWindow.style.margin = "0";
				// 5. set name back to black but do NOT shift down
				homepageInfo.querySelector("#name").style.color = darkColor;
				// 6. reset about square to mouseover position
				var blackSquare = contactMe.nextElementSibling.querySelector(".black-square");
				blackSquare.style.transform = "translateX(0)";
				setTimeout(function() {
					// 7. add hidden class back to hidden elements
					homepageWindow.classList.add("hidden");
					contactInfo.classList.add("hidden");
					homepageClose.classList.add("hidden");
					// 8. reset about square to mouseout position
					blackSquare.style.transform = "translateX(-101%)";
				}, 800);
			}, 500);
		}
		inContact = false;
	}
});

// projects button for desktop
projectBtn.addEventListener("click", function() {
	zoomToProjects();
});

// projects button for tablet and mobile
tapProjects.addEventListener("click", function() {
	zoomToProjects();
});

aboutMe.addEventListener("mouseover", function() {
	if (vw > 900) {
		var blackSquare = aboutMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(0)";
		aboutMe.style.color = offWhite;
		aboutMe.querySelector(".side-arrow").style.filter = "invert(1)";
	}
});

aboutMe.addEventListener("mouseout", function() {
	if (vw > 900) {
		var blackSquare = aboutMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(-101%)";
		aboutMe.style.color = darkColor;
		aboutMe.querySelector(".side-arrow").style.filter = "invert(0)";
	}
});

contactMe.addEventListener("mouseover", function() {
	if (vw > 900) {
		var blackSquare = contactMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(0)";
		contactMe.style.color = offWhite;
		contactMe.querySelector(".side-arrow").style.filter = "invert(1)";
	}
});

contactMe.addEventListener("mouseout", function() {
	if (vw > 900) {
		var blackSquare = contactMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(-101%)";
		contactMe.style.color = darkColor;
		contactMe.querySelector(".side-arrow").style.filter = "invert(0)";
	}
});

projectBtn.addEventListener("mouseover", function() {
	var blackSquare = projectBtn.nextElementSibling.querySelector(".black-square");
	blackSquare.style.transform = "translateX(0)";
	projectBtn.style.color = offWhite;
	projectBtn.querySelector(".side-arrow").style.filter = "invert(1)";
});

projectBtn.addEventListener("mouseout", function() {
	var blackSquare = projectBtn.nextElementSibling.querySelector(".black-square");
	blackSquare.style.transform = "translateX(-101%)";
	projectBtn.style.color = darkColor;
	projectBtn.querySelector(".side-arrow").style.filter = "invert(0)";
});

////////////////////////////////////////////////////////////////////////////////
//                            TRANSITION TO PROJECTS                          //
////////////////////////////////////////////////////////////////////////////////

function zoomToProjects() {
	var gridLines = document.getElementsByClassName("grid-line"),
		deskEndHeight = 3.5*vw*38/6, // zoomed so 6 of 38 columns in view
		tabEndHeight = 3.5*vw*38/4, // zoomed so 4 of 38 columns in view
		mobEndHeight = 3.5*vw*38/2, // zoomed so 2 of 38 columns in view
		deskEndTop = deskEndHeight/-2 + 1.5*1/6*vw, // center grid to top of view, then down 1.5 squares
		tabEndTop = tabEndHeight/-2 + 1.5*1/4*vw, // center grid to top of view, then down 1.5 squares
		mobEndTop = mobEndHeight/-2 + 1.5*1/2*vw, // center grid to top of view, then down 1.5 squares
		deskEndLeft = (vw*38/6)/-2 + vw/2,
		tabEndLeft = (vw*38/4)/-2 + vw/2,
		mobEndLeft = (vw*38/2)/-2 + vw/2;
	// 1. disappear homepage info
	homepageInfo.style.opacity = "0";
	homepageInfo.style.filter = "blur(4px)";
	// 2. zoom in grid and change grid color
	setTimeout(function() {
		homepageInfo.classList.add("hidden");
		// change grid stroke color to fully dark
		for (var i = 0; i < gridLines.length; i++) {
		   gridLines[i].style.stroke = darkGrid;
		}
		if (vw > 900) { // for desktop
			grid.style.height = deskEndHeight + "px";
			grid.style.top = deskEndTop + "px";
			grid.style.left = deskEndLeft + "px";
		} else if (vw > 600) { // for tablet
			grid.style.strokeWidth = "2";
			grid.style.height = tabEndHeight + "px";
			grid.style.top = tabEndTop + "px";
			grid.style.left = tabEndLeft + "px";
		} else { // for mobile
			grid.style.strokeWidth = "2";
			grid.style.height = mobEndHeight + "px";
			grid.style.top = mobEndTop + "px";
			grid.style.left = mobEndLeft + "px";
		}
		// 3. fade in project feed
		setTimeout(function() {
			grid.style.opacity = "0";
			projectFeed.classList.remove("hidden");
			inFeedView = true;
			var projChildren = projectFeed.querySelectorAll(".project-text");
			for (var i = 0; i < projChildren.length; i++) {
				projChildren[i].style.opacity = "1";
				projChildren[i].style.filter = "blur(0px)";
			}
			// fade in thumbnail images for mobile only
			if (vw <= 600) {
				var heroThumbs = projectFeed.querySelectorAll(".project-cell img");
				for (var i = 0; i < heroThumbs.length; i++) {
					heroThumbs[i].style.opacity = "1";
				}
			}
			returnHome.style.opacity = "1";
			returnHome.style.filter = "blur(0px)";
			document.body.style.cursor = "url('./icons/red-dot.svg') 10 10, auto";
		}, 1500);
	}, 500);
}

function zoomFromProjects() {
	var gridLines = document.getElementsByClassName("grid-line"),
		deskEndHeight = 3.5*vw*38/8, // zoomed so only 8 columns are in vew
		deskEndTop = deskEndHeight/-2 + vh/2,
		deskEndLeft = (vw*38/8)/-2 + vw/2, // for grid to be centered, left must be negative half of grid width (38/8x of width) + half of view
		mobEndHeight = 3.5*vw*38/32 // zoomed so 32 of 38 columns in view
		mobEndTop = mobEndHeight/-2 + 2.5*1/32*vw; // each square is 1/32 vw, need to move grid up half vh then down 2.5 squares
		mobEndLeft = (vw*38/32)/-2 + vw/2 // for grid to be centered, left must be negative half of grid width (38/32x of width) + half of view
	// 1. scroll to top of project feed
	projectFeed.scrollTo({
		top: 0,
		left: 0,
		behavior: "smooth"
	});
	// 2. fade out project feed
	var projChildren = projectFeed.querySelectorAll(".project-text");
	for (var i = 0; i < projChildren.length; i++) {
		projChildren[i].style.opacity = "0";
		projChildren[i].style.filter = "blur(4px)";
	}
	// fade out thumbnail images for mobile only
	if (vw <= 600) {
		var heroThumbs = projectFeed.querySelectorAll(".project-cell img");
		for (var i = 0; i < heroThumbs.length; i++) {
			heroThumbs[i].style.opacity = "0";
		}
	}
	returnHome.style.opacity = "0";
	returnHome.style.filter = "blur(4px)";
	inFeedView = false;
	setTimeout(function() {
		// 3. fade in grid
		grid.style.opacity = "1";
		// 4. zoom out of grid
		setTimeout(function() {
			projectFeed.classList.add("hidden");
			// change grid stroke color to fully dark
			for (var i = 0; i < gridLines.length; i++) {
			   gridLines[i].style.stroke = lightGrid;
			}
			if (vw > 900) { // for desktop
				grid.style.height = deskEndHeight + "px";
				grid.style.top = deskEndTop + "px";
				grid.style.left = deskEndLeft + "px";
			} else { // for tablet and mobile
				grid.style.strokeWidth = "1";
				grid.style.height = mobEndHeight + "px";
				grid.style.top = mobEndTop + "px";
				grid.style.left = mobEndLeft + "px";
			}
			// 5. fade in homepage info
			setTimeout(function() {
				homepageInfo.classList.remove("hidden");
				document.body.style.cursor = "url('./icons/blue-dot.svg') 10 10, auto";
				setTimeout(function() {
					homepageInfo.style.opacity = "1";
					homepageInfo.style.filter = "blur(0px)";
				}, 100);
			}, 1500);
		}, 500);
	}, 500);
}

returnHome.addEventListener("click", function() {
	zoomFromProjects();
});

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
	// if (vw > 600) {
	// 	allImages.forEach((image, index) => {
	// 		image.style.transitionDelay = (index*50) + "ms";
	// 	});
	// }
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
		inFeedView = false;
		// 7. after another 500ms, animate in project view elements
		projectView.querySelector(".project-close").classList.remove("hidden");
		projectView.querySelector(".project-desc").classList.remove("hidden");
		projectView.querySelector(".content").classList.remove("hidden");
		setTimeout(function() {
			projectView.querySelector(".project-close").style.opacity = "1";
			projectView.querySelector(".project-desc").style.opacity = "1";
			projectView.querySelector(".content").style.opacity = "1";
		}, 500);
	}, 100);
}

////////////////////////////////////////////////////////////////////////////////
//                              INDIVIDUAL PROJECT                            //
////////////////////////////////////////////////////////////////////////////////

// function for pausing embedded video
function stopVideo(element) {
	var iframe = element.querySelector("iframe");
	var video = element.querySelector("video");
	if (iframe) {
		var iframeSrc = iframe.src;
		iframe.src = iframeSrc;
	}
	if (video) {
		video.pause();
	}
}

projectCloses.forEach((close, index) => {
	close.addEventListener("click", function() {
		var projectView = close.parentNode;
		// 1. pause any video playing
		stopVideo(projectView);
		// 2. hide all project view elements except project info
		close.style.opacity = "0";
		projectView.querySelector(".project-desc").style.opacity = "0";
		projectView.querySelector(".content").style.opacity = "0";
		setTimeout(function() {
			close.classList.add("hidden");
			projectView.querySelector(".project-desc").classList.add("hidden");
			projectView.querySelector(".content").classList.add("hidden");
			// 3. shrink project view and re-align to project info cell
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
			inFeedView = true;
			// 4. allow user to scroll again
			projectFeed.style.overflow = "scroll";
			document.body.style.overflow = "auto";
			setTimeout(function() {
				// 5. fade out of black project view cell
				projectView.style.opacity = "0";
				setTimeout(function() {
					// 6. hide project view cell
					projectView.classList.add("hidden");
					// 7. re-activate click event listener for row
					projectView.parentNode.addEventListener("click", function() {
						openProject(projectView.parentNode, index);
					}, {once: true});
				}, 500);
			}, 500);
		}, 600);
	});
});
