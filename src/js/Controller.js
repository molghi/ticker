// Controller is the grand orchestrator of the entire project: it initialises Model, View, and uses all methods defined there to perform all actions.

"use strict";

import "../styles/main.scss";

// instantiating main classes
import Model from "./modules/Model.js";
import View from "./modules/View.js";
const Logic = new Model();
const Visual = new View();

// ================================================================================================

// runs on app start
function init() {
    Visual.renderTicker("timer");
    Visual.renderColorBtn();
    Visual.handleColorClick(changeAccentColor);
    runEventListeners();

    // fetching quick options from LS/state
    const savedQuickOptions = Logic.getTimerQuickOptions();
    if (savedQuickOptions) {
        Visual.renderQuickOptions(savedQuickOptions);
        Visual.handleQuickOptions(quickOptionsHandler); // handle clicks on quick options
    }

    // fetching accent color from LS/state
    const accentColor = Logic.returnAccentColor();
    if (accentColor) Visual.setAccentColor(accentColor);
}
init();

// ================================================================================================

// running event listeners
function runEventListeners() {
    Visual.handleTopControls(topControlsHandler); // handle clicks on "Timer", "Stopwatch", or "Until"
    Visual.handleStartClick(startCountHandler); // listening to my custom event 'clockstarts' that happens when I click start to start a countdown
    Visual.handleStopClick(stopCountHandler); // listening to my custom event 'clockstops' that happens when I click stop to stop a countdown
    Visual.handlePauseClick(pauseCountHandler); // listening to my custom event 'clockpauses' that happens when I click pause to pause a countdown
    Visual.handleResumeClick(resumeCountHandler); // listening to my custom event 'clockresumes' that happens when I click resume to resume a countdown
    Visual.handleAddingOption(addQuickOption); // listening to my custom event 'addoption' that happens when I click 'Save to Quick Options'
}

// ================================================================================================

// handle clicks on "Timer", "Stopwatch", or "Until"
function topControlsHandler(btnClickedType) {
    if (btnClickedType !== "until") return Visual.removeCurrentTime();
    const [nowYear, nowMonth, nowDate, nowHours, nowMinutes, now] = Logic.getNowTime();
    Visual.renderCurrentTime(nowHours, nowMinutes);
    Logic.everyMinTimer(() => {
        const [nowYear, nowMonth, nowDate, nowHours, nowMinutes, now] = Logic.getNowTime();
        Visual.renderCurrentTime(nowHours, nowMinutes);
    });
}

// ================================================================================================

// changing the accent color
function changeAccentColor() {
    const answer = prompt("Type your new interface color:");
    if (answer === null) return;
    if (answer && answer.trim().length < 3) return;
    const checkedColor = Logic.checkColor(answer);
    Visual.setAccentColor(checkedColor);
    Logic.changeAccentColor(checkedColor);
}

// ================================================================================================

// happens when I click start to start a countdown
function startCountHandler(inputValuesArr) {
    const asNumbers = inputValuesArr.map((el) => +el); // transforming into numbers
    const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until

    if (activeBlock === "timer" && asNumbers.reduce((a, b) => a + b, 0) === 0) {
        return alert("You cannot start a timer for 0 hours 0 minutes"); // showing a message if I'm starting a countdown with all zeroes as values
    } else if (activeBlock === "timer") {
        Logic.setTimerCurrentValues(asNumbers); // setting timer values in state
        Logic.startInterval(Visual.showTicking); // Logic.startInterval is an interval timer that runs every second
        Visual.changeStartBtnText("pause"); // changing the text of the Start btn
        Visual.toggleOptionSaveBtn("hide"); // hiding the Save This Option btn
        Logic.pushTimerSetTime(asNumbers); // pushing the set time to show the History string
        const setTime = Logic.getTimerSetTime(); // getting the string of the set time
        const historyString = `Timer for <span>${setTime}</span> is running`; // composing the text for history-box
        Visual.updateHistoryBox(historyString); // updating history box
    } else if (activeBlock === "stopwatch") {
        Logic.resetStopwatchValues(); // resetting values to all zeroes
        Logic.startIntervalStopwatch(Visual.showTicking); // start ticking
        Visual.changeStartBtnText("pause"); // changing the text of the Start btn
        const historyString = "Stopwatch is running";
        Visual.updateHistoryBox(historyString); // updating history box
    } else if (activeBlock === "until") {
        const values = Visual.readValues().slice(0, 2); // getting the current input values; slicing because it returns the seconds value too which is of no need here
        const [hours, minutes] = Logic.calcTimeDifference(values);
        Logic.setUntilTime(values);
        // starting a usual timer below:
        Logic.setTimerCurrentValues([hours, minutes, 0]); // setting timer values in state
        Logic.startInterval(Visual.showTicking); // Logic.startInterval is an interval timer that runs every second
        Visual.changeStartBtnText("pause"); // changing the text of the Start btn
        Visual.toggleOptionSaveBtn("hide"); // hiding the Save This Option btn
        Visual.removeCurrentTime();
        const setTime = Logic.getUntilTime().map((x) => +x);
        const historyString = `Counting to <span>${setTime[0]}:${setTime[1].toString().padStart(2, 0)}</span>`; // getting the string of the set time
        Visual.updateHistoryBox(historyString); // updating history box
    }

    Logic.setTimerIsRunning(); // setting that a timer is running, switching false to true
}

