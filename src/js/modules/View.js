// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

import { renderTicker, renderQuickOptions, renderColorBtn } from "./view-dependencies/renderMethods.js";
import {
    handleTopControls,
    handleColorClick,
    handleTickerBtns,
    handleStartStop,
    handleQuickOptions,
} from "./view-dependencies/eventHandlers.js";

// ================================================================================================

class View {
    constructor() {
        this.timerBtn = document.querySelector("#timer-btn");
        this.stopwatchBtn = document.querySelector("#stopwatch-btn");
        this.tillBtn = document.querySelector("#till-btn");
        this.timerBlock = document.querySelector(".app__timer");
        this.stopwatchBlock = document.querySelector(".app__stopwatch");
        this.tillBlock = document.querySelector(".app__till");
        this.appBlock = document.querySelector(".app");
        this.appBottomControlsEl = document.querySelector(".app__bottom-controls");
        this.appTopBtns = document.querySelector(".app__controls");
        // this.colorChangerEl = document.querySelector(".color-changer");
    }

    // ================================================================================================

    renderTicker(renderWhere, secondsFlag) {
        renderTicker(renderWhere, secondsFlag);
        this.handleTickerBtns();
        this.handleStartStop();
        this.handleQuickOptions();
    }

    // ================================================================================================

    handleTopControls() {
        handleTopControls();
    }

    // ================================================================================================

    // remove .hidden from an element
    show = (el) => el.classList.remove("hidden");

    // ================================================================================================

    // add .hidden to an element
    hide = (el) => el.classList.add("hidden");

    // ================================================================================================

    // toggle the visibility of .ticker-element-options
    toggleQuickOptions(showFlag) {
        const block = document.querySelector(".ticker-element-options");
        if (showFlag === "show") block.classList.remove("hidden");
        else block.classList.add("hidden");
    }

    // ================================================================================================

    // rendering the color changer btn (bottom left)
    renderColorBtn() {
        renderColorBtn();
    }

    // ================================================================================================

    handleColorClick(handler) {
        handleColorClick(handler);
    }

    // ================================================================================================

    handleTickerBtns() {
        handleTickerBtns();
    }

    // ================================================================================================

    handleStartStop() {
        handleStartStop();
    }

    // ================================================================================================

    handleQuickOptions() {
        handleQuickOptions();
    }

    // ================================================================================================
}

export default View;
