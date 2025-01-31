import { Visual } from "../../Controller.js";

// ================================================================================================

// handle clicks on "Timer", "Stopwatch", or "Until"
function handleTopControls(handler) {
    Visual.appTopBtns.addEventListener("click", function (e) {
        if (!e.target.classList.contains("app__control-btn")) return;
        const btnClicked = e.target;
        const btnClickedType = btnClicked.textContent.trim().toLowerCase();

        const mainSections = [Visual.timerBlock, Visual.stopwatchBlock, Visual.tillBlock];
        const mainBtns = [Visual.timerBtn, Visual.stopwatchBtn, Visual.tillBtn];
        mainSections.forEach((section) => Visual.hide(section)); // hiding all sections: timer, stopwatch and until
        mainBtns.forEach((mainBtn) => mainBtn.classList.remove("active")); // removing .active from all top btns
        btnClicked.classList.add("active"); // adding .active to the clicked btn

        if (btnClickedType === "timer") {
            Visual.show(Visual.timerBlock); // show the timer section
            Visual.renderTicker("timer"); // render ticker
            Visual.toggleQuickOptions("show"); // show quick options
            handler(btnClickedType);
        } else if (btnClickedType === "stopwatch") {
            Visual.show(Visual.stopwatchBlock); // show stopwatch section
            Visual.renderTicker("stopwatch", true); // true means render the seconds block too
            Visual.toggleQuickOptions("hide"); // hide quick options
            handler(btnClickedType);
        } else if (btnClickedType === "until") {
            Visual.show(Visual.tillBlock); // show until section
            Visual.renderTicker("until"); // render ticker
            Visual.toggleQuickOptions("hide"); // hide quick options
            handler(btnClickedType);
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

// handle plus and minus UI btns of Hours or Minutes -- or save to quick options btn
function handleTickerBtns() {
    document.querySelector(".ticker-element").addEventListener("click", handleTickerBtnsCallback); // I remove it in renderMethods.js
}

// dependency of 'handleTickerBtns'
function handleTickerBtnsCallback(e) {
    const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until

    if (!e.target.classList.contains("ticker-block-btn") && !e.target.classList.contains("ticker-block-btn-save")) return;
    const clickedBtn = e.target;

    if (clickedBtn.classList.contains("ticker-block-btn-save")) {
        // it was a click on "save to quick options"
        const values = Visual.readValues(); // reading the input values
        const customEvent = new CustomEvent("addoption", { detail: { inputValues: values } }); // creating a custom event
        document.dispatchEvent(customEvent); // dispatching it
    } else {
        // it was a click on plus or minus UI btns of Hours or Minutes
        const clickedBtnType = clickedBtn.textContent.trim() === `+` ? "increase" : "decrease"; // determining clicked btn type
        const clickedItem = clickedBtn.closest(".ticker-block"); // to determine if it is a btn of Hours or Minutes
        const clickedItemType = clickedItem.classList.contains("ticker-block--hours") ? "hours" : "minutes";
        const input = clickedBtn.parentElement.previousElementSibling.querySelector("input"); // if we clicked on the plus btn in Minutes, this input is the minutes input and vice versa

        const concatted = `${clickedBtnType} ${clickedItemType}`; // concatting to handle cases
        Visual.timerVisualLogic(input, concatted); // handling the cases

        if (input.value !== "00")
            Visual.toggleOptionSaveBtn("show"); // "save to quick options" only shows if the input value is not 0
        else Visual.toggleOptionSaveBtn("hide");

        if (activeBlock === "until") {
            // when in Until, hours cannot be more than 23
            const hoursInput = document.querySelector(".ticker-block--hours input");
            if (+hoursInput.value > 23) document.querySelector(".ticker-block--hours input").value = `00`;
        }
    }
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
    const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until
    const acceptedValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", undefined]; // if input was just one char, inputValue[1] returns undefined, that's why undef is in acceptedValues

    const inputValue = e.target.value;
    const inputType = e.target.closest(".ticker-block").classList.contains("ticker-block--minutes") ? "minutes" : "hours"; // determining if it's an input of Hours or Minutes
    if (inputType === "minutes" && +inputValue > 59) e.target.value = "00"; // minutes cannot be more than 59
    const replaceValue = "0";
    // making sure it doesn't contain any unaccepted characters
    if (!acceptedValues.includes(inputValue[0])) e.target.value = replaceValue + inputValue[1];
    if (!acceptedValues.includes(inputValue[1])) e.target.value = inputValue[0] + replaceValue;

    if (e.target.value !== "00" && e.target.value !== "0")
        Visual.toggleOptionSaveBtn("show"); // if input is 0, 'save to quick options' btn is hidden
    else Visual.toggleOptionSaveBtn("hide");

    if (activeBlock === "until") {
        // when in Until, hours cannot be more than 23
        const hoursInput = document.querySelector(".ticker-block--hours input");
        if (+hoursInput.value > 23) document.querySelector(".ticker-block--hours input").value = `00`;
    }
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

    let clickedBtnType; // determining clicked btn type below
    if (clickedBtn.textContent.trim().toLowerCase() === `start`) clickedBtnType = "start";
    else if (clickedBtn.textContent.trim().toLowerCase() === `stop`) clickedBtnType = "stop";
    else if (clickedBtn.textContent.trim().toLowerCase() === `pause`) clickedBtnType = "pause";
    else if (clickedBtn.textContent.trim().toLowerCase() === `resume`) clickedBtnType = "resume";

    const valuesArr = Visual.readValues(); // getting the values of inputs

    if (clickedBtnType === "start") {
        const customEvent = new CustomEvent("clockstarts", { detail: { inputValues: valuesArr } }); // creating a custom event
        document.dispatchEvent(customEvent); // dispatching it
    } else if (clickedBtnType === "pause") {
        const customEvent = new CustomEvent("clockpauses", { detail: { inputValues: valuesArr } });
        document.dispatchEvent(customEvent);
        Visual.changeStartBtnText("resume"); // changing the text of the Start btn
    } else if (clickedBtnType === "resume") {
        const customEvent = new CustomEvent("clockresumes", { detail: { inputValues: valuesArr } });
        document.dispatchEvent(customEvent);
        Visual.changeStartBtnText("pause");
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

// listening to my custom event 'clockpauses' that happens when I click pause to pause a countdown
function handlePauseClick(handler) {
    document.addEventListener("clockpauses", function (e) {
        handler(e.detail.inputValues);
    });
}

// listening to my custom event 'clockresumes' that happens when I click resume to resume a countdown
function handleResumeClick(handler) {
    document.addEventListener("clockresumes", function (e) {
        handler(e.detail.inputValues);
    });
}

// listening to my custom event 'addoption' that happens when I click 'Save to Quick Options'
function handleAddingOption(handler) {
    document.addEventListener("addoption", function (e) {
        handler(e.detail.inputValues);
    });
}

// ================================================================================================

// handle clicks on quick options
function handleQuickOptions(handler) {
    Visual.quickOptionsHandler = handler; // storing the ref to the handler fn
    document.querySelector(".ticker-element-options").addEventListener("click", handleQuickOptionsCallback); // I remove it in renderMethods.js
}

function handleQuickOptionsCallback(e) {
    if (!e.target.classList.contains("ticker-element-option") && !e.target.classList.contains("ticker-element-option-title"))
        return;
    const clickedBtn = e.target.closest("button");
    const clickedTag = e.target.tagName;
    let actionName = "";
    if (clickedTag === "BUTTON") actionName = "start";
    if (clickedTag === "SPAN") actionName = "remove";
    Visual.quickOptionsHandler(actionName, clickedBtn);
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
    handlePauseClick,
    handleResumeClick,
    handleAddingOption,
};