// remove it: just a test
function logger([h, m, s]) {
    console.log(h, m, s);
}

// ================================================================================================

// happens when I click stop to stop a countdown
function stopCountHandler() {
    if (!Logic.getTimerIsRunning()) return; // if no timer is running, early return

    const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until
    const values = Visual.readValues().map((x) => +x);
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
        Visual.toggleSecondsBlock("show");
        Visual.updateHistoryBox(`Stopwatch was aborted after ${historyString}`);
    } else if (activeBlock === "until") {
        topControlsHandler("until"); // rendering the current time under the Until btn
        console.log(Logic.getState());
        const setTime = Logic.getUntilTime().map((x) => +x);
        const historyBoxString = `Counting to <span>${setTime[0]}:${setTime[1]
            .toString()
            .padStart(2, 0)}</span> was aborted with ${historyString} remaining`; // getting the string of the set time
        Visual.updateHistoryBox(historyBoxString); // updating history box
    } else if (activeBlock === "timer") {
        Visual.updateHistoryBox(`Timer for <span>${Logic.getTimerSetTime()}</span> was stopped with ${historyString} remaining`);
    }

    Logic.setTimerIsRunning(); // setting that no timer is running, switching true to false
}

// ================================================================================================

// happens when I click pause to pause a countdown
function pauseCountHandler(inputValuesArr) {
    const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until
    const values = Visual.readValues().map((x) => +x);

    if (activeBlock === "until") {
        Logic.setUntilPauseTime(new Date().toISOString());
        const setTime = Logic.getUntilTime().map((x) => +x);
        const historyBoxString = `Counting to <span>${setTime[0]}:${setTime[1].toString().padStart(2, 0)}</span> was paused`; // getting the string of the set time
        Visual.updateHistoryBox(historyBoxString); // updating history box
    } else if (activeBlock === "stopwatch") {
        Visual.updateHistoryBox(`Stopwatch was paused`);
    } else if (activeBlock === "timer") {
        Visual.updateHistoryBox(`Timer for <span>${Logic.getTimerSetTime()}</span> was paused`);
    }

    Logic.stopTimer(); // stopping all interval timers
    Visual.updateTitle(undefined, "pause"); // put the pause sign in the title
    document.querySelector(".ticker-element").classList.add("paused"); // the ticker element is now slowly blinking
}

// ================================================================================================

// happens when I click resume to resume a countdown
function resumeCountHandler(inputValuesArr) {
    const asNumbers = inputValuesArr.map((el) => +el);
    const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until

    document.querySelector(".ticker-element").classList.remove("paused"); // removing the blinking class

    if (activeBlock === "timer") {
        Logic.setTimerCurrentValues(asNumbers); // setting timer values in state
        Logic.startInterval(Visual.showTicking); // Logic.startInterval is an interval timer that runs every second
        Visual.updateHistoryBox(`Timer for <span>${Logic.getTimerSetTime()}</span> is running`);
    } else if (activeBlock === "stopwatch") {
        Logic.startIntervalStopwatch(Visual.showTicking); // resuming
        Visual.updateHistoryBox(`Stopwatch is running`);
    } else if (activeBlock == "until") {
        console.log(`resume until`);
        console.log(Logic.getState());

        const pauseTimeMinute = new Date(Logic.getUntilPauseTime()).getMinutes();
        const nowMinute = new Date().getMinutes();

        if (pauseTimeMinute !== nowMinute) {
            const [hours, minutes] = Logic.calcTimeDifference(Logic.getUntilTime());
            Logic.setTimerCurrentValues([hours, minutes, 0]); // setting timer values in state
        }

        Logic.startInterval(Visual.showTicking); // Logic.startInterval is an interval timer that runs every second
        Visual.changeStartBtnText("pause"); // changing the text of the Start btn
        Visual.toggleOptionSaveBtn("hide"); // hiding the Save This Option btn

        const setTime = Logic.getUntilTime().map((x) => +x);
        const historyString = `Counting to <span>${setTime[0]}:${setTime[1].toString().padStart(2, 0)}</span>`; // getting the string of the set time
        Visual.updateHistoryBox(historyString); // updating history box
    }
}

// ================================================================================================

// happens when I click 'Save to Quick Options'
function addQuickOption(inputValues) {
    Logic.addQuickOption(inputValues);
    const allQuickOptions = Logic.getTimerQuickOptions();
    console.log(allQuickOptions);
    Visual.renderQuickOptions(allQuickOptions);
}

// ================================================================================================

// handle clicks on quick options
function quickOptionsHandler(actionType, btnEl) {
    if (actionType === "remove") {
        // removing this quick option
        const optionValue = btnEl.dataset.time;
        Logic.removeQuickOption(optionValue); // removing from the state and LS
        btnEl.remove(); // removing from the UI
    }
    if (actionType === "start") {
        // starting a countdown with this option
        const asNumbers = btnEl.dataset.time.split(",");
        asNumbers.push("0");
        startCountHandler(asNumbers);
    }
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners };
