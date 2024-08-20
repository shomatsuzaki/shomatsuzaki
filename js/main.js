////////////////////////////////////////////////////////////////////////////////
//                               GLOBAL VARIABLES                             //
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

////////////////////////////////////////////////////////////////////////////////
//                                 INITIAL LOAD                               //
////////////////////////////////////////////////////////////////////////////////

// count up to 100% as page loads
function percentLoad() {
	// get all the percentage HTML elements
	var percentages = document.getElementsByClassName("percentage"),
		count = 0,
		endCount = 100,
		duration = 3.5; // in seconds
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

// animate logo lines on initial load
function drawLogo() {
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
		}, 600);
	}, 1500);
}

// animate grid from initial load to homepage
function animateGrid() {
	var deskHeight, deskTop, deskLeft, deskStroke,
		tabHeight, tabTop, tabLeft, tabStroke,
		mobHeight, mobTop, mobLeft, mobStroke;
	if (!isLoaded) { // initial CSS values
		deskHeight = 3.5*vw;
		deskTop = deskHeight/-2 + vh/2;
		deskLeft = 0;
		mobHeight = tabHeight = 3.5*vw*38/32;
		mobTop = tabTop = mobHeight/-2 + vh/2;
		mobLeft = tabLeft = (vw*38/32)/-2 + vw/2;
		deskStroke = 1;
		mobStroke = tabStroke = 1;
	} else if (isLoaded && !inFeedView) {
		deskHeight = 3.5*vw*38/8; // zoomed so only 8 columns are in vew
		deskTop = deskHeight/-2 + vh/2;
		deskLeft = (vw*38/8)/-2 + vw/2; // for grid to be centered, left must be negative half of grid width (38/8x of width) + half of view
		mobHeight = tabHeight = 3.5*vw*38/32; // zoomed so 32 of 38 columns in view
		mobTop = tabTop = mobHeight/-2 + 2.5*1/32*vw; // each square is 1/32 vw, need to move grid up half vh then down 2.5 squares
		mobLeft = tabLeft = (vw*38/32)/-2 + vw/2;
		deskStroke = 2;
		mobStroke = tabStroke = 1;
	} else if (isLoaded && inFeedView) {
		deskHeight = 3.5*vw*38/6; // zoomed so 6 of 38 columns in view
		deskTop = deskHeight/-2 + 1.5*1/6*vw; // center grid to top of view, then down 1.5 squares
		deskLeft = (vw*38/6)/-2 + vw/2;
		tabHeight = 3.5*vw*38/4; // zoomed so 4 of 38 columns in view
		tabTop = tabHeight/-2 + 1.5*1/4*vw; // center grid to top of view, then down 1.5 squares
		tabLeft = (vw*38/4)/-2 + vw/2;
		mobHeight = 3.5*vw*38/2; // zoomed so 2 of 38 columns in view
		mobTop = mobHeight/-2 + 1.5*1/2*vw; // center grid to top of view, then down 1.5 squares
		mobLeft = (vw*38/2)/-2 + vw/2;
		deskStroke = mobStroke = tabStroke = 2;
	}
	if (vw > 900) { // for desktop
		grid.style.strokeWidth = deskStroke + "px";
		grid.style.height = deskHeight + "px";
		grid.style.top = deskTop + "px";
		grid.style.left = deskLeft + "px";
	} else if (vw > 600) { // for tablet
		grid.style.strokeWidth = tabStroke + "px";
		grid.style.height = tabHeight + "px";
		grid.style.top = tabTop + "px";
		grid.style.left = tabLeft + "px";
	} else { // for mobile
		grid.style.strokeWidth = mobStroke + "px";
		grid.style.height = mobHeight + "px";
		grid.style.top = mobTop + "px";
		grid.style.left = mobLeft + "px";
	}
}

