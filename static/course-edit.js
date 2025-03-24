const checkedOne = "check_circle";
const uncheckedOne = "radio_button_unchecked";
const checkedMany = "check_box";
const uncheckedMany = "check_box_outline_blank";
const switchOn = "toggle_on";
const switchOff = "toggle_off";

function updateImageAlt(imageId) {
    let altInput = document.getElementById(imageId + "-input").value;
    let image = document.getElementById(imageId).children[0];
    let visibleAlt = document.getElementById(imageId).children[1];

    image.alt = altInput;
    visibleAlt.innerHTML = altInput;
}

function updateAltIcons() {
    let altInputs = document.getElementsByName("alt-input");

    for (let altInput of altInputs) {
        let input = altInput.children[0];
        let icon = altInput.children[1];

        let description = document.getElementById(altInput.id.slice(0, -7) + "-description"); // Remove '-switch' and find '-description'

        if (input.checked) {
            icon.innerHTML = switchOn;
            description.classList.remove("hidden");
        } else {
            icon.innerHTML = switchOff;
            description.classList.add("hidden");
        }
    }
}

function updateIcons() {
    let options = document.getElementsByName("choice-input");
    let questionType = document.getElementById("question-type").value;

    for (let option of options) {
        let icon = option.children[1];
        let input = option.children[0];

        switch (questionType) {
            case "select-one":
                if (input.checked) {
                    icon.innerHTML = checkedOne;
                } else {
                    icon.innerHTML = uncheckedOne;
                }
                break;
            default:
                if (input.checked) {
                    icon.innerHTML = checkedMany;
                } else {
                    icon.innerHTML = uncheckedMany;
                }
        }
    }
}

/// Change icons and inputs based on the question type ///
function changeQuestionType() {
    let select = document.getElementById("question-type");

    switch (select.value) {
        case "select-one":
            changeToSelectOne();
            break;
        case "select-many":
            changeToSelectMany();
            break;
        default:
            changeToSelectOne();
    }

    updateIcons()
}

function changeToSelectOne() {
    let options = document.getElementsByName("choice-input");

    for (let option of options) {
        let children = option.children;
        let icon = children[1];
        let input = children[0];

        if (input.checked) {
            icon.innerHTML = checkedOne;
        } else {
            icon.innerHTML = uncheckedOne;
        }

        input.type = "radio";
    }
}

function changeToSelectMany() {
    let options = document.getElementsByName("choice-input");

    for (let option of options) {
        let children = option.children;
        let icon = children[1];
        let input = children[0];

        if (input.checked) {
            icon.innerHTML = checkedMany;
        } else {
            icon.innerHTML = uncheckedMany;
        }

        input.type = "checkbox";
    }
}

/// Add range slider dots ///
function addSliderDots() {
    const min = 1;
    const max = 5;

    let input = document.getElementById("difficulty");
    let dots = document.getElementById("difficulty-range-dots");

    input.min = min;
    input.max = max;
    input.value = (min + max) / 2;                                  // Average / Center

    for (let x = min - 1; x < max; x++) {
        let dot = document.createElement("div");
        dot.classList.add("range-dot");
        dots.appendChild(dot);
    }
}

/*
/// Link question to header ///
var oldHeader = "";

function updateQuestionHeader() {
    const label = document.getElementById("question0-switch");
    const question = document.getElementById("question-header");
    const header = document.getElementById("header");
    const icon = label.children[1];
    const input = label.children[0];

    question.addEventListener("input", () => {
        if (input.checked) {
            header.value = question.value;
        }
    });

    if (input.checked) {
        icon.innerHTML = switchOn;
        oldHeader = header.value;
        header.value = question.value;
        header.disabled = true;
    } else {
        icon.innerHTML = switchOff;
        header.value = oldHeader;
        header.disabled = false;
    }
}
*/

function addHeader() {
    let newHeader = document.createElement("div");
    newHeader.classList.add("content");
    
    let contentGroup = document.createElement("div");
    contentGroup.classList.add("content-group");
    
    let iconWrap = document.createElement("div");
    iconWrap.classList.add("icon");
    iconWrap.ariaLabel = "heading";
    
    let headingIcon = document.createElement("span");
    headingIcon.classList.add("material-symbols-rounded");
    headingIcon.ariaHidden = "true";
    headingIcon.innerHTML = "format_h1";
    
    let input = document.createElement("input");
    input.classList.add("content");
    input.classList.add("heading-text");
    input.type = "text";
    input.placeholder = "Heading";
    
    let moreButton = document.createElement("button");
    moreButton.classList.add("button-icon");
    moreButton.classList.add("icon");
    moreButton.ariaLabel = "more";
    
    let moreIcon = document.createElement("span");
    moreIcon.classList.add("material-symbols-rounded");
    moreIcon.ariaHidden = "true";
    moreIcon.innerHTML = "more_horiz";
    
    newHeader.appendChild(contentGroup);
    contentGroup.appendChild(iconWrap);
    iconWrap.appendChild(headingIcon);
    contentGroup.appendChild(input);
    contentGroup.appendChild(moreButton);
    moreButton.appendChild(moreIcon);
    
    document.getElementById("content-wrap").appendChild(newHeader);
}

function addText() {
    console.log("Add text");
    
    let newText = document.createElement("div");
    newText.classList.add("content");
    
    let contentGroup = document.createElement("div");
    contentGroup.classList.add("content-group");
    
    let iconWrap = document.createElement("div");
    iconWrap.classList.add("icon");
    iconWrap.ariaLabel = "text";
    
    let textIcon = document.createElement("span");
    textIcon.classList.add("material-symbols-rounded");
    textIcon.ariaHidden = "true";
    textIcon.innerHTML = "article";
    
    let growWrap = document.createElement("div");
    growWrap.classList.add("content");
    growWrap.classList.add("grow-wrap");
    
    let textArea = document.createElement("textarea");
    textArea.placeholder = "Text";
    textArea.addEventListener("input", () => {
        this.parentNode.dataset.replicatedValue = this.value;
    });
    
    let moreButton = document.createElement("button");
    moreButton.classList.add("button-icon");
    moreButton.classList.add("icon");
    moreButton.ariaLabel = "more";
    
    let moreIcon = document.createElement("span");
    moreIcon.classList.add("material-symbols-rounded");
    moreIcon.ariaHidden = "true";
    moreIcon.innerHTML = "more_horiz";
    
    newText.appendChild(contentGroup);
    contentGroup.appendChild(iconWrap);
    iconWrap.appendChild(textIcon);
    contentGroup.appendChild(growWrap);
    growWrap.appendChild(textArea);
    contentGroup.appendChild(moreButton);
    moreButton.appendChild(moreIcon);
    
    document.getElementById("content-wrap").appendChild(newText);
}

function addQuestion() {
    console.log("Add question");
}

function addFlashCard() {
    console.log("Add flash card");
}

function addMedia() {
    console.log("Add media");
}

function save() {
    
}
