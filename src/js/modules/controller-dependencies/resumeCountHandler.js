import { Logic, Visual } from "../../Controller.js";

// happens when I click resume to resume a countdown
function resumeCountHandler(inputValuesArr) {
    const asNumbers = inputValuesArr.map((el) => +el);
    const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until

    document.querySelector(".ticker-element").classList.remove("paused"); // removing the blinking class

    if (activeBlock === "timer") {
        Logic.setTimerCurrentValues(asNumbers); // setting timer values in state
        Logic.startInterval(Visual.showTicking); // Logic.startInterval is an interval timer that runs every second
        Visual.updateHistoryBox(`Timer for <span>${Logic.getTimerSetTime()}</span> is running`); // updating history box
    } else if (activeBlock === "stopwatch") {
        Logic.startIntervalStopwatch(Visual.showTicking); // resuming
        Visual.updateHistoryBox(`Stopwatch is running`); // updating history box
    } else if (activeBlock == "until") {
        const pauseTimeMinute = new Date(Logic.getUntilPauseTime()).getMinutes();
        const nowMinute = new Date().getMinutes();

        if (pauseTimeMinute !== nowMinute) {
            // if the pause time (minutes) is the same as now time (minutes), we don't recalc the time difference
            const [hours, minutes] = Logic.calcTimeDifference(Logic.getUntilTime()); // recalculating
            Logic.setTimerCurrentValues([hours, minutes, 0]); // setting timer values in state
        }

        Logic.startInterval(Visual.showTicking); // Logic.startInterval is an interval timer that runs every second
        Visual.changeStartBtnText("pause"); // changing the text of the Start btn
        Visual.toggleOptionSaveBtn("hide"); // hiding the Save This Option btn

        const setTime = Logic.getUntilTime().map((x) => +x); // getting the until time that was set
        const historyString = `Counting to <span>${setTime[0]}:${setTime[1].toString().padStart(2, 0)}</span>`; // getting the string of the set time
        Visual.updateHistoryBox(historyString); // updating history box
    }
}

export default resumeCountHandler;
