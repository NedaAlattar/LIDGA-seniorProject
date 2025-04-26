const checkedOne = "radio_button_checked";
const uncheckedOne = "radio_button_unchecked";
const checkedMany = "check_box";
const uncheckedMany = "check_box_outline_blank";

function updateIcons() {
    let options = document.getElementsByName("choice-input");

    for (let option of options) {
        let input = option.children[0]; // The input element (checkbox or radio)
        let icon = option.children[1];  // The span for the icon

        if (!input || !icon) continue; // Skip if structure is wrong

        if (input.type === "radio") {
            if (input.checked) {
                icon.innerHTML = checkedOne;
            } else {
                icon.innerHTML = uncheckedOne;
            }
        } else if (input.type === "checkbox") {
            if (input.checked) {
                icon.innerHTML = checkedMany;
            } else {
                icon.innerHTML = uncheckedMany;
            }
        }
    }
}
