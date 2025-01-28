import { Visual } from "../../Controller.js";

// ================================================================================================

// handle clicks on "Timer", "Stopwatch", or "Until"
function handleTopControls() {
    Visual.appTopBtns.addEventListener("click", function (e) {
        if (!e.target.classList.contains("app__control-btn")) return;
        const btnClicked = e.target;
        const btnClickedType = btnClicked.textContent.trim().toLowerCase();

        const mainSections = [Visual.timerBlock, Visual.stopwatchBlock, Visual.tillBlock];
        const mainBtns = [Visual.timerBtn, Visual.stopwatchBtn, Visual.tillBtn];
        mainSections.forEach((section) => Visual.hide(section)); // hiding all other sections
        mainBtns.forEach((mainBtn) => mainBtn.classList.remove("active")); // removing .active from all top btns
        btnClicked.classList.add("active"); // adding .active to the clicked btn

        if (btnClickedType === "timer") {
            Visual.show(Visual.timerBlock); // show timer, hide all the rest
            Visual.renderTicker("timer");
            Visual.toggleQuickOptions("show");
        } else if (btnClickedType === "stopwatch") {
            Visual.show(Visual.stopwatchBlock); // show stopwatch, hide all the rest
            Visual.renderTicker("stopwatch", true); // true means render the seconds block too
            Visual.toggleQuickOptions("hide");
        } else if (btnClickedType === "until") {
            Visual.show(Visual.tillBlock); // show until, hide all the rest
            Visual.renderTicker("until");
            Visual.toggleQuickOptions("hide");
        }
    });
}

// ================================================================================================

// handle click on the color changer btn (bottom left)
function handleColorClick(handler) {
    document.querySelector(".color-changer").addEventListener("click", function (e) {
        handler();
    });
}

// ================================================================================================

// handle plus and minus btns of Hours or Minutes
function handleTickerBtns() {
    document.querySelector(".ticker-element").addEventListener("click", handleTickerBtnsCallback); // I remove it in renderMethods.js
}

// dependency of 'handleTickerBtns'
function handleTickerBtnsCallback(e) {
    if (!e.target.classList.contains("ticker-block-btn")) return;
    const clickedBtn = e.target;
    const clickedBtnType = clickedBtn.textContent.trim() === `+` ? "increase" : "decrease"; // determining clicked btn type
    const clickedItem = clickedBtn.closest(".ticker-block"); // to determine if it is a btn of Hours or Minutes
    const clickedItemType = clickedItem.classList.contains("ticker-block--hours") ? "hours" : "minutes";
    const input = clickedBtn.parentElement.previousElementSibling.querySelector("input"); // if we clicked on the plus btn in Minutes, this input is the minutes input and vice versa
    const concatted = `${clickedBtnType} ${clickedItemType}`; // concatting to handle cases
    Visual.timerVisualLogic(input, concatted); // handling the cases
}

// ================================================================================================

// handle typing in any .ticker-element input
function handleTickerInput() {
    const allTickerInputs = [...document.querySelectorAll(".ticker-element input")];
    allTickerInputs.forEach((inputEl) => {
        inputEl.addEventListener("input", handleTickerInputCallback); // I remove it in renderMethods.js
    });
}

// dependency of 'handleTickerInput'
function handleTickerInputCallback(e) {
    const acceptedValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", undefined];
    // if input was just one char, inputValue[1] returns undefined, that's why undef is in acceptedValues
    const inputValue = e.target.value;
    const replaceValue = "0";
    // making sure it doesn't contain any unaccepted characters
    if (!acceptedValues.includes(inputValue[0])) e.target.value = replaceValue + e.target.value.slice(1, 2);
    if (!acceptedValues.includes(inputValue[1])) e.target.value = e.target.value.slice(0, 1) + replaceValue;
}

// ================================================================================================

// handle start/stop btns
function handleStartStop() {
    document.querySelector(".ticker-element-commands").addEventListener("click", handleStartStopCallback); // I remove it in renderMethods.js
}

// dependency of 'handleStartStop'
function handleStartStopCallback(e) {
    if (!e.target.classList.contains("ticker-element-command")) return;
    const clickedBtn = e.target;
    const clickedBtnType = clickedBtn.textContent.trim().toLowerCase() === `start` ? "start" : "stop"; // determining clicked btn type
    if (clickedBtnType === "start") {
        const valuesArr = Visual.readValues();
        // Emitting a custom event
        const customEvent = new CustomEvent("clockstarts", { detail: { inputValues: valuesArr } });
        document.dispatchEvent(customEvent);
    } else {
        const customEvent = new CustomEvent("clockstops");
        document.dispatchEvent(customEvent);
    }
}

// ================================================================================================

// listening to my custom event 'clockstarts' that happens when I click start to start a countdown
function handleStartClick(handler) {
    document.addEventListener("clockstarts", function (e) {
        handler(e.detail.inputValues);
    });
}

// listening to my custom event 'clockstops' that happens when I click stop to stop a countdown
function handleStopClick(handler) {
    document.addEventListener("clockstops", function (e) {
        handler();
    });
}

// ================================================================================================

// handle clicks on quick options
function handleQuickOptions() {
    document.querySelector(".ticker-element-options").addEventListener("click", handleQuickOptionsCallback); // I remove it in renderMethods.js
}

function handleQuickOptionsCallback(e) {
    if (!e.target.classList.contains("ticker-element-option")) return;
    const clickedBtn = e.target;
    console.log(clickedBtn);
}

// ================================================================================================

export {
    handleTopControls,
    handleColorClick,
    handleTickerBtns,
    handleStartStop,
    handleTickerBtnsCallback,
    handleStartStopCallback,
    handleQuickOptions,
    handleQuickOptionsCallback,
    handleTickerInput,
    handleTickerInputCallback,
    handleStartClick,
    handleStopClick,
};
