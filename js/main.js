////////////////////////////////////////////////////////////////////////////////
//                         RESPONSIVE GRID + SHO LOGO                         //
////////////////////////////////////////////////////////////////////////////////

// get viewport width and height
let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

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