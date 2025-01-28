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
}
init();

// ================================================================================================

// running event listeners
function runEventListeners() {
    Visual.handleTopControls(); // handle clicks on "Timer", "Stopwatch", or "Until"
    Visual.handleStartClick(startCountHandler); // listening to my custom event 'clockstarts' that happens when I click start to start a countdown
    Visual.handleStopClick(stopCountHandler); // listening to my custom event 'clockstops' that happens when I click stop to stop a countdown
}

// ================================================================================================

function changeAccentColor() {
    const answer = prompt("Type your new interface color:");
    if (answer === null) return;
    if (answer && answer.trim().length < 3) return;
    console.log(`change the accent color to:`, answer);
}

// ================================================================================================

function startCountHandler(inputValuesArr) {
    const asNumbers = inputValuesArr.map((el) => +el);

    if (asNumbers.reduce((a, b) => a + b, 0) === 0) {
        return alert("You cannot start a timer for 0 hours 0 minutes"); // showing a message if I'm starting a countdown with all zeroes as values
    }

    Logic.setTimerCurrentValues(asNumbers); // setting timer values in state
    Logic.startInterval(Visual.showTicking); // Logic.startInterval is an interval timer that runs every second
}

// ================================================================================================

function stopCountHandler() {
    Logic.stopTimer(); // stopping all interval timers
    document.querySelector(".ticker-element").classList.remove("working"); // decrease the size of the ticker element
    Visual.toggleInterfaceDimmer("show"); // bring back the interface
    Visual.resetInputValues(); // reset in the UI
    Visual.toggleSecondsBlock("hide"); // hiding the seconds block
    Logic.resetTimerValues(); // reset in state
    Visual.updateTitle(undefined, true); // put 'Ticker' back in the title
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners };
