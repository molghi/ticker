// Controller is the grand orchestrator of the entire project: it initialises Model, View, and uses all methods defined there to perform all actions.

"use strict";

import "../styles/main.scss";
// import myImageNameWithoutExtension from '../img/myImageNameWithExtension'  // myImageNameWithoutExtension will be the src

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
}

// ================================================================================================

function changeAccentColor() {
    const answer = prompt("Type your new interface color:");
    if (answer === null) return;
    if (answer && answer.trim().length < 3) return;
    console.log(`change the accent color to:`, answer);
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners };
