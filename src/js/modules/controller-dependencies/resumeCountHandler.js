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
        const pauseTime = new Date(Logic.getUntilPauseTime()); // getting the time when it was paused
        const nowTime = new Date(); // getting the now time

        pauseTime.setSeconds(0, 0); // setting both times to the same minute level ignoring seconds and milliseconds
        nowTime.setSeconds(0, 0); // ensuring that both times are set to 00 seconds and 00 milliseconds

        if (pauseTime.getTime() !== nowTime.getTime()) {
            // if the pause time is not the same as now time (on a minute level), recalc the time difference
            const [hours, minutes] = Logic.calcTimeDifference(Logic.getUntilTime()); // recalculating
            Logic.setTimerCurrentValues([hours, minutes, 0]); // setting timer values in state
        }

        Logic.startInterval(Visual.showTicking); // Logic.startInterval is an interval timer that runs every second
        Visual.changeStartBtnText("pause"); // changing the text of the Start btn
        Visual.toggleOptionSaveBtn("hide"); // hiding the Save This Option btn

        const setTime = Logic.getUntilTime().map((x) => +x); // getting the until time that was originally set, to update history box
        const historyString = `Counting to <span>${setTime[0]}:${setTime[1].toString().padStart(2, 0)}</span>`; // getting the string of the set time
        Visual.updateHistoryBox(historyString); // updating history box
    }
}

export default resumeCountHandler;
