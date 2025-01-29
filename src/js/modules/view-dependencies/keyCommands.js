import { Visual } from "../../Controller.js";

class KeyCommands {
    constructor() {
        this.listen();
    }

    listen() {
        document.addEventListener("keydown", function (e) {
            // 'keypress' is deprecated

            let currentCase;
            const minutesInput = document.querySelector(".ticker-block--minutes input");
            const activeBlock = Visual.defineActiveBlock(); // finding what block is active now: timer, stopwatch or until
            if (e.code === "Equal" || e.code === "Minus") {
                if (e.code === "Equal") currentCase = "increase minutes";
                if (e.code === "Minus") currentCase = "decrease minutes";
                Visual.timerVisualLogic(minutesInput, currentCase);
                if (minutesInput.value !== "00") Visual.toggleOptionSaveBtn("show");
                else Visual.toggleOptionSaveBtn("hide");

                if (activeBlock === "until") {
                    // when in Until, hours cannot be more than 23
                    const hoursInput = document.querySelector(".ticker-block--hours input");
                    if (+hoursInput.value > 23) document.querySelector(".ticker-block--hours input").value = `00`;
                }
            }
        });
    }
}

export default new KeyCommands(); // I export and instantiate it right here, so I don't have to instantiate it where I import it
