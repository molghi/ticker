// dependency of 'handleTickerBtnsCallback' -- handling the cases, what happens visually in the interface until you press 'Start a Timer/Countdown'

function timerVisualLogic(input, concatted) {
    let inputValue = input.value; // getting the input value

    const padIt = (value) => value.toString().padStart(2, 0); // little helper fn to format it nicely

    // case 1
    if (concatted === "increase minutes") {
        inputValue = +inputValue + 1; // input here is minutes, increasing the value
        if (inputValue === 60) {
            inputValue = 0; // minutes are 0
            const hoursInputEl = input.closest(".ticker-element").querySelector(".ticker-block--hours input"); // getting the hour element
            hoursInputEl.value = padIt(+hoursInputEl.value + 1); // hours: add one and padStart it
        }
        input.value = padIt(inputValue); // updating the UI
    }
    // case 2
    if (concatted === "decrease minutes") {
        const hoursInputEl = input.closest(".ticker-element").querySelector(".ticker-block--hours input"); // getting the hour element
        if (inputValue === "00" && hoursInputEl.value === "00") return;
        else if (inputValue === "00" && hoursInputEl.value !== "00") {
            hoursInputEl.value = padIt(+hoursInputEl.value - 1); // decreasing the hours input value
            input.value = "59";
        } else {
            inputValue = +inputValue - 1;
            input.value = padIt(inputValue);
        }
    }
    // case 3
    if (concatted === "increase hours") {
        input.value = padIt(+input.value + 1); // input here is hours, increasing the value
    }
    // case 4
    if (concatted === "decrease hours") {
        if (inputValue === "00") return;
        else input.value = padIt(+input.value - 1);
    }
}

export default timerVisualLogic;
