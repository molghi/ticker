import { Logic, Visual } from "../../Controller.js";
import View from "../View.js";

// happens when I click start to start a countdown
function startCountHandler(inputValuesArr) {
    const asNumbers = inputValuesArr.map((el) => +el);
    const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until

    if (activeBlock === "timer" && asNumbers.reduce((a, b) => a + b, 0) === 0) {
        return alert("You cannot start a timer for 0 hours 0 minutes"); // showing a message if I'm starting a countdown with all zeroes as values
    } else if (activeBlock === "timer") {
        Logic.setTimerCurrentValues(asNumbers); // setting timer values in state
        Logic.startInterval((timerValues) => {
            Visual.showTicking(timerValues, "timer");
            if (timerValues.join("") === "000") Logic.setTimerIsRunning(); // if the timer has finished, resetting its state value
        }); // Logic.startInterval is an interval timer that runs every second
        Visual.changeStartBtnText("pause"); // changing the text of the Start btn
        Visual.toggleOptionSaveBtn("hide"); // hiding the Save This Option btn
        Logic.pushTimerSetTime(asNumbers); // pushing the time that was set, to show the History string later
        const setTime = Logic.getTimerSetTime(); // getting the string of the set time for history box
        const historyString = `Timer for <span>${setTime}</span> is running`; // composing the text for history-box
        Visual.updateHistoryBox(historyString); // updating history box
        Visual.renderProgressBar(); // rendering the progress bar at the top
        Logic.progressBarTimer(Visual.updateProgressBar); // making the progress bar update every sec
        //
    } else if (activeBlock === "stopwatch") {
        Logic.resetStopwatchValues(); // resetting values to all zeroes
        Logic.startIntervalStopwatch(Visual.showTicking); // start ticking
        Visual.changeStartBtnText("pause"); // changing the text of the Start btn
        Visual.updateHistoryBox("Stopwatch is running"); // updating history box
        //
    } else if (activeBlock === "until") {
        const values = Visual.readValues().slice(0, 2); // getting the current input values; slicing because it returns the seconds value too which is of no need here
        const [hours, minutes] = Logic.calcTimeDifference(values); // calculating the time difference between now and the time that was set
        Logic.setUntilTime(values); // saving the set Until time in the state
        Logic.setTimerCurrentValues([hours, minutes, 0]); // setting timer values in state
        Logic.startInterval((timerValues) => {
            Visual.showTicking(timerValues, "timer");
            if (timerValues.join("") === "000") Logic.setTimerIsRunning(); // if the timer has finished, resetting its state value
        }); // Logic.startInterval is an interval timer that runs every second
        Visual.changeStartBtnText("pause"); // changing the text of the Start btn
        Visual.toggleOptionSaveBtn("hide"); // hiding the Save This Option btn
        Visual.removeCurrentTime(); // removing the Now: element under the Until btn
        const setTime = Logic.getUntilTime().map((x) => +x); // for history box
        const historyString = `Counting to <span>${setTime[0]}:${setTime[1].toString().padStart(2, 0)}</span>`; // getting the string of the set time
        Visual.updateHistoryBox(historyString); // updating history box
        Visual.renderProgressBar(); // rendering the progress bar at the top
        Logic.progressBarTimer(Visual.updateProgressBar); // making the progress bar update every sec
    }

    Visual.blurInputs(); // blurring inputs when a timer is active
    Logic.setTimerIsRunning(); // setting that a timer is running, switching false to true
}

export default startCountHandler;
