import { Logic, Visual, topControlsHandler } from "../../Controller.js";

// happens when I click stop to stop a countdown
function stopCountHandler() {
    if (!Logic.getTimerIsRunning()) return; // if no timer is running, early return

    const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until
    const values = Visual.readValues().map((x) => +x); // reading the current values of the inputs
    const units = ["h", "m", "s"];
    let historyString = values.map((x, i) => `${x}${units[i]}`).join(" "); // getting the string to put in the history box

    Logic.stopTimer(); // stopping all interval timers
    document.querySelector(".ticker-element").classList.remove("working"); // decrease the size of the ticker element
    document.querySelector(".ticker-element").classList.remove("paused"); // removing the blinking class
    Visual.toggleInterfaceDimmer("show"); // bring back the interface
    Visual.resetInputValues(); // reset in the UI
    Visual.toggleSecondsBlock("hide"); // hiding the seconds block
    Logic.resetTimerValues(); // reset in state
    Visual.updateTitle(undefined, "restore"); // put 'Ticker' back in the title
    Visual.changeStartBtnText("start"); // changing the text of Start btn

    if (activeBlock === "stopwatch") {
        Visual.toggleSecondsBlock("show"); // show the seconds block
        Visual.updateHistoryBox(`Stopwatch was aborted after ${historyString}`); // update History/Status block
    } else if (activeBlock === "until") {
        topControlsHandler("until"); // rendering the current time under the Until btn
        const setTime = Logic.getUntilTime().map((x) => +x); // getting the set until time
        const historyBoxString = `Counting to <span>${setTime[0]}:${setTime[1]
            .toString()
            .padStart(2, 0)}</span> was aborted with ${historyString} remaining`; // getting the string of the set time
        Visual.updateHistoryBox(historyBoxString); // updating history box
        Visual.removeProgressBar(); // removing the progress bar at the top that shows the remaining time in the running timer
        Logic.stopProgressBarTimer();
    } else if (activeBlock === "timer") {
        Visual.updateHistoryBox(`Timer for <span>${Logic.getTimerSetTime()}</span> was stopped with ${historyString} remaining`); // updating history box
        Visual.removeProgressBar(); // removing the progress bar at the top that shows the remaining time in the running timer
        Logic.stopProgressBarTimer();
    }

    Logic.setTimerIsRunning(); // setting that no timer is running, switching true to false
}

export default stopCountHandler;
