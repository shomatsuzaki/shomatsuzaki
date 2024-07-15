////////////////////////////////////////////////////////////////////////////////
//                         RESPONSIVE GRID + SHO LOGO                         //
////////////////////////////////////////////////////////////////////////////////

// get viewport width and height
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

////////////////////////////////////////////////////////////////////////////////
//                                  PRELOADER                                 //
////////////////////////////////////////////////////////////////////////////////

function percentLoad() {
	// get all the percentage HTML elements
	var percentages = document.getElementsByClassName('percentage');
	var targetCount = 100;
	var count = 0;

	// update every 10 milliseconds
	var timer = setInterval(function() {
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
			document.getElementById('preloader').style.opacity = "0";
			clearInterval(timer);
		}
	}, 42);
}

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
//                           WINDOW EVENT LISTENERS                           //
////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', percentLoad());