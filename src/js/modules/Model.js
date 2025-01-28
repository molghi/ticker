// Model is responsible for all logic in the app: all computations, calculations, and data operations

class Model {
    #state = {
        runningTimer: "",
        timer: {
            currentValues: [],
        },
    };

    constructor() {}

    // ================================================================================================

    getTimerCurrentValues = () => this.#state.timer.currentValues;

    // setTimerCurrentValues = (arr) => this.#state.timer.currentValues.push(...arr, 0); // 0 here for seconds
    setTimerCurrentValues = (arr) => this.#state.timer.currentValues.push(...arr);

    resetTimerValues = () => (this.#state.timer.currentValues = []);

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
            handler([hours, minutes, seconds]);
        }, 1000); // every second
    }

    // ================================================================================================

    stopTimer() {
        clearInterval(this.#state.runningTimer);
    }

    // ================================================================================================

    timerLogic() {
        let hours = this.#state.timer.currentValues[0];
        let minutes = this.#state.timer.currentValues[1];
        let seconds = this.#state.timer.currentValues[2];

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
}

export default Model;
