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
    Visual.renderTicker("timer"); // rendering the initial ticker element
    Visual.renderColorBtn(); // rendering the color changer btn
    Visual.handleColorClick(changeAccentColor); // listening to the clicks on it

    runEventListeners();

    // fetching quick options from LS/state
    const savedQuickOptions = Logic.getTimerQuickOptions();
    if (savedQuickOptions && savedQuickOptions.length > 0) {
        Visual.renderQuickOptions(savedQuickOptions); // render quick options
        Visual.handleQuickOptions(quickOptionsHandler); // listening to the clicks on quick options
    } else {
        // if LS for Quick Options is empty, push a few options there and render them
        const defaultQuickOptions = [
            ["00", "05", "00"],
            ["00", "15", "00"],
            ["00", "30", "00"],
            ["00", "45", "00"],
            ["01", "00", "00"],
            ["01", "30", "00"],
            ["02", "00", "00"],
        ];
        defaultQuickOptions.forEach((opt) => Logic.addQuickOption(opt));
        Visual.renderQuickOptions(Logic.getTimerQuickOptions());
    }

    // fetching accent color from LS/state and setting it if it exists
    const accentColor = Logic.returnAccentColor();
    if (accentColor) Visual.setAccentColor(accentColor);
}
init();

// ================================================================================================

// running main event listeners
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
        const savedQuickOptions = Logic.getTimerQuickOptions(); // if what was clicked on is timer, fetching quick options from LS/state
        if (savedQuickOptions && savedQuickOptions.length > 0) Visual.handleQuickOptions(quickOptionsHandler); // listening to the clicks on quick options
    }
    if (btnClickedType !== "until") {
        Visual.removeCurrentTime(); // removing the current time element
        Logic.stopCurrentTimeTimer(); // stopping the current time timer
        return;
    }

    const [nowYear, nowMonth, nowDate, nowHours, nowMinutes, now] = Logic.getNowTime(); // getting the now time
    Visual.renderCurrentTime(nowHours, nowMinutes); // rendering the current time element and starting the timer to update it every min
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
    const checkedColor = Logic.checkColor(answer); // checking and returning a safe color
    Visual.setAccentColor(checkedColor); // changing in the UI
    Logic.changeAccentColor(checkedColor); // changing in state/LS
}

// ================================================================================================

// happens when I click 'Save to Quick Options'
function addQuickOption(inputValues) {
    Logic.addQuickOption(inputValues); // adding new
    const allQuickOptions = Logic.getTimerQuickOptions(); // getting all
    Visual.renderQuickOptions(allQuickOptions); // and re-rendering them
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
        const asNumbers = btnEl.dataset.time.split(","); // getting the array of this timer values (hours and minutes)
        asNumbers.push("0"); // 0 for seconds
        startCountHandler(asNumbers); // starting a countdown
    }
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners, topControlsHandler };
