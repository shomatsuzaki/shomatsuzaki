////////////////////
// STICKY HEADER
////////////////////

// When the user scrolls the page, execute stickyHeader 
window.onscroll = function() {stickyHeader()};

// Get the header
var header = document.getElementById("stickyheader");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Get screen width for media query
var screen = $(document).width();

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function stickyHeader() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
    if (screen >= 1500) {
      $('#container').css("padding-top","100px");
    } else if (screen >= 768) {
      $('#container').css("padding-top","90px");
    } else {
      $('#container').css("padding-top","50px");
    }
  } else {
    header.classList.remove("sticky");
    $('#container').css("padding-top","0px");
  }
}

/////////////////////////
// DIRECTION AWARE HOVER
/////////////////////////

document.querySelectorAll('button').forEach((elem) => {

  elem.onmouseenter =
  elem.onmouseleave = (e) => {

    const tolerance = 5

    const left = 0
    const right = elem.clientWidth

    let x = e.pageX - elem.offsetLeft

    if (x - tolerance < left) x = left
    if (x + tolerance > right) x = right

    elem.style.setProperty('--x', `${ x }px`)

  }

})

///////////////////////
// FILTER FUNCTIONALITY
///////////////////////

filterSelection("all")

function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("project");
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    myRemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) myAddClass(x[i], "show");
  }
}

// Used to add "show" to classes
function myAddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

// Used to remove "show" from classes
function myRemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the button that has just been clicked
var btnContainer = document.getElementById("btncontainer");
if (btnContainer) {
  var btns = btnContainer.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
      window.scroll({
        top: sticky, 
        left: 0, 
        behavior: 'smooth'
      });
    });
}
}
