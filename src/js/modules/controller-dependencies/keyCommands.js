// handling some hotkeys here

import { Visual, Logic, topControlsHandler } from "../../Controller.js";

class KeyCommands {
    constructor() {
        this.listen();
    }

    // ================================================================================================

    listen() {
        document.addEventListener("keydown", function (e) {
            const timerIsRunning = Logic.getTimerIsRunning(); // is any timer running or not?

            if (e.code === `KeyQ` && !timerIsRunning) {
                // switch to timer
                Visual.timerBtn.click();
                topControlsHandler("timer");
            }

            if (e.code === `KeyW` && !timerIsRunning) {
                // switch to stopwatch
                Visual.stopwatchBtn.click();
            }

            if (e.code === `KeyE` && !timerIsRunning) {
                // switch to until
                Visual.tillBtn.click();
            }

            if (e.code === `KeyZ`) {
                // change accent color
                document.querySelector(".color-changer").click();
            }

            let currentCase;
            const minutesInput = document.querySelector(".ticker-block--minutes input");
            const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until

            if (e.code === "Equal" || e.code === "Minus") {
                // increasing/decreasing minutes in Timer when it is not running
                if (activeBlock !== "timer") return;
                if (timerIsRunning) return;
                if (e.code === "Equal") currentCase = "increase minutes";
                if (e.code === "Minus") currentCase = "decrease minutes";
                Visual.timerVisualLogic(minutesInput, currentCase); // handling the cases
                if (minutesInput.value !== "00")
                    Visual.toggleOptionSaveBtn("show"); // if input is 0, 'save to quick opts' is hidden
                else Visual.toggleOptionSaveBtn("hide");
            }

            if (e.code === `KeyC`) {
                // commence/continue
                const btn = document.querySelector(".ticker-element-command--start");
                if (btn.textContent !== "Start" && btn.textContent !== "Resume") return;
                btn.click();
            }

            if (e.code === `KeyP` && timerIsRunning) {
                // pause
                const btn = document.querySelector(".ticker-element-command--start");
                if (btn.textContent !== "Pause") return;
                btn.click();
            }

            if (
                (e.code === `KeyS` && timerIsRunning) ||
                (e.code === `KeyS` && Logic.getState().timer.currentValues.join("") === "000")
            ) {
                // stop -- pressed either when a timer is running or when it's just finished
                document.querySelector(".ticker-element-command--stop").click();
            }

            const activeElementTag = document.activeElement.tagName; // if I type numbers in an input field, this should not trigger all these things below

            const noFunctionKeyWasPressed = !e.metaKey && !e.altKey && !e.ctrlKey;

            if (
                e.code === `Digit1` &&
                !timerIsRunning &&
                activeBlock === "timer" &&
                activeElementTag !== "INPUT" &&
                noFunctionKeyWasPressed
            ) {
                // press the first Quick Option
                const btn = document.querySelector(".ticker-element-option");
                if (btn) btn.click();
            }

            if (
                e.code === `Digit2` &&
                !timerIsRunning &&
                activeBlock === "timer" &&
                activeElementTag !== "INPUT" &&
                noFunctionKeyWasPressed
            ) {
                // press the second Quick Option and so on
                const btn = [...document.querySelectorAll(".ticker-element-option")][1];
                if (btn) btn.click();
            }

            if (
                e.code === `Digit3` &&
                !timerIsRunning &&
                activeBlock === "timer" &&
                activeElementTag !== "INPUT" &&
                noFunctionKeyWasPressed
            ) {
                const btn = [...document.querySelectorAll(".ticker-element-option")][2];
                if (btn) btn.click();
            }

            if (
                e.code === `Digit4` &&
                !timerIsRunning &&
                activeBlock === "timer" &&
                activeElementTag !== "INPUT" &&
                noFunctionKeyWasPressed
            ) {
                const btn = [...document.querySelectorAll(".ticker-element-option")][3];
                if (btn) btn.click();
            }

            if (
                e.code === `Digit5` &&
                !timerIsRunning &&
                activeBlock === "timer" &&
                activeElementTag !== "INPUT" &&
                noFunctionKeyWasPressed
            ) {
                const btn = [...document.querySelectorAll(".ticker-element-option")][4];
                if (btn) btn.click();
            }

            if (
                e.code === `Digit6` &&
                !timerIsRunning &&
                activeBlock === "timer" &&
                activeElementTag !== "INPUT" &&
                noFunctionKeyWasPressed
            ) {
                const btn = [...document.querySelectorAll(".ticker-element-option")][5];
                if (btn) btn.click();
            }

            if (
                e.code === `Digit7` &&
                !timerIsRunning &&
                activeBlock === "timer" &&
                activeElementTag !== "INPUT" &&
                noFunctionKeyWasPressed
            ) {
                const btn = [...document.querySelectorAll(".ticker-element-option")][6];
                if (btn) btn.click();
            }

            if (
                e.code === `Digit8` &&
                !timerIsRunning &&
                activeBlock === "timer" &&
                activeElementTag !== "INPUT" &&
                noFunctionKeyWasPressed
            ) {
                const btn = [...document.querySelectorAll(".ticker-element-option")][7];
                if (btn) btn.click();
            }

            if (
                e.code === `Digit9` &&
                !timerIsRunning &&
                activeBlock === "timer" &&
                activeElementTag !== "INPUT" &&
                noFunctionKeyWasPressed
            ) {
                const btn = [...document.querySelectorAll(".ticker-element-option")][8];
                if (btn) btn.click();
            }
        });
    }
}

export default new KeyCommands(); // I export and instantiate it right here, so I don't have to instantiate it where I import it
