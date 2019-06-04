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

////////////////////
// TEXT DE-SCRAMBLER
////////////////////

window.onload = function() {
  var $randomname = $('.rand1');
  var $randomrole = $('.rand2');
  var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  var nameletters = ["s", "h", "o", " ", "m", "a", "t", "s", "u", "z", "a", "k", "i"];
  var roleletters = ["a", "r", "t", " ", "d", "i", "r", "e", "c", "t", "o", "r"];
  var $timer = 10;
  var data = 0;
  var index;
  var change;
  var scraminterval;
  var n, r;

  $randomname.css('opacity','.5');
  $randomrole.css('opacity','.5');

  // assign each letter a random number from 0 to 99 as attr 'data-max'
  $randomname.each(function() {
    change = Math.round(Math.random()*99);
    $(this).attr('data-max', change);
  });
  $randomrole.each(function() {
    change = Math.round(Math.random()*99);
    $(this).attr('data-max', change);
  });

  // return random number from 0 to 25 (for each letter in alphabet)
  function randletter() {
    return Math.round(Math.random()*25);
  }

  // return random number from 1 to length of an array
  function randselect(len) {
    return Math.floor(Math.random()*len+1);
  }

  // create one iteration of scrambled letters for both name and role
  function scramble() {
    n = randselect($randomname.length);
    // pick random name letter and choose random letter for it
    $('.rand1:nth-of-type('+n+')').html(alphabet[randletter()]);
    // set 'data-number' attr to data value (starts at 0 and increments)
    $('.rand1:nth-of-type('+n+')').attr('data-number', data);

    r = randselect($randomrole.length);
    // pick random role letter and choose random letter for it
    $('.rand2:nth-of-type('+r+')').html(alphabet[randletter()]);
    // set 'data-number' attr to data value (starts at 0 and increments)
    $('.rand2:nth-of-type('+r+')').attr('data-number', data);
    data++;

    // for every name letter, switch to correct letter if data-number > data-max
    $randomname.each(function() {
      if (parseInt($(this).attr('data-number')) > parseInt($(this).attr('data-max'))) {
        index = $('#name .ltr').index(this);
        $(this).html(nameletters[index]);
        $(this).css('opacity','1');
        $(this).removeClass('rand1');
      }
    });
    // for every role letter, switch to correct letter if data-number > data-max
    $randomrole.each(function() {
      if (parseInt($(this).attr('data-number')) > parseInt($(this).attr('data-max'))) {
        index = $('#role .ltr').index(this);
        $(this).html(roleletters[index]);
        $(this).css('opacity','1');
        $(this).removeClass('rand2');
      }
    });
    // stop function if no rands left
    if (data > 500) {
      clearInterval(scraminterval);
      // $('#name').html('sho matsuzaki');
      // $('#name').css('opacity','1');
      // $('#role').html('art director');
      // $('#role').css('opacity','1');
    }
  }

  scraminterval = setInterval(scramble, $timer);
};

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

/////////////////////////
// ANIMATED URL AND TITLE
/////////////////////////

// function wavyurl() {
//     var i, n, s = '';

//     for (i = 0; i < 10; i++) {
//         n = Math.floor(Math.sin((Date.now()/200) + (i/2)) * 4) + 4;

//         s += String.fromCharCode(0x2581 + n);

//         // s += String.fromCharCode(0x2581 + n);
//     }

//     // window.location.hash = s;
//     document.title = s;

//     setTimeout(wavyurl, 20);
// }

// wavyurl();

// var f = ['🌑', '🌒', '🌓', '🌔', '🌝', '🌖', '🌗', '🌘'];

// function animateUrl() {
//     location.hash = f[Math.floor((Date.now()/100)%f.length)];
//     document.title = 'Sho Matsuzaki ' + f[Math.floor((Date.now()/100)%f.length)];

//     setTimeout(animateUrl, 50);
// }

// animateUrl();

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
