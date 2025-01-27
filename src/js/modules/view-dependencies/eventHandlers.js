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
    document.querySelector(".ticker-element").addEventListener("click", handleTickerBtnsCallback);
}

// dependency of 'handleTickerBtns'
function handleTickerBtnsCallback(e) {
    if (!e.target.classList.contains("ticker-block-btn")) return;
    const clickedBtn = e.target;
    const clickedBtnType = clickedBtn.textContent.trim() === `+` ? "increase" : "decrease"; // determining clicked btn type
    const clickedItem = clickedBtn.closest(".ticker-block"); // to determine if it is a btn of Hours or Minutes
    const clickedItemType = clickedItem.classList.contains("ticker-block--hours") ? "hours" : "minutes";
    const inputValue = clickedBtn.parentElement.previousElementSibling.querySelector("input").value; // getting the input value
    console.log(`btn clicked:`, clickedBtnType);
    console.log(`clicked on:`, clickedItemType);
    console.log(`current input value:`, inputValue);
}

// ================================================================================================

// handle start/stop btns
function handleStartStop() {
    document.querySelector(".ticker-element-commands").addEventListener("click", handleStartStopCallback);
}

// dependency of 'handleStartStop'
function handleStartStopCallback(e) {
    if (!e.target.classList.contains("ticker-element-command")) return;
    const clickedBtn = e.target;
    const clickedBtnType = clickedBtn.textContent.trim().toLowerCase() === `start` ? "start" : "stop"; // determining clicked btn type
    console.log(clickedBtnType);
}

// ================================================================================================

// handle clicks on quick options
function handleQuickOptions() {
    document.querySelector(".ticker-element-options").addEventListener("click", handleQuickOptionsCallback);
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
};
