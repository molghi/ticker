// Controller is the grand orchestrator of the entire project: it initialises Model, View, and uses all methods defined there to perform all actions.

"use strict";

import "../styles/main.scss";

// instantiating main classes
import Model from "./modules/Model.js";
import View from "./modules/View.js";
const Logic = new Model();
const Visual = new View();

// importing dependencies
import startCountHandler from "./modules/controller-dependencies/startCountHandler.js";
import stopCountHandler from "./modules/controller-dependencies/stopCountHandler.js";
import pauseCountHandler from "./modules/controller-dependencies/pauseCountHandler.js";
import resumeCountHandler from "./modules/controller-dependencies/resumeCountHandler.js";
import KeyCommands from "./modules/controller-dependencies/keyCommands.js";

// ================================================================================================

// runs on app start
function init() {
    Visual.renderTicker("timer");
    Visual.renderColorBtn();
    Visual.handleColorClick(changeAccentColor);
    runEventListeners();

    // fetching quick options from LS/state
    const savedQuickOptions = Logic.getTimerQuickOptions();
    if (savedQuickOptions && savedQuickOptions.length > 0) {
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
    if (btnClickedType === "timer") {
        const savedQuickOptions = Logic.getTimerQuickOptions(); // fetching quick options from LS/state
        if (savedQuickOptions && savedQuickOptions.length > 0) Visual.handleQuickOptions(quickOptionsHandler); // handle clicks on quick options
    }
    if (btnClickedType !== "until") {
        Visual.removeCurrentTime(); // removing the element
        Logic.stopCurrentTimeTimer(); // stopping the timer
        return;
    }

    const [nowYear, nowMonth, nowDate, nowHours, nowMinutes, now] = Logic.getNowTime();
    Visual.renderCurrentTime(nowHours, nowMinutes); // rendering
    Logic.everyMinTimer(() => {
        const [nowYear, nowMonth, nowDate, nowHours, nowMinutes, now] = Logic.getNowTime();
        Visual.renderCurrentTime(nowHours, nowMinutes); // and re-rendering
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
    console.log(actionType, btnEl);
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
export { Logic, Visual, runEventListeners, topControlsHandler };