// simulate hover effects on desktop, for initial load only
function simulateHover() {
	homepageInfo.classList.remove("hidden");
	setTimeout(function() {
		homepageInfo.style.opacity = "1";
		homepageInfo.style.filter = "blur(0px)";
		if (vw > 900) {
			var mouseoverEvent = new Event("mouseenter");
			var mouseoutEvent = new Event("mouseleave");
			setTimeout(function() {
				aboutMe.dispatchEvent(mouseoverEvent);
				setTimeout(function() {
					projectBtn.dispatchEvent(mouseoverEvent);
					setTimeout(function() {
						contactMe.dispatchEvent(mouseoverEvent);
						setTimeout(function() {
							aboutMe.dispatchEvent(mouseoutEvent);
							setTimeout(function() {
								projectBtn.dispatchEvent(mouseoutEvent);
									setTimeout(function() {
										contactMe.dispatchEvent(mouseoutEvent);
									}, 175);
							}, 175);
						}, 175);
					}, 175);
				}, 175);
			}, 175);
		}
	}, 50);
}

// full opening animation sequence
function loadingAnimation() {
	percentLoad();
	drawLogo();
	setTimeout(function() {
		isLoaded = true;
		animateGrid();
		setTimeout(function() {
			simulateHover();
		}, 1500);
	}, 3500);
}

// show current date and time on homepage
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

// re-arrange project feed thumbnails and dynamically set project text
function setProjectFeed() {
	projectRows.forEach((row, index) => {
		var infoCell = row.querySelector(".project-info");
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
	});
}

document.addEventListener("DOMContentLoaded", () => {
	displayTime();
	loadingAnimation();
	setProjectFeed();
	setTimeout(function() {
		setRippleEvents();
	}, 2);
});

////////////////////////////////////////////////////////////////////////////////
//                                    RESIZE                                  //
////////////////////////////////////////////////////////////////////////////////

// resize event listener to update viewport width+height and grid
window.onresize = function() {
	// update viewport width and height
	vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

	animateGrid(); // set correct grid size
	setProjectFeed(); // reorder project thumbnails
	setTimeout(function() {
		setRippleEvents(); // reset ripple effect of thumbnails
	}, 2);
	if (inAbout || inContact) {
		transitionHomepageWindow(); // resize homepage popup window
	}
	else if (inProjectView) {
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
// screen.orientation.addEventListener("change", function() {
// 	var noLandscape = document.getElementById("no-landscape");
// 	if (screen.orientation.type.includes("landscape") && !inProjectView) {
// 		noLandscape.classList.remove("hidden");
// 	}
// 	else if (screen.orientation.type.includes("portrait")) {
// 		noLandscape.classList.add("hidden");
//     }
// });

////////////////////////////////////////////////////////////////////////////////
//                                HOMEPAGE INFO                               //
////////////////////////////////////////////////////////////////////////////////

// maximize or minimize homepage window and adjust name top margin
function transitionHomepageWindow() {
	var name = homepageInfo.querySelector("#name");
	if (inAbout) {
		if (vw > 900) {
			name.style.marginTop = "0";
			homepageWindow.style.transform = "translate(-50%,100%) scale(6,3)";
			homepageWindow.style.margin = "0.5px 0 0 0.5px";
			homepageWindow.style.gridRow = "2 / 3";
		} else if (vw > 600) {
			name.style.marginTop = "-19.5vw";
			homepageWindow.style.transform = "translate(0%,0%) scale(6,60)";
			homepageWindow.style.margin = "0";
			homepageWindow.style.gridRow = "2 / 5";
		} else {
			name.style.marginTop = "-18vw";
			homepageWindow.style.transform = "translate(0%,0%) scale(6,60)";
			homepageWindow.style.margin = "0";
			homepageWindow.style.gridRow = "2 / 5";
		}
	} else if (inContact) {
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
	} else {
		homepageWindow.style.margin = "0";
		if (vw > 900) {
			name.style.marginTop = "0";
			homepageWindow.style.transform = "translate(0,0) scale(1,1)";
		} else if (vw > 600) {
			name.style.marginTop = "0";
			homepageWindow.style.transform = "scale(1,1)";
		} else {
			name.style.marginTop = "1.4vw";
			homepageWindow.style.transform = "scale(1,1)";
		}
	}
}

// fade in or out about info
function transitionAboutInfo() {
	var aboutInfo = homepageInfo.querySelector("#about-info");
	var aboutPic = homepageInfo.querySelector("#about-pic");
	if (inAbout) {
		// remove hidden class from hidden elements (still invisible)
		aboutInfo.classList.remove("hidden");
		aboutPic.classList.remove("hidden");
		homepageClose.classList.remove("hidden");
		setTimeout(function() {
			homepageInfo.querySelector("#name").style.color = offWhite;
			aboutInfo.style.opacity = "1";
			aboutInfo.style.filter = "blur(0px)";
			aboutPic.style.opacity = "1";
			aboutPic.style.filter = "blur(0px)";
			homepageClose.style.opacity = "1";
			homepageClose.style.filter = "blur(0px)";
		}, 50);
	} else {
		homepageInfo.querySelector("#name").style.color = darkColor;
		aboutInfo.style.opacity = "0";
		aboutInfo.style.filter = "blur(4px)";
		aboutPic.style.opacity = "0";
		aboutPic.style.filter = "blur(4px)";
		homepageClose.style.opacity = "0";
		homepageClose.style.filter = "blur(4px)";
		setTimeout(function() {
			aboutInfo.classList.add("hidden");
			aboutPic.classList.add("hidden");
			homepageClose.classList.add("hidden");
		}, 50);
	}
}

// fade in or out contact info
function transitionContactInfo() {
	var contactInfo = homepageInfo.querySelector("#contact-info");
	if (inContact) {
		// remove hidden class from hidden elements (still invisible)
		contactInfo.classList.remove("hidden");
		homepageClose.classList.remove("hidden");
		setTimeout(function() {
			homepageInfo.querySelector("#name").style.color = offWhite;
			contactInfo.style.opacity = "1";
			contactInfo.style.filter = "blur(0px)";
			homepageClose.style.opacity = "1";
			homepageClose.style.filter = "blur(0px)";
		}, 50);
	} else {
		homepageInfo.querySelector("#name").style.color = darkColor;
		contactInfo.style.opacity = "0";
		contactInfo.style.filter = "blur(4px)";
		homepageClose.style.opacity = "0";
		homepageClose.style.filter = "blur(4px)";
		setTimeout(function() {
			contactInfo.classList.add("hidden");
			homepageClose.classList.add("hidden");
		}, 50);
	}
}

aboutMe.addEventListener("click", function() {
	document.body.style.cursor = "url('./icons/yellow-dot.svg') 10 10, auto";
	inAbout = true;
	if (vw > 900) {
		// move homepage window to contact square and make visible
		homepageWindow.style.gridRow = "2 / 3";
		homepageWindow.classList.remove("hidden");
		setTimeout(function() {
			// transform window to fill sho logo and adjust name margin
			transitionHomepageWindow();
			setTimeout(function() {
				// fade in about info
				transitionAboutInfo();
			}, 500);
		}, 100);
	} else {
		// animate black square across sho logo
		var blackSquare = aboutMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(0)";
		setTimeout(function() {
			// remove hidden class from homepage window, making it visible
			homepageWindow.classList.remove("hidden");
			setTimeout(function() {
				// transform window to fill sho logo and adjust name margin
				transitionHomepageWindow();
				setTimeout(function() {
					// fade in about info
					transitionAboutInfo();
				}, 500);
			}, 100);
		}, 300);
	}
});

contactMe.addEventListener("click", function() {
	document.body.style.cursor = "url('./icons/green-dot.svg') 10 10, auto";
	inContact = true;
	if (vw > 900) {
		// move homepage window to contact square and make visible
		homepageWindow.style.gridRow = "4 / 5";
		homepageWindow.classList.remove("hidden");
		setTimeout(function() {
			// transform window to fill sho logo and adjust name margin
			transitionHomepageWindow();
			setTimeout(function() {
				// fade in contact info
				transitionContactInfo();
			}, 500);
		}, 100);
	} else { // for tablet and mobile only
		// animate black square across sho logo
		var blackSquare = contactMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(0)";
		setTimeout(function() {
			// remove hidden class from homepage window, making it visible
			homepageWindow.classList.remove("hidden");
			setTimeout(function() {
				// transform window to fill screen and adjust name margin
				transitionHomepageWindow();
				setTimeout(function() {
					// fade in contact info
					transitionContactInfo();
				}, 500);
			}, 100);
		}, 300);
	}
});

homepageClose.addEventListener("click", function() {
	document.body.style.cursor = "url('./icons/blue-dot.svg') 10 10, auto";
	var mouseoverEvent = new Event("mouseenter");
	var mouseoutEvent = new Event("mouseleave");
	if (inAbout) {
		inAbout = false;
		// fade out about info
		transitionAboutInfo();
		setTimeout(function() {
			// transform window back to single square and adjust name margin
			transitionHomepageWindow();
			if (vw > 900) {
				// reset about square to mouseover position
				aboutMe.dispatchEvent(mouseoverEvent);
				setTimeout(function() {
					homepageWindow.classList.add("hidden");
					setTimeout(function() {
						// reset about square to mouseout position
						aboutMe.dispatchEvent(mouseoutEvent);
					}, 150);
				}, 800);
			} else {
				// reset about square to over logo
				var blackSquare = aboutMe.nextElementSibling.querySelector(".black-square");
				blackSquare.style.transform = "translateX(0)";
				setTimeout(function() {
					// add hidden class back to hidden elements
					homepageWindow.classList.add("hidden");
					// reset about square to mouseout position
					blackSquare.style.transform = "translateX(-101%)";
				}, 800);
			}
		}, 400);
	} else if (inContact) {
		inContact = false;
		// fade out contact info
		transitionContactInfo();
		setTimeout(function() {
			// transform window back to single square and adjust name margin
			transitionHomepageWindow();
			if (vw > 900) {
				// reset about square to mouseover position
				contactMe.dispatchEvent(mouseoverEvent);
				setTimeout(function() {
					homepageWindow.classList.add("hidden");
					setTimeout(function() {
						// reset about square to mouseout position
						contactMe.dispatchEvent(mouseoutEvent);
					}, 150);
				}, 800);
			} else {
				// reset about square to over logo
				var blackSquare = contactMe.nextElementSibling.querySelector(".black-square");
				blackSquare.style.transform = "translateX(0)";
				setTimeout(function() {
					// add hidden class back to hidden elements
					homepageWindow.classList.add("hidden");
					// reset about square to mouseout position
					blackSquare.style.transform = "translateX(-101%)";
				}, 800);
			}
		}, 400);
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

aboutMe.addEventListener("mouseenter", function() {
	if (vw > 900) {
		var blackSquare = aboutMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(0)";
		aboutMe.style.color = offWhite;
		aboutMe.querySelector(".side-arrow").style.filter = "invert(1)";
	}
});

aboutMe.addEventListener("mouseleave", function() {
	if (vw > 900) {
		var blackSquare = aboutMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(-101%)";
		aboutMe.style.color = darkColor;
		aboutMe.querySelector(".side-arrow").style.filter = "invert(0)";
	}
});

contactMe.addEventListener("mouseenter", function() {
	if (vw > 900) {
		var blackSquare = contactMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(0)";
		contactMe.style.color = offWhite;
		contactMe.querySelector(".side-arrow").style.filter = "invert(1)";
	}
});

contactMe.addEventListener("mouseleave", function() {
	if (vw > 900) {
		var blackSquare = contactMe.nextElementSibling.querySelector(".black-square");
		blackSquare.style.transform = "translateX(-101%)";
		contactMe.style.color = darkColor;
		contactMe.querySelector(".side-arrow").style.filter = "invert(0)";
	}
});

projectBtn.addEventListener("mouseenter", function() {
	var blackSquare = projectBtn.nextElementSibling.querySelector(".black-square");
	blackSquare.style.transform = "translateX(0)";
	projectBtn.style.color = offWhite;
	projectBtn.querySelector(".side-arrow").style.filter = "invert(1)";
});

projectBtn.addEventListener("mouseleave", function() {
	var blackSquare = projectBtn.nextElementSibling.querySelector(".black-square");
	blackSquare.style.transform = "translateX(-101%)";
	projectBtn.style.color = darkColor;
	projectBtn.querySelector(".side-arrow").style.filter = "invert(0)";
});

////////////////////////////////////////////////////////////////////////////////
//                            TRANSITION TO PROJECTS                          //
////////////////////////////////////////////////////////////////////////////////

function zoomToProjects() {
	document.body.style.cursor = "url('./icons/red-dot.svg') 10 10, auto";
	var gridLines = document.getElementsByClassName("grid-line");
	inFeedView = true;
	// fade out homepage info
	homepageInfo.style.opacity = "0";
	homepageInfo.style.filter = "blur(4px)";
	// zoom in grid and change grid color
	setTimeout(function() {
		homepageInfo.classList.add("hidden");
		animateGrid();
		for (var i = 0; i < gridLines.length; i++) {
		   gridLines[i].style.stroke = darkGrid;
		}
		// fade in project feed and fade out grid
		setTimeout(function() {
			grid.style.opacity = "0";
			projectFeed.classList.remove("hidden");
			var projChildren = projectFeed.querySelectorAll(".project-text");
			for (var i = 0; i < projChildren.length; i++) {
				projChildren[i].style.opacity = "1";
				projChildren[i].style.filter = "blur(0px)";
			}
			returnHome.style.opacity = "1";
			returnHome.style.filter = "blur(0px)";
		}, 1500);
	}, 500);
}

function zoomFromProjects() {
	document.body.style.cursor = "url('./icons/blue-dot.svg') 10 10, auto";
	var gridLines = document.getElementsByClassName("grid-line");
	inFeedView = false;
	// scroll to top of project feed
	projectFeed.scrollTo({
		top: 0,
		left: 0,
		behavior: "smooth"
	});
	// fade out project feed
	var projChildren = projectFeed.querySelectorAll(".project-text");
	for (var i = 0; i < projChildren.length; i++) {
		projChildren[i].style.opacity = "0";
		projChildren[i].style.filter = "blur(4px)";
	}
	returnHome.style.opacity = "0";
	returnHome.style.filter = "blur(4px)";
	setTimeout(function() {
		// fade in grid
		grid.style.opacity = "1";
		// zoom out of grid and change grid color
		setTimeout(function() {
			projectFeed.classList.add("hidden");
			animateGrid();
			for (var i = 0; i < gridLines.length; i++) {
			   gridLines[i].style.stroke = lightGrid;
			}
			// fade in homepage info
			setTimeout(function() {
				homepageInfo.classList.remove("hidden");
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

// create ripple effect when hovering over project thumbnail
function rippleEffect(allCells, infoCell, allImages, hoverCellIndex) {
	if (vw > 600) {
		allCells.forEach((cell, index) => {
			if (cell.classList.contains("project-info")) {
				// set delay for info cell changing background color and text color
				cell.style.transitionDelay = (Math.abs(hoverCellIndex - index)*70) + "ms";
			} else {
				// set delay for images in image cells changing opacity
				cell.children[0].style.transitionDelay = (Math.abs(hoverCellIndex - index)*70) + "ms";
			}
		});
		// change color of info cell and make thumbnail images appear
		setTimeout(function() {
			// set background to black and text to white
			infoCell.style.backgroundColor = darkColor + "";
			infoCell.style.color = lightColor + "";
			// animate in all images
			allImages.forEach((image) => {
				image.style.opacity = "1";
			});
		}, 2);
	}
}

// add event listeners for hovering over a cell, hovering away from a row,
// and clicking on a row
function setRippleEvents() {
	projectRows.forEach((row, rowIndex) => {
		var allCells = row.querySelectorAll(".project-cell");
		var infoCell = row.querySelector(".project-info");
		var allImages = row.querySelectorAll(".project-cell img"); // excludes close button
		// add inline handler at cell level for hovering over a cell
		allCells.forEach((cell, cellIndex) => {
			cell.onmouseenter = function() {
				rippleEffect(allCells, infoCell, allImages, cellIndex);
			};
		});
	});
}

// variables for storing the top and left values of any clicked project info cell
var infoTop = 0,
	infoLeft = 0;

function openProject(row, index) {
	inProjectView = true;
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

// add event listeners for project rows on initial load
projectRows.forEach((row, index) => {
	var infoCell = row.querySelector(".project-info");
	var allImages = row.querySelectorAll(".project-cell img"); // excludes close button
	// add event listener at row level for hovering away
	row.addEventListener("mouseleave", function() {
		if (vw > 600) {
			// set background to black and text to white
			infoCell.style.backgroundColor = offWhite + "";
			infoCell.style.color = darkColor + "";
			// animate out all images
			allImages.forEach((image) => {
				image.style.opacity = "0";
			});
		}
	});
	// add event listener at row level for clicking on project, only fires once
	row.addEventListener("click", function() {
		openProject(row, index);
	}, {once: true});
});

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

// event listeners for all close buttons in project view
projectCloses.forEach((close, index) => {
	inProjectView = false;
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
			// 4. allow user to scroll again
			projectFeed.style.overflow = "scroll";
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
