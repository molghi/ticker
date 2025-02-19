// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

// importing dependencies
import {
    renderTicker,
    renderQuickOptions,
    renderColorBtn,
    renderCurrentTime,
    renderProgressBar,
} from "./view-dependencies/renderMethods.js";

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

import timerVisualLogic from "./view-dependencies/timerVisualLogic.js";

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
        this.historyEl = document.querySelector(".app__history-box");
        this.sectionEl = document.querySelector(".section");
        this.audio = "";
    }

    // ================================================================================================

    // rendering the big ticker element: hours, minutes and maybe seconds too
    renderTicker(renderWhere, secondsFlag) {
        renderTicker(renderWhere, secondsFlag); // rendering the ticker element
        this.handleTickerBtns(); // listening to some ticker actions
        this.handleStartStop(); // listening to some ticker actions
        this.handleTickerInput(); // listening to some ticker actions
    }

    // ================================================================================================

    // rendering .current-time
    renderCurrentTime(hrs, min) {
        renderCurrentTime(hrs, min);
    }

    // ================================================================================================

    // handle clicks on "Timer", "Stopwatch", or "Until"
    handleTopControls(handler) {
        handleTopControls(handler);
    }

    // ================================================================================================

    // show an element
    show = (el) => el.classList.remove("hidden");

    // hide an element
    hide = (el) => el.classList.add("hidden");

    // ================================================================================================

    // toggle the visibility of .ticker-element-options
    toggleQuickOptions(showFlag) {
        const block = document.querySelector(".ticker-element-options");
        if (!block) return;
        if (showFlag === "show") block.classList.remove("hidden");
        else block.classList.add("hidden");
    }

    // ================================================================================================

    // blurring inputs when a timer is active
    blurInputs() {
        const allInputs = [...document.querySelectorAll(".ticker-element input")];
        allInputs.forEach((x) => x.blur());
    }

    // ================================================================================================

    // rendering the color changer btn (bottom left)
    renderColorBtn() {
        renderColorBtn();
    }

    // ================================================================================================

    // handle clicks on the color changer btn (bottom left)
    handleColorClick(handler) {
        handleColorClick(handler);
    }

    // ================================================================================================

    // handle plus and minus btns of Hours or Minutes -- or save to quick options btn
    handleTickerBtns() {
        handleTickerBtns();
    }

    // ================================================================================================

    // handle start/stop btns
    handleStartStop() {
        handleStartStop();
    }

    // ================================================================================================

    // handle clicks on quick options
    handleQuickOptions(handler) {
        handleQuickOptions(handler);
    }

    // ================================================================================================

    // dependency of 'handleTickerBtnsCallback' -- handling the cases, what happens visually in the interface until you press 'Start a Timer/Countdown'
    timerVisualLogic(input, concatted) {
        timerVisualLogic(input, concatted);
    }

    // ================================================================================================

    // handle typing in any .ticker-element input
    handleTickerInput() {
        handleTickerInput();
    }

    // ================================================================================================

    // return the current values of inputs
    readValues() {
        const tickerEl = document.querySelector(".ticker-element");
        const allInputs = [...tickerEl.querySelectorAll("input")].map((inputEl) => inputEl.value);
        return allInputs;
    }

    // ================================================================================================

    // listening to my custom event 'clockstarts' that happens when I click start to start a countdown
    handleStartClick(handler) {
        handleStartClick(handler);
    }

    // ================================================================================================

    // listening to my custom event 'clockstops' that happens when I click stop to stop a countdown
    handleStopClick(handler) {
        handleStopClick(handler);
    }

    // ================================================================================================

    // listening to my custom event 'clockpauses' that happens when I click pause to pause a countdown
    handlePauseClick(handler) {
        handlePauseClick(handler);
    }

    // ================================================================================================

    // listening to my custom event 'clockresumes' that happens when I click resume to resume a countdown
    handleResumeClick(handler) {
        handleResumeClick(handler);
    }

    // ================================================================================================

    // rendering quick options
    renderQuickOptions(arr) {
        renderQuickOptions(arr);
        this.handleQuickOptions(); // listening to some actions
    }

    // ================================================================================================

    // listening to my custom event 'addoption' that happens when I click 'Save to Quick Options'
    handleAddingOption(handler) {
        handleAddingOption(handler);
    }

    // ================================================================================================

    // plays a sound upon timer completion
    playSound() {
        this.audio = new Audio(countdownFinished);
        this.audio.volume = 0.25; // reducing the volume

        let playCount = 0;
        this.audio.play();

        this.audio.onended = () => {
            // using an event listener to replay the audio 3 times
            playCount++;
            if (playCount < 3) this.audio.play();
        };
    }

    // ================================================================================================

    // updating timer values when it's ticking when a timer is active
    showTicking = (arr, type) => {
        const allInputs = [...document.querySelectorAll(".ticker-element input")];
        document.querySelector(".ticker-block--seconds").classList.remove("hidden"); // unhiding the seconds block
        allInputs.forEach((input, i) => (input.value = arr[i].toString().padStart(2, 0))); // updating input values
        document.querySelector(".ticker-element").classList.add("working");
        this.toggleInterfaceDimmer("dimmer");
        this.updateTitle(arr);

        if (arr.join("") === "000" && type === "timer") {
            this.playSound(); // playing audio notification
            this.updateHistoryBox(
                `The countdown has finished at ${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, 0)}`
            ); // updating history box

            setTimeout(() => {
                this.restoreInterface(); // restoring the interface in 15 secs (the time when the audio stops playing)
            }, 15000);
        }
    };

    // ================================================================================================

    restoreInterface() {
        document.querySelector(".ticker-element").classList.remove("working"); // decrease the size of the ticker element
        document.querySelector(".ticker-element").classList.remove("paused"); // removing the blinking class
        this.toggleInterfaceDimmer("show"); // bring back the interface
        this.resetInputValues(); // reset in the UI
        this.toggleSecondsBlock("hide"); // hiding the seconds block
        this.updateTitle(undefined, "restore"); // put 'Ticker' back in the title
        this.changeStartBtnText("start"); // changing the text of Start btn
        this.removeProgressBar();
    }

    // ================================================================================================

    // making the interface dimmer when a timer is active
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

    // resetting input values
    resetInputValues() {
        [...document.querySelectorAll(".ticker-element input")].forEach((el) => (el.value = "00"));
    }

    // ================================================================================================

    // toggle the visibility of the seconds block
    toggleSecondsBlock(showFlag) {
        if (showFlag === "hide") {
            document.querySelector(".ticker-block--seconds").classList.add("hidden");
        } else {
            document.querySelector(".ticker-block--seconds").classList.remove("hidden");
        }
    }

    // ================================================================================================

    // update document title
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

    // change the text of the Start btn
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

    // toggle the visibility of the Save to Quick Options btn
    toggleOptionSaveBtn(flag) {
        const btn = document.querySelector(".ticker-block-btn-save");
        if (flag === "show") {
            btn.classList.remove("hidden");
        } else {
            btn.classList.add("hidden");
        }
    }

    // ================================================================================================

    // change the accent color of the interface
    setAccentColor(color) {
        if (!color) return;
        document.documentElement.style.setProperty("--accent", color); // changing the accent colour
    }

    // ================================================================================================

    // finding what block is active now: timer, stopwatch or until
    defineActiveBlock() {
        return [...document.querySelectorAll(".app__controls button")]
            .find((el) => el.classList.contains("active"))
            .textContent.toLowerCase()
            .trim();
    }

    // ================================================================================================

    // removing .current-time
    removeCurrentTime() {
        if (document.querySelector(".current-time")) document.querySelector(".current-time").remove();
    }
    // ================================================================================================

    // updating the history block in the bottom right
    updateHistoryBox(text, flag) {
        this.historyEl.innerHTML = text;

        // logging it in the console, longer history:
        const date = new Date();
        let formatted = date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        formatted = formatted.replaceAll(",", "");
        console.log(formatted + ":", text.replaceAll("<span>", "").replaceAll("</span>", ""));
    }

    // ================================================================================================

    // rendering the progress bar at the top
    renderProgressBar() {
        renderProgressBar();
    }

    // ================================================================================================

    // removing the progress bar at the top
    removeProgressBar() {
        if (document.querySelector(".progress-bar")) document.querySelector(".progress-bar").remove();
    }

    // ================================================================================================

    // updating the progress bar at the top
    updateProgressBar(percentageValue) {
        if (document.querySelector(".progress-bar"))
            document.querySelector(".progress-bar div").style.width = percentageValue + "%";
    }

    // ================================================================================================

    // blinking .app briefly
    blinkApp() {
        // this.appBlock
        // document.querySelector(".ticker-element").style.transition = "opacity 0.2s";
        // document.querySelector(".ticker-element").style.opacity = 0;
        document.querySelector(".ticker-element").style.animation = `shortBlink 0.5s ease 0s 1 both`;
        setTimeout(() => {
            // document.querySelector(".ticker-element").style.opacity = 1;
        }, 200);
    }
}

export default View;
