// Model is responsible for all logic in the app: all computations, calculations, and data operations

import LS from "./model-dependencies/localStorage.js";

class Model {
    #state = {
        runningTimer: "",
        currentTimeTimer: "",
        timer: {
            currentValues: [],
            quickOptions: [],
        },
        stopwatch: {
            currentValues: [0, 0, 0],
        },
        until: {
            setTime: [],
        },
        accentColor: "",
    };

    constructor() {
        this.getQuickOptions(); // from LS
        console.log(`state:`, this.#state);
        this.getAccentColor(); // from LS
    }

    // ================================================================================================

    getState = () => this.#state;

    resetStopwatchValues = () => (this.#state.stopwatch.currentValues = [0, 0, 0]);

    getTimerCurrentValues = () => this.#state.timer.currentValues;

    // setTimerCurrentValues = (arr) => this.#state.timer.currentValues.push(...arr, 0); // 0 here for seconds
    setTimerCurrentValues = (arr) => {
        this.resetTimerValues();
        this.#state.timer.currentValues.push(...arr);
    };

    resetTimerValues = () => (this.#state.timer.currentValues = []);

    getTimerQuickOptions = () => this.#state.timer.quickOptions;

    setUntilTime = (value) => (this.#state.until.setTime = value);
    getUntilTime = () => this.#state.until.setTime;

    setUntilPauseTime = (value) => (this.#state.until.pausedTime = value);
    getUntilPauseTime = () => this.#state.until.pausedTime;

    // ================================================================================================

    addQuickOption(arr) {
        const asNumbers = arr.map((x) => +x);
        const secondsRemoved = asNumbers.slice(0, 2);
        const allSavedOptionsStringified = this.#state.timer.quickOptions.map((x) => x.toString());
        if (allSavedOptionsStringified.includes(secondsRemoved.toString())) return; // if what we are adding is already there, return
        this.#state.timer.quickOptions.push(secondsRemoved);
        LS.save(`quickOptions`, this.#state.timer.quickOptions, "ref"); // pushing to LS, reference type
    }

    // ================================================================================================

    removeQuickOption(value) {
        const allSavedOptionsStringified = this.#state.timer.quickOptions.map((x) => x.toString()); // to find it easily
        const index = allSavedOptionsStringified.findIndex((el) => el === value); // getting the index of this option
        if (index < 0) return;
        this.#state.timer.quickOptions.splice(index, 1); // removing this option
        LS.save(`quickOptions`, this.#state.timer.quickOptions, "ref"); // pushing to LS, reference type
    }

    // ================================================================================================

    getQuickOptions() {
        const fetched = LS.get(`quickOptions`, "ref");
        if (!fetched) return;
        fetched.forEach((arr) => this.#state.timer.quickOptions.push(arr));
    }

    // ================================================================================================

    startTimer(arr) {
        const [hours, minutes] = arr;
        this.#state.timer.currentValues.push(hours, minutes);
    }

    // ================================================================================================

    startInterval(handler) {
        clearInterval(this.#state.runningTimer); // clearing first before setting

        handler(this.#state.timer.currentValues);
        this.#state.runningTimer = setInterval(() => {
            const [hours, minutes, seconds] = this.timerLogic(); // decreasing values (hours, minutes, seconds) happens here
            handler([hours, minutes, seconds], "timer");
        }, 1000); // every second
    }

    // ================================================================================================

    resumeInterval(handler) {
        clearInterval(this.#state.runningTimer); // clearing first before setting

        handler(this.#state.until.setTime);
        this.#state.runningTimer = setInterval(() => {
            const [hours, minutes, seconds] = this.timerLogic(); // decreasing values (hours, minutes, seconds) happens here
            handler([hours, minutes, seconds], "timer");
        }, 1000); // every second
    }

    // ================================================================================================

    stopTimer() {
        clearInterval(this.#state.runningTimer);
    }

    // ================================================================================================

    timerLogic(type) {
        let hours, minutes, seconds;
        if (type === "until") {
            hours = this.#state.until.setTime[0];
            minutes = this.#state.until.setTime[1];
            seconds = 0;
        } else {
            hours = this.#state.timer.currentValues[0];
            minutes = this.#state.timer.currentValues[1];
            seconds = this.#state.timer.currentValues[2];
        }

        seconds -= 1;
        if (seconds < 0 && minutes > 0 && hours >= 0) {
            seconds = 59;
            minutes -= 1;
            if (minutes === 0 && hours > 0) {
                minutes = 59;
                hours -= 1;
            }
        } else if (seconds < 0 && minutes === 0 && hours >= 0) {
            seconds = 59;
            minutes = 59;
            hours -= 1;
        } else if (seconds <= 0 && minutes <= 0 && hours <= 0) {
            clearInterval(this.#state.runningTimer);
        }

        this.#state.timer.currentValues = [];
        this.#state.timer.currentValues.push(hours, minutes, seconds);

        return [hours, minutes, seconds];
    }

    // ================================================================================================

    startIntervalStopwatch(handler) {
        clearInterval(this.#state.runningTimer); // clearing first before setting

        handler(this.#state.stopwatch.currentValues);

        this.#state.runningTimer = setInterval(() => {
            const [hours, minutes, seconds] = this.stopwatchLogic(); // increasing values (hours, minutes, seconds) happens here
            handler([hours, minutes, seconds], "stopwatch");
        }, 1000); // every second
    }

    // ================================================================================================

    stopwatchLogic() {
        let [hours, minutes, seconds] = this.#state.stopwatch.currentValues;

        seconds += 1;
        if (seconds > 59) {
            seconds = 0;
            minutes += 1;
            if (minutes > 59) {
                minutes = 0;
                hours += 1;
            }
        }

        this.#state.stopwatch.currentValues = [hours, minutes, seconds];
        return [hours, minutes, seconds];
    }

    // ================================================================================================

    checkColor(string) {
        // mimicking DOM addition
        const div = document.createElement("div");
        div.style.color = string.trim().toLowerCase();
        document.body.appendChild(div);
        const color = window.getComputedStyle(div).color;
        document.body.removeChild(div);

        const rgbValues = color
            .slice(4, -1)
            .split(",")
            .map((x) => +x.trim()); // just the rgb values (r,g,b)

        if (rgbValues[0] < 40 && rgbValues[1] < 40 && rgbValues[2] < 40) return `rgb(0, 128, 0)`; // return green if it is too dark

        return color;
    }

    // ================================================================================================

    // get from LS
    getAccentColor() {
        const fetched = LS.get("timerAccentColor", "prim");
        if (!fetched) return;
        this.#state.accentColor = fetched;
    }

    // ================================================================================================

    changeAccentColor(color) {
        this.#state.accentColor = color;
        LS.save(`timerAccentColor`, this.#state.accentColor, "prim"); // pushing to LS, primitive type
    }

    // ================================================================================================

    returnAccentColor = () => this.#state.accentColor;

    // ================================================================================================

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

    calcTimeDifference(arr) {
        console.log(arr);
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

        let thenTime = `${nowYear}-${nowMonth.toString().padStart(2, 0)}-${nowDate}T${setHours}:${setMinutes}`; // 2025-01-27T14:30
        thenTime = new Date(thenTime).getTime();

        const difference = thenTime - nowTime;
        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor((seconds / 60) % 60);
        const hours = Math.floor(seconds / 3600);

        return [hours, minutes];
    }

    // ================================================================================================

    everyMinTimer(handler) {
        clearInterval(this.#state.currentTimeTimer); // clearing first before setting

        this.#state.currentTimeTimer = setInterval(() => {
            handler();
        }, 60000);
    }

    // ================================================================================================
}

export default Model;
