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
    Visual.handleTopControls(); // handle clicks on "Timer", "Stopwatch", or "Until"
    Visual.handleStartClick(startCountHandler); // listening to my custom event 'clockstarts' that happens when I click start to start a countdown
    Visual.handleStopClick(stopCountHandler); // listening to my custom event 'clockstops' that happens when I click stop to stop a countdown
    Visual.handlePauseClick(pauseCountHandler); // listening to my custom event 'clockpauses' that happens when I click pause to pause a countdown
    Visual.handleResumeClick(resumeCountHandler); // listening to my custom event 'clockresumes' that happens when I click resume to resume a countdown
    Visual.handleAddingOption(addQuickOption); // listening to my custom event 'addoption' that happens when I click 'Save to Quick Options'
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
    const activeBlock = [...document.querySelectorAll(".app__controls button")]
        .find((el) => el.classList.contains("active"))
        .textContent.toLowerCase(); // finding what block is active now: timer, stopwatch or until

    if (activeBlock === "timer" && asNumbers.reduce((a, b) => a + b, 0) === 0) {
        return alert("You cannot start a timer for 0 hours 0 minutes"); // showing a message if I'm starting a countdown with all zeroes as values
    } else if (activeBlock === "timer") {
        Logic.setTimerCurrentValues(asNumbers); // setting timer values in state
        Logic.startInterval(Visual.showTicking); // Logic.startInterval is an interval timer that runs every second
        Visual.changeStartBtnText("pause");
        Visual.toggleOptionSaveBtn("hide");
    } else if (activeBlock === "stopwatch") {
        Logic.resetStopwatchValues();
        Logic.startIntervalStopwatch(Visual.showTicking);
        Visual.changeStartBtnText("pause");
    }
}

function logger([h, m, s]) {
    console.log(h, m, s);
}

// ================================================================================================

// happens when I click stop to stop a countdown
function stopCountHandler() {
    const activeBlock = [...document.querySelectorAll(".app__controls button")]
        .find((el) => el.classList.contains("active"))
        .textContent.toLowerCase(); // finding what block is active now: timer, stopwatch or until

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
    }
}

// ================================================================================================

// happens when I click pause to pause a countdown
function pauseCountHandler(inputValuesArr) {
    Logic.stopTimer(); // stopping all interval timers
    Visual.updateTitle(undefined, "pause"); // put the pause sign in the title
    document.querySelector(".ticker-element").classList.add("paused"); // the ticker element is now slowly blinking
}

// ================================================================================================

// happens when I click resume to resume a countdown
function resumeCountHandler(inputValuesArr) {
    const asNumbers = inputValuesArr.map((el) => +el);
    const activeBlock = [...document.querySelectorAll(".app__controls button")]
        .find((el) => el.classList.contains("active"))
        .textContent.toLowerCase(); // finding what block is active now: timer, stopwatch or until

    document.querySelector(".ticker-element").classList.remove("paused"); // removing the blinking class

    if (activeBlock === "timer") {
        Logic.setTimerCurrentValues(asNumbers); // setting timer values in state
        Logic.startInterval(Visual.showTicking); // Logic.startInterval is an interval timer that runs every second
    } else if (activeBlock === "stopwatch") {
        console.log(`resume stopwatch`);
        console.log(Logic.getState().stopwatch);
        console.log(asNumbers);
        Logic.startIntervalStopwatch(Visual.showTicking);
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
