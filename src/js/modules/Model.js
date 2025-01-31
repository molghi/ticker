// Model is responsible for all logic in the app: all computations, calculations, and data operations

// importing dependencies
import LS from "./model-dependencies/localStorage.js";
import {
    startInterval,
    resumeInterval,
    stopTimer,
    timerLogic,
    startIntervalStopwatch,
    stopwatchLogic,
    everyMinTimer,
    stopCurrentTimeTimer,
    progressBarTimer,
    stopProgressBarTimer,
} from "./model-dependencies/timers.js";

// ================================================================================================

class Model {
    #state = {
        runningTimer: "",
        currentTimeTimer: "",
        progressBarTimer: "",
        timer: {
            currentValues: [],
            quickOptions: [],
            setTime: [],
            timestamp: "",
        },
        stopwatch: {
            currentValues: [0, 0, 0],
        },
        until: {
            setTime: [],
        },
        accentColor: "",
        timerIsRunning: false,
    };

    constructor() {
        this.getQuickOptions(); // getting from LS
        this.getAccentColor(); // getting from LS
    }

    // ================================================================================================

    getState = () => this.#state;

    // resetting stopwatch values
    resetStopwatchValues = () => (this.#state.stopwatch.currentValues = [0, 0, 0]);

    // getting the current/latest values of the timer
    getTimerCurrentValues = () => this.#state.timer.currentValues;

    // setting the current values of the timer
    setTimerCurrentValues = (arr) => {
        this.resetTimerValues();
        this.#state.timer.currentValues.push(...arr);
    };

    // resetting timer values
    resetTimerValues = () => (this.#state.timer.currentValues = []);

    // getting quick options
    getTimerQuickOptions = () => this.#state.timer.quickOptions;

    // setting and getting Until time
    setUntilTime = (value) => (this.#state.until.setTime = value);
    getUntilTime = () => this.#state.until.setTime;

    // setting and getting the time when Until was paused
    setUntilPauseTime = (value) => (this.#state.until.pausedTime = value);
    getUntilPauseTime = () => this.#state.until.pausedTime;

    // setting and getting the time that was set in Timer
    pushTimerSetTime = (value) => (this.#state.timer.setTime = value);
    getTimerSetTime = () => {
        const raw = this.#state.timer.setTime;
        let result = "";
        if (raw[0] !== 0) result = `${raw[0]}h`;
        if (raw[1] !== 0) result += ` ${raw[1]}m`;
        return result.trim();
    };

    // setting and getting the value of timerIsRunning
    setTimerIsRunning = () => (this.#state.timerIsRunning = !this.#state.timerIsRunning);
    getTimerIsRunning = () => this.#state.timerIsRunning;

    // ================================================================================================

    // adding a quick option
    addQuickOption(arr) {
        const asNumbers = arr.map((x) => +x);
        const secondsRemoved = asNumbers.slice(0, 2);
        const allSavedOptionsStringified = this.#state.timer.quickOptions.map((x) => x.toString()); // stringifying to check easier
        if (allSavedOptionsStringified.includes(secondsRemoved.toString())) return; // if what we are adding is already there, return
        this.#state.timer.quickOptions.push(secondsRemoved); // adding to state
        LS.save(`timerQuickOptions`, this.#state.timer.quickOptions, "ref"); // pushing to LS, as reference type
    }

    // ================================================================================================

    // removing a quick option
    removeQuickOption(value) {
        const allSavedOptionsStringified = this.#state.timer.quickOptions.map((x) => x.toString()); // stringifying to check easier
        const index = allSavedOptionsStringified.findIndex((el) => el === value); // getting the index of this option
        if (index < 0) return;
        this.#state.timer.quickOptions.splice(index, 1); // removing this option from state
        LS.save(`timerQuickOptions`, this.#state.timer.quickOptions, "ref"); // pushing to LS, as reference type
    }

    // ================================================================================================

    // getting quick options from LS
    getQuickOptions() {
        const fetched = LS.get(`timerQuickOptions`, "ref");
        if (!fetched) return;
        fetched.forEach((arr) => this.#state.timer.quickOptions.push(arr));
    }

    // ================================================================================================

    // starting timer
    startInterval(handler) {
        startInterval(handler);
    }

    // ================================================================================================

    // resuming timer
    resumeInterval(handler) {
        resumeInterval(handler);
    }

    // ================================================================================================

    // stopping runningTimer
    stopTimer() {
        stopTimer();
    }

    // ================================================================================================

    // timer logic
    timerLogic(type) {
        timerLogic(type);
    }

    // ================================================================================================

    // starting stopwatch
    startIntervalStopwatch(handler) {
        startIntervalStopwatch(handler);
    }

    // ================================================================================================

    // stopwatch logic
    stopwatchLogic() {
        stopwatchLogic();
    }

    // ================================================================================================

    // checking the accent color
    checkColor(string) {
        // mimicking DOM addition to read the computed style
        const div = document.createElement("div");
        div.style.color = string.trim().toLowerCase();
        document.body.appendChild(div);
        const color = window.getComputedStyle(div).color;
        document.body.removeChild(div);

        const rgbValues = color
            .slice(4, -1)
            .split(",")
            .map((x) => +x.trim()); // just the rgb values (r,g,b)

        if (rgbValues[0] < 40 && rgbValues[1] < 40 && rgbValues[2] < 40) return `rgb(0, 128, 0)`; // return green if it is too dark (or incorrect like 'fred')
        return color;
    }

    // ================================================================================================

    // getting accent color from LS
    getAccentColor() {
        const fetched = LS.get("timerAccentColor", "prim");
        if (!fetched) return;
        this.#state.accentColor = fetched;
    }

    // ================================================================================================

    // changing accent color in state and LS
    changeAccentColor(color) {
        this.#state.accentColor = color;
        LS.save(`timerAccentColor`, this.#state.accentColor, "prim"); // pushing to LS, primitive type
    }

    // ================================================================================================

    // returning the current value of accent color in state
    returnAccentColor = () => this.#state.accentColor;

    // ================================================================================================

    // getting the now time
    getNowTime() {
        const now = new Date();
        const nowYear = now.getFullYear();
        const nowMonth = now.getMonth() + 1;
        const nowDate = now.getDate();
        const nowHours = now.getHours();
        const nowMinutes = now.getMinutes();
        return [nowYear, nowMonth, nowDate, nowHours, nowMinutes, now];
    }

    // ================================================================================================

    // calculating the time difference between now and then (Until)
    calcTimeDifference(arr) {
        // 'arr' here is the array of strings which are the values that were in inputs in Until
        const [setHours, setMinutes] = arr;
        let [nowYear, nowMonth, nowDate, nowHours, nowMinutes, now] = this.getNowTime();
        const nowTime = now.getTime();
        if (+setMinutes === nowMinutes && +setHours === nowHours) return [24, 0];
        if (+setMinutes === nowMinutes + 1 && +setHours === nowHours) return [0, 1];

        let whichDay;
        if (+setHours < nowHours) whichDay = "next";
        else if (+setHours === nowHours && +setMinutes < nowMinutes) whichDay = "next";
        else whichDay = "this";

        whichDay === "next" && nowDate++; // if it is the next day, increment the now day value

        // nowDate = nowDate === 32 && "01";
        // let thenTime = `${nowYear}-${nowMonth.toString().padStart(2, 0)}-${nowDate}T${setHours}:${setMinutes}`; // 2025-01-27T14:30
        // thenTime = new Date(thenTime).getTime();
        let thenTime = new Date(nowYear, nowMonth - 1, nowDate, setHours, setMinutes).getTime();

        const difference = thenTime - nowTime;
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor((seconds / 60) % 60);
        const hours = Math.floor(seconds / 3600);

        return [hours, minutes];
    }

    // ================================================================================================

    // a timer for .current-time
    everyMinTimer(handler) {
        everyMinTimer(handler);
    }

    // ================================================================================================

    // stopping the timer for .current-time
    stopCurrentTimeTimer() {
        stopCurrentTimeTimer();
    }

    // ================================================================================================

    // calculate the percentage for the progress bar
    calcProgressBarPercentage() {
        const [timerHours, timerMinutes, timerSeconds] = this.#state.timer.currentValues;
        const finalTimeInSec = timerSeconds + timerMinutes * 60 + timerHours * 3600;
        const x = ((finalTimeInSec / this.#state.timer.finalTime) * 100).toFixed(2);
        const percentage = (100 - x).toFixed(2);
        return percentage;
    }

    // ================================================================================================

    // start the progress bar timer
    progressBarTimer(handler) {
        progressBarTimer(handler);
    }

    // ================================================================================================

    // stop the progress bar timer
    stopProgressBarTimer() {
        stopProgressBarTimer();
    }
}

export default Model;
