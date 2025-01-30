import { Logic, Visual } from "../../Controller.js";

// happens when I click pause to pause a countdown
function pauseCountHandler(inputValuesArr) {
    const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until
    const values = Visual.readValues().map((x) => +x); // reading the current values of the inputs

    if (activeBlock === "until") {
        Logic.setUntilPauseTime(new Date().toISOString()); // setting the time when it was paused
        const setTime = Logic.getUntilTime().map((x) => +x); // getting the until time that was set
        const historyBoxString = `Counting to <span>${setTime[0]}:${setTime[1].toString().padStart(2, 0)}</span> was paused`; // getting the string of the set time
        Visual.updateHistoryBox(historyBoxString); // updating history box
    } else if (activeBlock === "stopwatch") {
        Visual.updateHistoryBox(`Stopwatch was paused`); // updating history box
    } else if (activeBlock === "timer") {
        Visual.updateHistoryBox(`Timer for <span>${Logic.getTimerSetTime()}</span> was paused`); // updating history box
    }

    Logic.stopTimer(); // stopping all interval timers
    Visual.updateTitle(undefined, "pause"); // put the pause sign in the title
    document.querySelector(".ticker-element").classList.add("paused"); // the ticker element is now slowly blinking
}

export default pauseCountHandler;
