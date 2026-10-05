// reveal button to return to top of page
document.addEventListener("DOMContentLoaded", function() {
  let rtt = document.getElementById("return-to-top");    
  window.onscroll = function() {    
  if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
    rtt.style.opacity = 1;
  } else { rtt.style.opacity = 0;}}
});

document.addEventListener("DOMContentLoaded", function() {
  var timelineElements = document.querySelectorAll('.timeline, .timeline ~ *');

  timelineElements.forEach(function(element) {
    var links = element.getElementsByTagName('a');

    for (var i = 0; i < links.length; i++) {
      links[i].target = '_blank';
      links[i].rel = 'noopener noreferrer';
    }
  });
});