import { Logic } from "../../Controller.js";

// starting timer
function startInterval(handler) {
    Logic.stopTimer(); // clearing first before setting

    handler(Logic.getState().timer.currentValues);
    Logic.getState().runningTimer = setInterval(() => {
        const [hours, minutes, seconds] = timerLogic(); // decreasing values (hours, minutes, seconds) happens here
        handler([hours, minutes, seconds], "timer");
    }, 1000); // every second
}

// ================================================================================================

// resuming timer
function resumeInterval(handler) {
    Logic.stopTimer(); // clearing first before setting

    handler(Logic.getState().until.setTime);
    Logic.getState().runningTimer = setInterval(() => {
        const [hours, minutes, seconds] = timerLogic(); // decreasing values (hours, minutes, seconds) happens here
        handler([hours, minutes, seconds], "timer");
    }, 1000); // every second
}

// ================================================================================================

// stopping runningTimer
function stopTimer() {
    clearInterval(Logic.getState().runningTimer);
}

// ================================================================================================

// timer logic
function timerLogic(type) {
    let hours, minutes, seconds;
    if (type === "until") {
        hours = Logic.getState().until.setTime[0];
        minutes = Logic.getState().until.setTime[1];
        seconds = 0;
    } else {
        hours = Logic.getState().timer.currentValues[0];
        minutes = Logic.getState().timer.currentValues[1];
        seconds = Logic.getState().timer.currentValues[2];
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
        Logic.stopTimer();
    }

    Logic.getState().timer.currentValues = [];
    Logic.getState().timer.currentValues.push(hours, minutes, seconds);

    return [hours, minutes, seconds];
}

// ================================================================================================

// starting stopwatch
function startIntervalStopwatch(handler) {
    Logic.stopTimer(); // clearing first before setting

    handler(Logic.getState().stopwatch.currentValues);

    Logic.getState().runningTimer = setInterval(() => {
        const [hours, minutes, seconds] = stopwatchLogic(); // increasing values (hours, minutes, seconds) happens here
        handler([hours, minutes, seconds], "stopwatch");
    }, 1000); // every second
}

// ================================================================================================

// stopwatch logic
function stopwatchLogic() {
    let [hours, minutes, seconds] = Logic.getState().stopwatch.currentValues;

    seconds += 1;
    if (seconds > 59) {
        seconds = 0;
        minutes += 1;
        if (minutes > 59) {
            minutes = 0;
            hours += 1;
        }
    }

    Logic.getState().stopwatch.currentValues = [hours, minutes, seconds];
    return [hours, minutes, seconds];
}

// ================================================================================================

// a timer for .current-time
function everyMinTimer(handler) {
    Logic.stopCurrentTimeTimer(); // clearing first before setting

    Logic.getState().currentTimeTimer = setInterval(() => {
        handler();
    }, 60000);
}

// ================================================================================================

// stopping the timer for .current-time
function stopCurrentTimeTimer() {
    clearInterval(Logic.getState().currentTimeTimer);
}

// ================================================================================================

// start the progress bar timer
function progressBarTimer(handler) {
    Logic.stopProgressBarTimer();

    const [timerHours, timerMinutes, timerSeconds] = Logic.getState().timer.currentValues;
    const finalTimeInSec = timerSeconds + timerMinutes * 60 + timerHours * 3600;
    Logic.getState().timer.finalTime = finalTimeInSec;

    Logic.getState().progressBarTimer = setInterval(() => {
        const percentage = Logic.calcProgressBarPercentage();
        handler(percentage);
    }, 1000);
}

// ================================================================================================

// stop the progress bar timer
function stopProgressBarTimer() {
    clearInterval(Logic.getState().progressBarTimer);
}

// ================================================================================================

export {
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
};
