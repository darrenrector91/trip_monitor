var startTimerButton = document.querySelector('.startTimer');
var pauseTimerButton = document.querySelector('.pauseTimer');
var timerDisplay = document.querySelector('.timer');
var startTime;
var updatedTime;
var difference;
var tInterval;
var savedTime;
var paused = 0;
var running = 0;

var tripData = [];

function startTimer() {
  if (!running) {
    startTime = new Date().getTime('HH:mm');
    tInterval = setInterval(getShowTime, 1);
    paused = 0;
    running = 1;
    // timerDisplay.style.background = '#FF0000';
    timerDisplay.style.cursor = 'auto';
    timerDisplay.style.color = '#000';
    startTimerButton.style.cursor = 'auto';
    pauseTimerButton.style.cursor = 'pointer';
  }
}

function pauseTimer() {
  let mileageExists = $('#tripMiles').length;
  console.log(mileageExists);

  if (!difference) {
    // if timer never started, don't allow pause button to do anything
  } else if (!paused && mileageExists > 0) {
    enable();
    clearInterval(tInterval);
    savedTime = difference;
    paused = 1;
    running = 0;
    // timerDisplay.style.background = '#A90000';
    timerDisplay.style.color = '#000';
    timerDisplay.style.cursor = 'pointer';
    startTimerButton.style.cursor = 'pointer';
    pauseTimerButton.style.cursor = 'auto';
    let tripDuration = timerDisplay.innerHTML;
    // console.log(tripDuration);

    let hms = tripDuration;
    var a = hms.split(':');
    let hours = a[0];
    let minutes = a[1];
    let secs = a[2];
    let x = hours + ':' + minutes + ':' + secs;
    let timeString = x.toString();

    $('#tripDuration').val(timeString);

    // var seconds = +a[0] * 3600 + a[1] * 60 + a[2] / 60;

    let hoursToMins = a[0] * 2;
    console.log(hoursToMins);
    let secsToMins = a[2] / 60;

    let totalTime = hoursToMins + minutes + secsToMins;
    console.log(totalTime);

    let miles = $('#tripMiles').val();

    if (miles == 0) {
      alert('Please enter mileage');
      startTimer();
    }
    let mph = miles / totalTime;
    // let mph = miles / (seconds / 60);
    var newVal = Math.round(mph);
    console.log(newVal);
    $('#mph').val(newVal);

    var d = new Date();
    let timeStamp = moment(d).format('HH:mm:ss');
    $('#current-time').val(timeStamp);
  } else {
    startTimer();
  }
}

function resetTimer() {
  clearInterval(tInterval);
  savedTime = 0;
  difference = 0;
  paused = 0;
  running = 0;
  timerDisplay.innerHTML = '00:00:00';
  timerDisplay.style.color = '#000';
  timerDisplay.style.cursor = 'pointer';
  startTimerButton.style.cursor = 'pointer';
  pauseTimerButton.style.cursor = 'auto';
  $('#tripDuration').val('');
  $('#mph').val('');
  $('#current-time').val('');
  $('#tripMiles').val('');
}

function getShowTime() {
  updatedTime = new Date().getTime();
  if (savedTime) {
    difference = updatedTime - startTime + savedTime;
  } else {
    difference = updatedTime - startTime;
  }
  // var days = Math.floor(difference / (1000 * 60 * 60 * 24));
  var hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((difference % (1000 * 60)) / 1000);
  // var milliseconds = Math.floor((difference % (1000 * 60)) / 100);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  timerDisplay.innerHTML = hours + ':' + minutes + ':' + seconds;
}

function expectedTime() {
  let url =
    'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=5445+Boone+Avenue+North+New+Hope+MN&destinations=2700+Blue+Water+Road+Eagan+MN&key=AIzaSyDV-l1U_wPYBA8Qp6hgGWMXTSvizU5UlA8';
  fetch(url)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      // Read the response as json.
      return response.json();
    })
    .then(function(responseAsJson) {
      // Do stuff with the JSON
      console.log(responseAsJson);
    })
    .catch(function(error) {
      console.log('Looks like there was a problem: \n', error);
    });
}

function disable() {
  document.getElementById('timerPause').disabled = true;
}
function enable() {
  document.getElementById('timerPause').disabled = false;
}

$('#form-submit-btn').on('click', function(e) {
  e.preventDefault();
  let start = document.getElementById('currentLoc').value;
  let dest = document.getElementById('destination').value;
  let rte = document.getElementById('route').value;
  let tripDistance = document.getElementById('tripMiles').value;
  let duration = document.getElementById('tripDuration').value;
  let avgSpeed = document.getElementById('mph').value;
  let currrentTime = document.getElementById('current-time').value;
  tripData.push(
    start,
    dest,
    rte,
    tripDistance,
    duration,
    avgSpeed,
    currrentTime
  );
  console.log(tripData);

  document.getElementById('currentLoc').value = '';
  document.getElementById('destination').value = '';
  document.getElementById('route').value = '';
  document.getElementById('tripMiles').value = '';
  document.getElementById('tripDuration').value = '';
  document.getElementById('mph').value = '';
  document.getElementById('current-time').value = '';
});
