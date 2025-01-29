// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

import KeyCommands from "./view-dependencies/keyCommands.js";
import { renderTicker, renderQuickOptions, renderColorBtn } from "./view-dependencies/renderMethods.js";
import {
    handleTopControls,
    handleColorClick,
    handleTickerBtns,
    handleStartStop,
    handleQuickOptions,
    handleTickerInput,
    handleStartClick,
    handleStopClick,
    handlePauseClick,
    handleResumeClick,
    handleAddingOption,
} from "./view-dependencies/eventHandlers.js";

import countdownFinished from "../../sounds/countdown-finished.mp3";

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
        this.h1 = document.querySelector("h1");
    }

    // ================================================================================================

    renderTicker(renderWhere, secondsFlag) {
        renderTicker(renderWhere, secondsFlag);
        this.handleTickerBtns();
        this.handleStartStop();
        // this.handleQuickOptions();
        this.handleTickerInput();
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

    handleQuickOptions(handler) {
        handleQuickOptions(handler);
    }

    // ================================================================================================

    timerVisualLogic(input, concatted) {
        // dependency of 'handleTickerBtnsCallback' -- handling the cases
        let inputValue = input.value; // getting the input value
        const formatIt = (value) => value.toString().padStart(2, 0); // little helper fn to format it nicely
        // case 1
        if (concatted === "increase minutes") {
            inputValue = +inputValue + 1; // input here is minutes, increasing the value
            if (inputValue === 60) {
                inputValue = 0; // minutes are 0
                const hoursInputEl = input.closest(".ticker-element").querySelector(".ticker-block--hours input"); // getting the hour element
                hoursInputEl.value = formatIt(+hoursInputEl.value + 1); // hours: add one and padStart it
            }
            input.value = formatIt(inputValue); // updating the UI
        }
        // case 2
        if (concatted === "decrease minutes") {
            const hoursInputEl = input.closest(".ticker-element").querySelector(".ticker-block--hours input"); // getting the hour element
            if (inputValue === "00" && hoursInputEl.value === "00") return;
            else if (inputValue === "00" && hoursInputEl.value !== "00") {
                hoursInputEl.value = formatIt(+hoursInputEl.value - 1); // decreasing the hours input value
                input.value = "59";
            } else {
                inputValue = +inputValue - 1;
                input.value = formatIt(inputValue);
            }
        }
        // case 3
        if (concatted === "increase hours") {
            input.value = formatIt(+input.value + 1); // input here is hours, increasing the value
        }
        // case 4
        if (concatted === "decrease hours") {
            if (inputValue === "00") return;
            else input.value = formatIt(+input.value - 1);
        }
    }

    // ================================================================================================

    handleTickerInput() {
        handleTickerInput();
    }

    // ================================================================================================

    // return the values of inputs
    readValues() {
        const tickerEl = document.querySelector(".ticker-element");
        const allInputs = [...tickerEl.querySelectorAll("input")].map((inputEl) => inputEl.value);
        return allInputs;
    }

    // ================================================================================================

    handleStartClick(handler) {
        handleStartClick(handler);
    }

    // ================================================================================================

    handleStopClick(handler) {
        handleStopClick(handler);
    }

    // ================================================================================================

    handlePauseClick(handler) {
        handlePauseClick(handler);
    }

    // ================================================================================================

    handleResumeClick(handler) {
        handleResumeClick(handler);
    }

    // ================================================================================================

    renderQuickOptions(arr) {
        renderQuickOptions(arr);
        this.handleQuickOptions();
    }

    // ================================================================================================

    handleAddingOption(handler) {
        handleAddingOption(handler);
    }

    // ================================================================================================

    playSound() {
        const audio = new Audio(countdownFinished);
        audio.volume = 0.25;

        let playCount = 0;
        audio.play();

        audio.onended = () => {
            // using an event listener to replay the audio 3 times
            playCount++;
            if (playCount < 3) audio.play();
        };
    }

    // ================================================================================================

    showTicking = (arr) => {
        const allInputs = [...document.querySelectorAll(".ticker-element input")];
        document.querySelector(".ticker-block--seconds").classList.remove("hidden"); // unhiding the seconds block
        allInputs.forEach((input, i) => (input.value = arr[i].toString().padStart(2, 0))); // updating input values
        document.querySelector(".ticker-element").classList.add("working");
        this.toggleInterfaceDimmer("dimmer");
        this.updateTitle(arr);

        if (arr.join("") === "000") {
            this.playSound();
            console.log(
                `The countdown has finished at ${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, 0)}`
            );
            setTimeout(() => {
                // restoring the interface
                document.querySelector(".ticker-element").classList.remove("working"); // decrease the size of the ticker element
                document.querySelector(".ticker-element").classList.remove("paused"); // removing the blinking class
                this.toggleInterfaceDimmer("show"); // bring back the interface
                this.resetInputValues(); // reset in the UI
                this.toggleSecondsBlock("hide"); // hiding the seconds block
                this.updateTitle(undefined, "restore"); // put 'Ticker' back in the title
                this.changeStartBtnText("start"); // changing the text of Start btn
            }, 15000);
        }
    };

    // ================================================================================================

    toggleInterfaceDimmer(showFlag) {
        const optionsEl = document.querySelector(".ticker-element-options");
        const elements = [optionsEl, this.appTopBtns, this.h1];
        const commandsEl = document.querySelector(".ticker-element-commands");
        if (showFlag === "show") {
            elements.forEach((el) => el.classList.remove("obscured"));
            commandsEl.classList.remove("dimmed");
            commandsEl.classList.remove("moved-down");
        } else {
            // make dimmer
            elements.forEach((el) => el.classList.add("obscured"));
            commandsEl.classList.add("dimmed");
            commandsEl.classList.add("moved-down");
        }
    }

    // ================================================================================================

    resetInputValues() {
        [...document.querySelectorAll(".ticker-element input")].forEach((el) => (el.value = "00"));
    }

    // ================================================================================================

    toggleSecondsBlock(showFlag) {
        if (showFlag === "hide") {
            document.querySelector(".ticker-block--seconds").classList.add("hidden");
        } else {
            document.querySelector(".ticker-block--seconds").classList.remove("hidden");
        }
    }

    // ================================================================================================

    updateTitle(arr, flag) {
        if (flag === "restore") return (document.title = "Ticker");

        if (flag === "pause") return (document.title = document.title + " ⏸");

        if (flag === "resume") return (document.title = document.title.replace(" ⏸", ""));

        if (arr) {
            const [hr, min, sec] = arr;
            const padIt = (value) => value.toString().padStart(2, "0"); // little helper fn
            document.title = `${padIt(hr)}:${padIt(min)}:${padIt(sec)}`;
        }
    }

    // ================================================================================================

    changeStartBtnText(changeTo) {
        const startBtn = document.querySelector(".ticker-element-command--start");
        if (changeTo === "pause") {
            startBtn.textContent = "Pause";
        } else if (changeTo === "resume") {
            startBtn.textContent = "Resume";
        } else {
            startBtn.textContent = "Start";
        }
    }

    // ================================================================================================

    toggleOptionSaveBtn(flag) {
        const btn = document.querySelector(".ticker-block-btn-save");
        if (flag === "show") {
            btn.classList.remove("hidden");
        } else {
            btn.classList.add("hidden");
        }
    }

    // ================================================================================================
}

export default View;
