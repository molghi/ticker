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
            if (e.code === "Equal" || e.code === "Minus") {
                if (e.code === "Equal") currentCase = "increase minutes";
                if (e.code === "Minus") currentCase = "decrease minutes";
                Visual.timerVisualLogic(minutesInput, currentCase);
                if (minutesInput.value !== "00") Visual.toggleOptionSaveBtn("show");
                else Visual.toggleOptionSaveBtn("hide");
            }
        });
    }
}

export default new KeyCommands(); // I export and instantiate it right here, so I don't have to instantiate it where I import it
