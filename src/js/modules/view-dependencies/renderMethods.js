import { Visual } from "../../Controller.js";
import { paintRollerIcon } from "./icons.js";
import {
    handleTickerBtnsCallback,
    handleStartStopCallback,
    handleQuickOptionsCallback,
    handleTickerInputCallback,
} from "./eventHandlers.js";

// ================================================================================================

// rendering the big ticker element: hours, minutes and maybe seconds too
function renderTicker(renderWhere, secondsFlag = false) {
    if (document.querySelector(".ticker-element")) {
        // removing event listeners first
        document.querySelector(".ticker-element").removeEventListener("click", handleTickerBtnsCallback);
        [...document.querySelectorAll(".ticker-element input")].forEach((inputEl) =>
            inputEl.removeEventListener("input", handleTickerInputCallback)
        );
        document.querySelector(".ticker-element").remove(); // removing the el before rendering/re-rendering
    }

    const div = document.createElement("div");
    div.classList.add("ticker-element");

    // const elements = secondsFlag ? ["Hours", "Minutes", "Seconds"] : ["Hours", "Minutes"]; // if secondsFlag is true, render seconds block too
    const elements = ["Hours", "Minutes", "Seconds"];

    let html = elements.map((elName) => {
        return `<div class="ticker-block ticker-block--${elName.toLowerCase()}">
        <div class="ticker-block-label">${elName}</div>
        <div class="ticker-block-input">
            <input type="text" min="0" value="00" maxlength="2">
        </div>
        <div class="ticker-block-btns">
            <button class="ticker-block-btn ticker-block-btn--decrease">-</button>
            <button class="ticker-block-btn ticker-block-btn--increase">+</button>
        </div>
        </div>`;
    });

    html.push(`<button class="ticker-block-btn-save hidden">Save to Quick Options</button>`); // pushing the btn last

    div.innerHTML = html.join("");

    if (renderWhere === "timer") Visual.timerBlock.appendChild(div);
    else if (renderWhere === "stopwatch") Visual.stopwatchBlock.appendChild(div);
    else if (renderWhere === "till" || renderWhere === "until") Visual.tillBlock.appendChild(div);

    if (!secondsFlag) document.querySelector(".ticker-block--seconds").classList.add("hidden");

    renderStartStopBtns(); // rendering start stop btns

    // renderQuickOptions([]);
}

// ================================================================================================

// dependency of 'renderTicker'
function renderStartStopBtns() {
    if (document.querySelector(".ticker-element-commands")) {
        document.querySelector(".ticker-element-commands").removeEventListener("click", handleStartStopCallback); // removing the event listener
        document.querySelector(".ticker-element-commands").remove(); // removing before rendering/re-rendering
    }

    const div = document.createElement("div");
    div.classList.add("ticker-element-commands");

    const btnNames = ["Start", "Stop"];
    const html = btnNames
        .map(
            (btnName) =>
                `<button class="ticker-element-command ticker-element-command--${btnName.toLowerCase()}">${btnName}</button>`
        )
        .join("");

    div.innerHTML = html;

    Visual.appBottomControlsEl.appendChild(div);
}

// ================================================================================================

function renderQuickOptions(optionsArr) {
    if (document.querySelector(".ticker-element-options")) {
        document.querySelector(".ticker-element-options").removeEventListener("click", handleQuickOptionsCallback);
        document.querySelector(".ticker-element-options").remove(); // removing before rendering/re-rendering
    }

    const div = document.createElement("div");
    div.classList.add("ticker-element-options");

    const html = optionsArr
        .map((option, i) => {
            let content = "";
            if (option[0] !== 0) content = `${option[0]}h`;
            if (option[1] !== 0) content += ` ${option[1]}m`;
            if (i === 0)
                return `<span class="ticker-element-options-title">Quick Options:</span><button data-time="${option}" class="ticker-element-option"><span class="ticker-element-option-title">Remove</span>${content}</button>`;
            return `<button data-time="${option}" class="ticker-element-option"><span class="ticker-element-option-title">Remove</span>${content}</button>`;
        })
        .join("");

    div.innerHTML = html;

    Visual.appBottomControlsEl.appendChild(div);
}

// ================================================================================================

function renderColorBtn() {
    const div = document.createElement("div");
    div.classList.add("color-changer");
    div.setAttribute("title", "Change the accent color of the interface");

    const html = `<div>${paintRollerIcon}</div>`;

    div.innerHTML = html;

    document.body.appendChild(div);
}

// ================================================================================================

function renderCurrentTime(hours, minutes) {
    if (document.querySelector(".current-time")) document.querySelector(".current-time").remove();
    const span = document.createElement("span");
    span.classList.add("current-time");
    span.innerHTML = `Now: ${hours}<span>:</span>${minutes.toString().padStart(2, 0)}`;
    Visual.appTopBtns.appendChild(span);
}

// ================================================================================================

function renderProgressBar() {
    Visual.removeProgressBar(); // removing (if any) before rendering

    const div = document.createElement("div");
    div.classList.add("progress-bar");
    div.innerHTML = `<div></div>`;
    Visual.sectionEl.appendChild(div);
}

// ================================================================================================

export { renderTicker, renderQuickOptions, renderColorBtn, renderCurrentTime, renderProgressBar };
