import { Visual } from "../../Controller.js";
import { paintRollerIcon } from "./icons.js";
import { handleTickerBtnsCallback, handleStartStopCallback } from "./eventHandlers.js";

// ================================================================================================

// rendering the big ticker element: hours, minutes and maybe seconds too
function renderTicker(renderWhere, secondsFlag = false) {
    if (document.querySelector(".ticker-element")) {
        document.querySelector(".ticker-element").removeEventListener("click", handleTickerBtnsCallback); // removing the event listener
        document.querySelector(".ticker-element").remove(); // removing before rendering/re-rendering
    }

    const div = document.createElement("div");
    div.classList.add("ticker-element");

    const elements = secondsFlag ? ["Hours", "Minutes", "Seconds"] : ["Hours", "Minutes"]; // if secondsFlag is true, render seconds block too

    const html = elements
        .map((elName) => {
            return `<div class="ticker-block ticker-block--${elName.toLowerCase()}">
        <div class="ticker-block-label">${elName}</div>
        <div class="ticker-block-input">
            <input type="text" min="0" value="00">
        </div>
        <div class="ticker-block-btns">
            <button class="ticker-block-btn ticker-block-btn--decrease">-</button>
            <button class="ticker-block-btn ticker-block-btn--increase">+</button>
        </div>
        </div>`;
        })
        .join("");

    div.innerHTML = html;

    if (renderWhere === "timer") Visual.timerBlock.appendChild(div);
    else if (renderWhere === "stopwatch") Visual.stopwatchBlock.appendChild(div);
    else if (renderWhere === "till" || renderWhere === "until") Visual.tillBlock.appendChild(div);

    renderStartStopBtns(); // rendering start stop btns

    renderQuickOptions([`3m 30s`, `1h`]);
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
    if (document.querySelector(".ticker-element-options")) document.querySelector(".ticker-element-options").remove(); // removing before rendering/re-rendering

    const div = document.createElement("div");
    div.classList.add("ticker-element-options");

    const html = optionsArr
        .map((option, i) => {
            if (i === 0) return `<span>Quick Options:</span><button class="ticker-element-option">${option}</button>`;
            return `<button class="ticker-element-option">${option}</button>`;
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

export { renderTicker, renderQuickOptions, renderColorBtn };
