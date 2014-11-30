$(document).ready(function() {

  window.startTimer = function(){
    var element = document.getElementById('timer-container');
    element.innerHTML = '<header id="clock-seconds"></header>';
    var textElement = document.getElementById('clock-seconds');

    var seconds = new ProgressBar.Circle(element, {
      duration: 200,
      color: "#008CBA",
      trailColor: "#45ACF1",
      strokeWidth: 8
    });

    setInterval(function() {
      var second = new Date().getSeconds();
      seconds.animate(second / 60, function() {
          textElement.innerHTML = second;
      });
    }, 1000);
  }

 });

