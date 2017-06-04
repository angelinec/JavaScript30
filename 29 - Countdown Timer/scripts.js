let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

/*create a countdown timer -
  grab current time, calc end time,
  set timer
*/
function timer(seconds) {
	clearInterval(countdown); //clear previous timer if present

	const now = Date.now(); //grab current time; default millisec
	const then = now + seconds * 1000; //convert sec to msec
	displayTimeLeft(seconds);
	displayEndTime(then);

	//assign interval to a var to enable clearInterval()
	countdown = setInterval(() => {
		const secondsLeft = Math.round((then - Date.now()) / 1000);
		//stop timer if condition is true
		if (secondsLeft < 0) { 
			clearInterval(countdown);
			return;
		}
		//else
		displayTimeLeft(secondsLeft);
	}, 1000);
}

//calc and display minutes/seconds left on timer 
function displayTimeLeft(seconds) {
	const minutes = Math.floor(seconds / 60); 
	const remainderSeconds = seconds % 60;
	//add leading '0' if less than 10secs left
	const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`; 

	document.title = display; //display timer on tab page
	timerDisplay.textContent = display; //display timer on page
}

//display countdown end time
function displayEndTime(timestamp) {
	const end = new Date(timestamp); //grab and convert calc-ed end time
	const hour = end.getHours();
	const adjustedHour = hour > 12 ? hour - 12 : hour; //change to 12-hour system
	const minutes = end.getMinutes();

	//display end time on page and add leading '0' if less than 10mins left
	endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`; 
}

//start countdown time based on button clicked
function startTimer() {
	const seconds = parseInt(this.dataset.time); //grab data attr value
	timer(seconds); //set value to timer fn
}

buttons.forEach(button => button.addEventListener('click', startTimer));

//set countdown timer based on submitted time(mins)
document.customForm.addEventListener('submit', function(e){
	e.preventDefault(); //prevent page from refreshing upon submit
	const mins = this.minutes.value; //grab input value
	timer(mins * 60); //convert to seconds
	this.reset(); //clear input field
});







