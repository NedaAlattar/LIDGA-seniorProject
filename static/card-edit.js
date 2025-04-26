const checkedOne = "check_circle";
const uncheckedOne = "radio_button_unchecked";
const checkedMany = "check_box";
const uncheckedMany = "check_box_outline_blank";
const switchOn = "toggle_on";
const switchOff = "toggle_off";

function updateImageAlt(contentId) {
    let description = document.getElementById(contentId + "-description").value;
    let image = document.getElementById(contentId + "-media");
    let visibleAlt = document.getElementById(contentId + "-alt");

    image.alt = description;
    visibleAlt.innerHTML = description;
}

function updateAltDescription(contentId) {
    let label = document.getElementById(contentId + "-switch");
    let input = label.children[0];

    let description = document.getElementById(contentId + "-alt");

    if (input.checked) {
        description.classList.remove("hidden");
    } else {
        description.classList.add("hidden");
    }
}

function updateSwitchIcons(contentId) {
    let label = document.getElementById(contentId + "-switch");
    let input = label.children[0];
    let icon = label.children[1];

    if (input.checked) {
        icon.innerHTML = switchOn;
    } else {
        icon.innerHTML = switchOff;
    }
}

function updateSlideSelect(contentId) {
    let labels = document.getElementsByName(contentId + "-slide-select");
    
    for (let label of labels) {
        if (label.children[0].checked) {
            label.classList.add("active");
        } else {
            label.classList.remove("active");
        }
    }
}

function addSliderDots() {
    const dot = document.createElement("div");
    dot.classList.add("range-dot");
    
    let wraps = document.getElementsByName("dotted-range");

    for (let wrap of wraps) {
        let input = wrap.children[0];
        let dots = wrap.children[1];
        
        let min = input.min;
        let max = input.max;

        dots.innerHTML = "";
        for (let x = min - 1; x < max; x++) {
            let newDot = dot.cloneNode();
            dots.appendChild(newDot);
        }
    }
}

function updateQuestionIcon(contentId) {
    let options = document.getElementsByName(contentId + "-choice-input");
    let questionType = document.getElementById(contentId + "-question-type").value;
    
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
            case "select-many":
                if (input.checked) {
                    icon.innerHTML = checkedMany;
                } else {
                    icon.innerHTML = uncheckedMany;
                }
                break;
            default:
        }
    }
}

let choices = 0;                                                    // TODO: allow for many questions

function addOptionHandler(contentId) {
    let choices = document.getElementById(contentId + "-choices");
    
    for (let choice of choices.children) {
        if (choice.dataset.last != "true" || choice.children[1].value === "") {
            continue;
        }
        
        addOption(contentId);
        choice.dataset.last = "false";
    }
}

function addOption(contentId) {
    let questionType = document.getElementById(contentId + "-question-type").value;
    
    /* vvv GENERATING THIS vvv
     *
     * <div class="form-row center-up-down space-after-med" data-last="true">
     *   <label class="choice-input" name="content-3-choice-input">
     *     <input onChange="updateQuestionIcon('content-3')" type="radio" id="choice-0" name="content-3-question" />
     *     <span class="material-symbols-rounded icon button-icon" aria-hidden="true">radio_button_unchecked</span>
     *   </label>
     *   <input onChange="addOptionHandler('content-3')" type="text" id="choice-0-label" placeholder="Option" />
     * </div>
     */
    
    let formRow = document.createElement("div");
    formRow.classList.add("form-row");
    formRow.classList.add("center-up-down");
    formRow.classList.add("space-after-med");
    formRow.dataset.last = "true";
    
    let label = document.createElement("label");
    label.classList.add("choice-input");
    label.setAttribute("name", contentId + "-choice-input");
    
    let choice = document.createElement("input");
    switch (questionType) {
        case "select-one":
            choice.type = "radio";
            break;
        case "select-many":
            choice.type = "checkbox";
            break;
        default:
    }
    choice.id = "choice-" + ++choices;
    choice.setAttribute("name", contentId + "-question");
    choice.addEventListener("change", function() { updateQuestionIcon(contentId); }, false);
    
    let icon = document.createElement("span");
    icon.classList.add("material-symbols-rounded");
    icon.classList.add("icon");
    icon.classList.add("button-icon");
    icon.setAttribute("aria-hidden", "true");
    switch (questionType) {
        case "select-one":
            icon.innerHTML = uncheckedOne;
            break;
        case "select-many":
            icon.innerHTML = uncheckedMany;
            break;
        default:
    }
    
    let optionText = document.createElement("input");
    optionText.type = "text";
    optionText.id = "choice-" + choices + "-label";
    optionText.placeholder = "Option";
    optionText.addEventListener("change", function() { addOptionHandler(contentId) }, false);
    
    label.appendChild(choice);
    label.appendChild(icon);
    formRow.appendChild(label);
    formRow.appendChild(optionText);
    
    document.getElementById(contentId + "-choices").appendChild(formRow);
}

function changeQuestionType(contentId) {
    let choices = document.getElementById(contentId + "-choices").children;
    let questionType = document.getElementById(contentId + "-question-type").value;
    
    for (let choice of choices) {
        let input = choice.children[0].children[0];
        
        switch (questionType) {
            case "select-one":
                input.type = "radio";
                break;
            case "select-many":
                input.type = "checkbox";
                break;
            default:
        }
    }
    
    updateQuestionIcon(contentId);
}

function save() {
    let contents = document.getElementById("content-wrap").children;
    let json = new Object();
    
    json.version = 1;
    
    let cardName = getName(contents);
    document.title = cardName + " | Raven";                         // Set the title of the page to the new card name
    //json.name = btoa(cardName);                                     // Get the name for the card and convert to base 64
    json.name = cardName;         
    json.type = getType(contents);
    json.chapter = 0;                                               // TODO: Properly get chapter of the card
    json.cardId = cardId;
    
    // Save contents
    let arrContent = [];
    
    for (let i = 0; i < contents.length; i++) {
        let content = contents[i];
        let contentJson = new Object();
        
        switch (content.dataset.contentType) {
            case "header":
                contentJson.type = "header";
                
                let value = content.children[1].children[1].value
                if (value === "") continue;                         // Don't save if the content is empty
                
                //contentJson.value = btoa(.value);                   // Get header value and convert to base 64
                contentJson.value = value;
                
                arrContent.push(contentJson);
                break;
            case "long_text":
                contentJson.type = "long_text";
                let longTextContent = [];
                
                while (true) {
                    let value = content.children[1].children[1].children[0].value;
                    if (value !== "") {                             // Don't save if the content is empty
                        //longTextContent.push(btoa(value));          // Saved in base 64
                        longTextContent.push(value);
                    }
                    
                    if (contents[i + 1] == null) {
                        break;
                    }

                    if (contents[i + 1].dataset.contentType != "long_text") {
                        break;                                      // Stop saving when we are no longer looking at long text content
                    }
                    
                    i++;
                    content = contents[i];
                }
                
                if (longTextContent.length == 0) continue;          // If there is nothing saved in the list, don't save content
                
                contentJson.content = longTextContent;
                arrContent.push(contentJson); 
                break;
            case "media":
                // TODO: Allow for stackable grouping
                
                contentJson.type = "media";
                contentJson.value = "greenhouse.jpg";               // TODO: Send media to server somehow :)
                //contentJson.alt = btoa(document.getElementById(content.id + "-description").value) // Saved in base 64
                contentJson.alt = document.getElementById(content.id + "-description").value
                contentJson.showAlt = document.getElementById(content.id + "-switch").children[0].checked
                
                if (contentJson.alt === "") {                       // Only bother to show alt if there is something there
                    contentJson.showAlt = false;
                }
                
                arrContent.push(contentJson); 
                break;
            case "question":
                arrContent.push(saveQuestion(content));
                
                break;
            default:
        }
    }
    
    json.content = arrContent;
    
    console.log(JSON.stringify(json));
    console.log(json);
}

function saveQuestion(content) {
    let arrContentJson = [];
    
    let headerValue = content.children[1].children[1].value;        // Save? question header
    if (headerValue !== "") {                                       // Don't save if empty
        let headerJson = new Object();
        headerJson.type = "header";
        //headerJson.value = btoa(headerValue);                       // Saved in base 64
        headerJson.value = headerValue;
        
        arrContentJson.push(headerJson);
    };
    
    let questionJson = new Object();
    questionJson.difficulty = document.getElementById(content.id + "-difficulty").value;
    questionJson.shuffle = document.getElementById(content.id + "-switch").children[0].checked;
    
    let questionType = document.getElementById(content.id + "-question-type").value;
    switch (questionType) {
        case "select-one":
            questionJson.type = "response_multiple_choice";
            break;
        case "select-many":
            questionJson.type = "responce_select_all_choice";
            break;
        default:
            return;                                                 // Don't try to save question if type is invalid
    }
    
    let questionContent = [];
    let questionCorrect = [];
    let blankChoices = 0;
    
    let choices = document.getElementById(content.id + "-choices").children;
    for (let i = 0; i < choices.length; i++) {
        let value = choices[i].children[1].value;
        if (value === "") {                                         // Don't save if the response is empty
            blankChoices++;
            continue;
        }
        
        questionContent.push(value);
        
        let correctInput = choices[i].children[0].children[0].checked;
        if (correctInput) {
            questionCorrect.push(i - blankChoices);                 // 'i - blankChoices' to correct for any skiped options
        }
    }
    
    questionJson.content = questionContent;
    
    if (questionType == "select-one") {
        questionJson.correct = questionCorrect[0];
    } else {
        questionJson.correct = questionCorrect;
    }
    
    arrContentJson.push(questionJson);
    
    let incorrectValue = content.children[1].children[4].children[0].value // Save incorrect prompt
    if (incorrectValue !== "") {                                    // Don't save if empty
        let incorrectJson = new Object();
        incorrectJson.type = "question_incorrect";
        //incorrectJson.value = btoa(incorrectValue);                 // Saved in base 64
        incorrectJson.value = incorrectValue;
        
        arrContentJson.push(incorrectJson);
    }
    
    return arrContentJson;
}

function getName(contents) {
    for (let content of contents) {                                 // Find first question
        if (content.dataset.contentType != "question") continue;
        
        let input = content.children[1].children[1];
        if (input.value === "") continue;
        
        return shortenName(input.value);                            // Return the first question with a heading
    }
    
    for (let content of contents) {                                 // Find first header
        if (content.dataset.contentType != "header") continue;
        
        let input = content.children[1].children[1];
        if (input.value === "") continue;
        
        return shortenName(input.value);                            // Return the first header with content
    }
    
    for (let content of contents) {                                 // Find first media
        if (content.dataset.contentType != "media") continue;
        
        let input = content.children[1].children[0].children[3];
        if (input.value === "") continue;
        
        return shortenName(input.value);                            // Return the first bit of the text with content
    }
    
    for (let content of contents) {                                 // Find first text
        if (content.dataset.contentType != "long_text") continue;
        
        let input = content.children[1].children[1].children[0];
        if (input.value === "") continue;
        
        return shortenName(input.value);                            // Return the first bit of the text with content
    }
    
    return "Empty Card";                                            // If nothing found, return "Empty Card"
}

const MAX_NAME_LENGTH = 25;
function shortenName(name) {
    if (name.length <= MAX_NAME_LENGTH) return name;
    
    return name.slice(0, MAX_NAME_LENGTH - 3) + "...";
}

function getType(contents) {
    let arrContents = Array.from(contents);

    for (let content of arrContents) {
        if (content.dataset.contentType == "question") return "question";
    }
    
    for (let content of arrContents) {
        if (content.dataset.contentType == "media") return "media";
    }
    
    for (let content of arrContents) {
        if (content.dataset.contentType == "flash") return "flash";
    }
    
    return "text";
}

let contentCount = 7;                                               // Starts at the current count of content, dosen't go down
function addLongText() {
    let contentWrap = document.getElementById("content-wrap");
    const contentId = "content-" + contentCount;
    let content = generateLongTextContent(contentId);

    contentWrap.appendChild(content);
    contentCount++;
}

function createIconButton(iconName, ariaLabel = "", onClick = null) {
    let iconButton = document.createElement("button");
    iconButton.classList.add("button-icon");
    iconButton.classList.add("icon");
    iconButton.setAttribute("aria-label", ariaLabel);
    if (onClick !== null) {
        iconButton.addEventListener("click", onClick, false);
    }
    
    let icon = document.createElement("span");
    icon.classList.add("material-symbols-rounded");
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = iconName;
    
    iconButton.appendChild(icon);
    return iconButton;
}

function deleteContent(contentId) {
    document.getElementById(contentId).remove();
}

function moveContentUp(contentId) {
    let contentWrap = document.getElementById("content-wrap");
    let content = document.getElementById(contentId);
    
    if (content.previousElementSibling) {
        contentWrap.insertBefore(content, content.previousElementSibling);
    }
}

function moveContentDown(contentId) {
    let contentWrap = document.getElementById("content-wrap");
    let content = document.getElementById(contentId);
    
    if (content.nextElementSibling) {
        contentWrap.insertBefore(content, content.nextElementSibling.nextElementSibling);
    }
}

function changeContentType(contentId) {
    let content = document.getElementById(contentId);
    let newContentType = document.getElementById(contentId + "-type-drop-down").value;
    let existingContentType = content.dataset.contentType;
    let existingText;
    let newContent;
    
    switch (existingContentType) {                                  // Save existing header, question, or text
        case "header":
        case "question":
            existingText = content.children[1].children[1].value;
            break;
        case "long_text":
            existingText = content.children[1].children[1].children[0].value;
            break;
        default:                                                    // Media, flash, and default do not have exsisting text support
            existingText = "";
    }
    
    switch (newContentType) {                                       // Generate new content
        case "header":
            newContent = generateHeaderContent(contentId, existingText);
            break;
        case "long_text":
            newContent = generateLongTextContent(contentId, existingText);
            break;
        case "media":
            newContent = generateMediaContent(contentId);
            break;
        case "question":
            if (containsContentType("question")) {                  // Only allow one question
                alert("A card can only have one question content on it. You cannot have multiple questions at this time.");
                
                newContent = content;                               // Keep the old content;
                document.getElementById(newContent.id + "-type-drop-down").value = existingContentType;
                
                break;
            }
            newContent = generateQuestionContent(contentId, existingText);
            break;
        case "flash":
            newContent = generateFlashContent(contentId);
            break;
        default:
            newContent = content;                                   // If no type match, keep exsisting content
    }
    
    content.replaceWith(newContent);                                // Insert new content
    addSliderDots();                                                // Reset range dots on question content
}

function containsContentType(type) {
    let contents = document.getElementById("content-wrap").children;

    
    for (let content of contents) {
        if (content.dataset.contentType == type) return true;
    }
    
    return false;
}

function generateHeaderContent(contentId, existingText = "") {
    // vvv GENERATING THIS vvv
    /* <div class="content content-group space-after-lg" id="content-0" data-content-type="header">
     *   <svg class="icon" width="24px" height="24px" viewBox="0 0 960 960" xmlns="http://www.w3.org/2000/svg">
     *     <path fill="var(--body-text-color)" d="M200,800q-33,0-56.5-23.5t-23.5-56.5v-560q0-33,23.5-56.5t56.5-23.5h560q33,0,56.5,23.5t23.5,56.5v560q0,33-23.5,56.5t-56.5,23.5h-560m0-80h560v-560h-560v560zm220-370h-100q-25,0-42.5-17.5t-17.5-42.5q0-25,17.5-42.5t42.5-17.5h320q25,0,42.5,17.5t17.5,42.5q0,25-17.5,42.5t-42.5,17.5h-100v260q0,25-17.5,42.5t-42.5,17.5q-25,0-42.5-17.5t-17.5-42.5v-260z" />
     *   </svg>
     *   <div class="content">
     *     <div class="content-group space-after-med">
     *       <div class="content">
     *         <select name="content-type" onChange="changeContentType('content-0')" id="content-0-type-drop-down">
     *           <option value="header" selected>Heading</option>
     *           <option value="long_text">Text</option>
     *           <option value="media">Media</option>
     *           <option value="question">Question</option>
     *           <option value="flash">Flash Card</option>
     *         </select>
     *       </div>
     *       <button class="button-icon icon" aria-label="delete content" onClick="deleteContent('content-0');">
     *         <span class="material-symbols-rounded" aria-hidden="true">delete</span>
     *       </button>
     *       <button class="button-icon icon" aria-label="move content up" onClick="moveContentUp('content-0');">
     *         <span class="material-symbols-rounded" aria-hidden="true">keyboard_arrow_up</span>
     *       </button>
     *       <button class="button-icon icon" aria-label="move content down" onClick="moveContentDown('content-0');">
     *         <span class="material-symbols-rounded" aria-hidden="true">keyboard_arrow_down</span>
     *       </button>
     *     </div>
     *     <input type="text" class="content heading-text" placeholder="Heading" />
     *   </div>
     * </div>
     */
    
    let wrap = document.createElement("div");
    wrap.classList.add("content");
    wrap.classList.add("content-group");
    wrap.classList.add("space-after-lg");
    wrap.id = contentId;
    wrap.dataset.contentType = "header";
    
    let mainIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mainIcon.setAttribute("width", "24px");
    mainIcon.setAttribute("height", "24px");
    mainIcon.setAttribute("viewBox", "0 0 960 960");
    mainIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "var(--body-text-color)");
    path.setAttribute("d", "M200,800q-33,0-56.5-23.5t-23.5-56.5v-560q0-33,23.5-56.5t56.5-23.5h560q33,0,56.5,23.5t23.5,56.5v560q0,33-23.5,56.5t-56.5,23.5h-560m0-80h560v-560h-560v560zm220-370h-100q-25,0-42.5-17.5t-17.5-42.5q0-25,17.5-42.5t42.5-17.5h320q25,0,42.5,17.5t17.5,42.5q0,25-17.5,42.5t-42.5,17.5h-100v260q0,25-17.5,42.5t-42.5,17.5q-25,0-42.5-17.5t-17.5-42.5v-260z");
    
    let mainContent = document.createElement("div");
    mainContent.classList.add("content");
    
    let contentGroup = document.createElement("div");
    contentGroup.classList.add("content-group");
    contentGroup.classList.add("space-after-med");
    
    let dropDown = generateContentTypeDropDown(contentId, "header");
    
    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("content");
    input.classList.add("heading-text");
    input.placeholder = "Heading";
    input.value = existingText;
    
    wrap.appendChild(mainIcon);
    mainIcon.appendChild(path);
    wrap.appendChild(mainContent);
    mainContent.appendChild(contentGroup);
    contentGroup.appendChild(dropDown);
    
    contentGroup.appendChild(createIconButton("delete", "delete content", function() { deleteContent(contentId) } ));
    contentGroup.appendChild(createIconButton("keyboard_arrow_up", "move content up", function() { moveContentUp(contentId)} ));
    contentGroup.appendChild(createIconButton("keyboard_arrow_down", "move content down", function() { moveContentDown(contentId)} ));
    
    mainContent.appendChild(input);
    
    return wrap;
}

function generateLongTextContent(contentId, existingText = "") {
    // vvv GENERATING THIS vvv
    /* <div class="content content-group space-after-lg" id="content-1" data-content-type="long_text">
     *   <span class="material-symbols-rounded" aria-hidden="true" aria-label="text">article</span>
     *   <div class="content">
     *     <div class="content-group space-after-med">
     *       <div class="content">
     *         <select name="content-type" onChange="changeContentType('content-1')" id="content-1-type-drop-down">
     *           <option value="header">Heading</option>
     *           <option value="long_text" selected>Text</option>
     *           <option value="media">Media</option>
     *           <option value="question">Question</option>
     *           <option value="flash">Flash Card</option>
     *         </select>
     *       </div>
     *       <button class="button-icon icon" aria-label="copy content">
     *         <span class="material-symbols-rounded" aria-hidden="true">content_copy</span>
     *       </button>
     *       <button class="button-icon icon" aria-label="delete content">
     *         <span class="material-symbols-rounded" aria-hidden="true">delete</span>
     *       </button>
     *       <button class="button-icon icon" aria-label="move content up">
     *         <span class="material-symbols-rounded" aria-hidden="true">keyboard_arrow_up</span>
     *       </button>
     *       <button class="button-icon icon" aria-label="move content down">
     *         <span class="material-symbols-rounded" aria-hidden="true">keyboard_arrow_down</span>
     *       </button>
     *     </div>
     *     <div class="content grow-wrap">
     *       <textarea onInput="this.parentNode.dataset.replicatedValue = this.value;" placeholder="Text"></textarea>
     *     </div>
     *   </div>
     * </div>
     */

    let wrap = document.createElement("div");
    wrap.classList.add("content");
    wrap.classList.add("content-group");
    wrap.classList.add("space-after-lg");
    wrap.id = contentId;
    wrap.dataset.contentType = "long_text";

    let mainIcon = document.createElement("span");
    mainIcon.classList.add("icon");
    mainIcon.classList.add("material-symbols-rounded");
    mainIcon.setAttribute("aria-hidden", "true");
    mainIcon.setAttribute("aria-label", "text");
    mainIcon.innerHTML = "article";

    let mainContent = document.createElement("div");
    mainContent.classList.add("content");

    let contentGroup = document.createElement("div");
    contentGroup.classList.add("content-group");
    contentGroup.classList.add("space-after-med");

    let dropDownContent = generateContentTypeDropDown(contentId, "long_text");
    let textAreaWrap = generateTextArea("Text", existingText);

    wrap.appendChild(mainIcon);
    wrap.appendChild(mainContent);
    mainContent.appendChild(contentGroup);
    contentGroup.appendChild(dropDownContent);

    contentGroup.appendChild(createIconButton("delete", "delete content", function() { deleteContent(contentId) } ));
    contentGroup.appendChild(createIconButton("keyboard_arrow_up", "move content up", function() { moveContentUp(contentId)} ));
    contentGroup.appendChild(createIconButton("keyboard_arrow_down", "move content down", function() { moveContentDown(contentId)} ));

    mainContent.appendChild(textAreaWrap);
    
    return wrap;
}

function generateMediaContent(contentId) {
    // vvv GENERATING THIS vvv
    /* <div class="content content-group space-after-lg" id="content-2" data-content-type="media">
     *   <span class="material-symbols-rounded" aria-hidden="true" aria-label="media">image</span>
     *   <div class="content">
     *     <div class="content-group space-after-med">
     *       <div>
     *         <select name="content-type" onChange="changeContentType('content-2')" id="content-2-type-drop-down">
     *           <option value="header">Heading</option>
     *           <option value="long_text">Text</option>
     *           <option value="media" selected>Media</option>
     *           <option value="question">Question</option>
     *           <option value="flash">Flash Card</option>
     *         </select>
     *       </div>
     *
     *       <div class="icon-separator"></div>
     *       <span class="material-symbols-rounded icon" aria-label="upload media" aria-hidden="true">upload</span>
     *       <input type="file" class="content" accept="image/*" />
     *
     *       <form class="element-group slide-select">
     *         <label class="button-icon icon" aria-label="left justify content" name="content-2-slide-select">
     *           <input type="radio" name="content-2-slide-select-input" value="left-justify" onChange="updateSlideSelect('content-2')" />
     *           <span class="material-symbols-rounded" aria-hidden="true">format_image_left</span>
     *         </label>
     *         <label class="button-icon icon active" aria-label="left justify content" name="content-2-slide-select">
     *           <input type="radio" name="content-2-slide-select-input" value="center-justify" onChange="updateSlideSelect('content-2')" checked />
     *           <svg width="24px" height="24px" viewBox="0 0 960 960" xmlns="http://www.w3.org/2000/svg">
     *             <path fill="var(--body-text-color)" d="M320,680q-17,0-28.5-11.5t-11.5-28.5v-320q0-17,11.5-28.5t28.5-11.5h320q17,0,28.5,11.5t11.5,28.5v320q0,17-11.5,28.5t-28.5,11.5h-320zm40-80h240v-240h-240v240zm-200-400q-17,0-28.5-11.5t-11.5-28.5q0-17,11.5-28.5t28.5-11.5h640q17,0,28.5,11.5t11.5,28.5q0,17-11.5,28.5t-28.5,11.5h-640zm0,640q-17,0-28.5-11.5t-11.5-28.5q0-17,11.5-28.5t28.5-11.5h640q17,0,28.5,11.5t11.5,28.5q0,17-11.5,28.5t-28.5,11.5h-640z" />
     *           </svg>
     *         </label>
     *         <label class="button-icon icon" aria-label="left justify content" name="content-2-slide-select">
     *           <input type="radio" name="content-2-slide-select-input" value="right-justify" onChange="updateSlideSelect('content-2')" />
     *           <span class="material-symbols-rounded" aria-hidden="true">format_image_right</span>
     *         </label>
     *       </form>
     *
     *       <div class="icon-separator"></div>
     *
     *       <button class="button-icon icon" aria-label="delete content" onClick="deleteContent('content-2');">
     *         <span class="material-symbols-rounded" aria-hidden="true">delete</span>
     *       </button>
     *       <button class="button-icon icon" aria-label="move content up" onClick="moveContentUp('content-2');">
     *         <span class="material-symbols-rounded" aria-hidden="true">keyboard_arrow_up</span>
     *       </button>
     *       <button class="button-icon icon" aria-label="move content down" onClick="moveContentDown('content-2');">
     *         <span class="material-symbols-rounded" aria-hidden="true">keyboard_arrow_down</span>
     *       </button>
     *     </div>
     *     <div class="stackable-group">
     *       <div class="content image space-after-med" id="content-2-media">
     *         <img src="images/greenhouse.jpg" alt="" />
     *         <div class="description hidden" id="content-2-alt"></div>
     *       </div>
     *       <div class="content space-after-med">
     *         <h4 class="content space-after-med">Image Description</h4>
     *         <div class="content grow-wrap">
     *           <textarea onInput="this.parentNode.dataset.replicatedValue = this.value; updateImageAlt('content-2');" placeholder="Description" id="content-2-description"></textarea>
     *         </div>
     *         <div class="content">
     *           <label class="choice-input center-up-down" id="content-2-switch">
     *             <input onchange="updateAltDescription('content-2'); updateSwitchIcons('content-2');" type="checkbox" />
     *             <span class="material-symbols-rounded icon button-icon" aria-hidden="true">toggle_off</span>
     *             <span>Show description on card</span>
     *           </label>
     *         </div>
     *       </div>
     *     </div>
     *   </div>
     * </div>
     */
    
    let wrap = document.createElement("div");
    wrap.classList.add("content");
    wrap.classList.add("content-group");
    wrap.classList.add("space-after-lg");
    wrap.id = contentId;
    wrap.dataset.contentType = "media";
    
    let mainIcon = document.createElement("span");
    mainIcon.classList.add("icon");
    mainIcon.classList.add("material-symbols-rounded");
    mainIcon.setAttribute("aria-hidden", "true");
    mainIcon.setAttribute("aria-label", "media");
    mainIcon.innerHTML = "image";
    
    let mainContent = document.createElement("div");
    mainContent.classList.add("content");

    let contentGroup = document.createElement("div");
    contentGroup.classList.add("content-group");
    contentGroup.classList.add("space-after-med");
    
    let dropDown = generateContentTypeDropDown(contentId, "media");
    dropDown.classList.remove("content");
    
    let iconSeprator1 = document.createElement("div");
    iconSeprator1.classList.add("icon-separator");
    
    let uploadIcon = document.createElement("span");
    uploadIcon.classList.add("material-symbols-rounded");
    uploadIcon.setAttribute("aria-hidden", "true");
    uploadIcon.setAttribute("aria-label", "upload media");
    uploadIcon.innerHTML = "upload";
    
    let uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.classList.add("content");
    uploadInput.setAttribute("accept", "image/*");
    
    let slideSelect = document.createElement("form");
    slideSelect.classList.add("element-group");
    slideSelect.classList.add("slide-select");
    
    let slideSelectLabel1 = document.createElement("label");
    slideSelectLabel1.classList.add("button-icon");
    slideSelectLabel1.classList.add("icon");
    slideSelectLabel1.setAttribute("aria-label", "left justify content");
    slideSelectLabel1.setAttribute("name", contentId + "-slide-select");
    
    let slideSelectInput1 = document.createElement("input");
    slideSelectInput1.type = "radio";
    slideSelectInput1.name = contentId + "-slide-select-input";
    slideSelectInput1.value = "left-justify";
    slideSelectInput1.addEventListener("change", function() { updateSlideSelect(contentId) } );
    
    let slideSelectIcon1 = document.createElement("span");
    slideSelectIcon1.classList.add("material-symbols-rounded");
    slideSelectIcon1.setAttribute("aria-hidden", "true");
    slideSelectIcon1.innerHTML = "format_image_left";
    
    let slideSelectLabel2 = slideSelectLabel1.cloneNode();
    slideSelectLabel2.classList.add("active");
    
    let slideSelectInput2 = slideSelectInput1.cloneNode();
    slideSelectInput2.value = "center-justify";
    slideSelectInput2.addEventListener("change", function() { updateSlideSelect(contentId) } );
    slideSelectInput2.checked = true;
    
    let slideSelectIcon2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    slideSelectIcon2.setAttribute("width", "24px");
    slideSelectIcon2.setAttribute("height", "24px");
    slideSelectIcon2.setAttribute("viewBox", "0 0 960 960");
    slideSelectIcon2.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "var(--body-text-color)");
    path.setAttribute("d", "M320,680q-17,0-28.5-11.5t-11.5-28.5v-320q0-17,11.5-28.5t28.5-11.5h320q17,0,28.5,11.5t11.5,28.5v320q0,17-11.5,28.5t-28.5,11.5h-320zm40-80h240v-240h-240v240zm-200-400q-17,0-28.5-11.5t-11.5-28.5q0-17,11.5-28.5t28.5-11.5h640q17,0,28.5,11.5t11.5,28.5q0,17-11.5,28.5t-28.5,11.5h-640zm0,640q-17,0-28.5-11.5t-11.5-28.5q0-17,11.5-28.5t28.5-11.5h640q17,0,28.5,11.5t11.5,28.5q0,17-11.5,28.5t-28.5,11.5h-640z");
    
    let slideSelectLabel3 = slideSelectLabel1.cloneNode();
    
    let slideSelectInput3 = slideSelectInput1.cloneNode();
    slideSelectInput3.value = "right-justify";
    slideSelectInput3.addEventListener("change", function() { updateSlideSelect(contentId) } );
    
    let slideSelectIcon3 = slideSelectIcon1.cloneNode();
    slideSelectIcon3.innerHTML = "format_image_right";
    
    let iconSeprator2 = iconSeprator1.cloneNode();
    
    let stackableGroup = document.createElement("div");
    stackableGroup.classList.add("stackable-group");
    
    let imageContent = document.createElement("div");
    imageContent.classList.add("content");
    imageContent.classList.add("image");
    imageContent.classList.add("space-after-med");
    imageContent.id = contentId + "-media";
    
    let img = document.createElement("img");
    img.src = "images/greenhouse.jpg";
    
    let imgAlt = document.createElement("div");
    imgAlt.classList.add("description");
    imgAlt.classList.add("hidden");
    imgAlt.id = contentId + "-alt";
    
    let optionContent = document.createElement("div");
    optionContent.classList.add("content");
    optionContent.classList.add("space-after-med");
    
    let optionHeader = document.createElement("h4");
    optionHeader.classList.add("content");
    optionHeader.classList.add("space-after-med");
    optionHeader.innerHTML = "Image Description";
    
    let textArea = generateTextArea("Description");
    let textInput = textArea.children[0];
    textInput.id = contentId + "-description";                      // Set the text area's id, not set by the function
    textInput.addEventListener("input", function() { updateImageAlt(contentId) } );
    
    let showDescriptionContent = document.createElement("div");
    showDescriptionContent.classList.add("content");
    
    let showDescriptionLabel = document.createElement("label");
    showDescriptionLabel.classList.add("choice-input");
    showDescriptionLabel.classList.add("center-up-down");
    showDescriptionLabel.id = contentId + "-switch";
    
    let showDescriptionSwitch = document.createElement("input");
    showDescriptionSwitch.type = "checkbox";
    showDescriptionSwitch.addEventListener("change", function() {
        updateAltDescription(contentId);
        updateSwitchIcons(contentId);
    } );
    
    let showDescriptionIcon = document.createElement("span");
    showDescriptionIcon.classList.add("material-symbols-rounded");
    showDescriptionIcon.classList.add("button-icon");
    showDescriptionIcon.classList.add("icon");
    showDescriptionIcon.setAttribute("aria-hidden", "true");
    showDescriptionIcon.innerHTML = switchOff;
    
    let showDescriptionText = document.createElement("span");
    showDescriptionText.innerHTML = "Show description on card";
    
    wrap.appendChild(mainIcon);
    wrap.appendChild(mainContent);
    mainContent.appendChild(contentGroup);
    
    contentGroup.appendChild(dropDown);
    contentGroup.appendChild(iconSeprator1);
    contentGroup.appendChild(uploadIcon);
    contentGroup.appendChild(uploadInput);
    contentGroup.appendChild(slideSelect);
    
    slideSelect.appendChild(slideSelectLabel1);
    slideSelect.appendChild(slideSelectLabel2);
    slideSelect.appendChild(slideSelectLabel3);
    
    slideSelectLabel1.appendChild(slideSelectInput1);
    slideSelectLabel1.appendChild(slideSelectIcon1);
    
    slideSelectLabel2.appendChild(slideSelectInput2);
    slideSelectLabel2.appendChild(slideSelectIcon2);
    slideSelectIcon2.appendChild(path);
    
    slideSelectLabel3.appendChild(slideSelectInput3);
    slideSelectLabel3.appendChild(slideSelectIcon3);
    
    contentGroup.appendChild(iconSeprator2);
    contentGroup.appendChild(createIconButton("delete", "delete content", function() { deleteContent(contentId) } ));
    contentGroup.appendChild(createIconButton("keyboard_arrow_up", "move content up", function() { moveContentUp(contentId)} ));
    contentGroup.appendChild(createIconButton("keyboard_arrow_down", "move content down", function() { moveContentDown(contentId)} ));
    
    mainContent.appendChild(stackableGroup);
    stackableGroup.appendChild(imageContent);
    
    imageContent.appendChild(img);
    imageContent.appendChild(imgAlt);
    
    stackableGroup.appendChild(optionContent);
    optionContent.appendChild(optionHeader);
    optionContent.appendChild(textArea);
    optionContent.appendChild(showDescriptionContent);
    
    showDescriptionContent.appendChild(showDescriptionLabel);
    showDescriptionLabel.appendChild(showDescriptionSwitch);
    showDescriptionLabel.appendChild(showDescriptionIcon);
    showDescriptionLabel.appendChild(showDescriptionText);
    
    return wrap;
}

function generateQuestionContent(contentId, existingText = "") {
    // vv GENERATING THIS vvv
    /* <div class="content content-group space-after-lg" id="content-3" data-content-type="question">
     *   <span class="material-symbols-rounded" aria-hidden="true" aria-label="question">help_center</span>
     *   <div class="content">
     *     <div class="content-group space-after-med">
     *       <div class="content">
     *         <select name="content-type" onChange="changeContentType('content-3')" id="content-3-type-drop-down">
     *           <option value="header">Heading</option>
     *           <option value="long_text">Text</option>
     *           <option value="media">Media</option>
     *           <option value="question" selected>Question</option>
     *           <option value="flash">Flash Card</option>
     *         </select>
     *       </div>
     *       <button class="button-icon icon" aria-label="delete content" onClick="deleteContent('content-3');">
     *         <span class="material-symbols-rounded" aria-hidden="true">delete</span>
     *       </button>
     *       <button class="button-icon icon" aria-label="move content up" onClick="moveContentUp('content-3');">
     *         <span class="material-symbols-rounded" aria-hidden="true">keyboard_arrow_up</span>
     *       </button>
     *       <button class="button-icon icon" aria-label="move content down" onClick="moveContentDown('content-3');">
     *         <span class="material-symbols-rounded" aria-hidden="true">keyboard_arrow_down</span>
     *       </button>
     *     </div>
     *     <input type="text" class="content heading-text space-after-med" placeholder="Question" />
     *
     *     <div class="content stackable-group space-after-med">
     *       <div class="content">
     *         <div class="center-up-down space-after-med">
     *           <label for="content-3-question-type">Question type</label>
     *           <select name="content-3-question-type" id="content-3-question-type" onchange="changeQuestionType('content-3')">
     *             <option value="select-one">Select one</option>
     *             <option value="select-many">Select many</option>
     *           </select>
     *         </div>
     *         <div class="center-up-down space-after-med">
     *           <label class="choice-input center-up-down" id="content-3-switch">
     *             <input onchange="updateSwitchIcons('content-3')" type="checkbox" />
     *             <span class="material-symbols-rounded icon button-icon" aria-hidden="true">toggle_off</span>
     *             <span>Randomize answer order</span>
     *           </label>
     *         </div>
     *         <div class="range-label space-after-sm">
     *           <span>Introductory</span>
     *           <span>Advanced</span>
     *         </div>
     *         <div class="range-wrap space-after-med" name="dotted-range">
     *           <input type="range" name="difficulty" id="content-3-difficulty" aria-label="difficulty" />
     *           <div class="range-dot-wrap" id="difficulty-range-dots"></div>
     *           <script>addSliderDots();</script>
     *         </div>
     *       </div>
     *       <div class="content question">
     *         <div id="content-3-choices">
     *           <div class="center-up-down space-after-med" data-last="true">
     *             <label class="choice-input" name="content-3-choice-input">
     *               <input onChange="updateQuestionIcon('content-3')" type="radio" id="choice-0" name="content-3-question" checked />
     *               <span class="material-symbols-rounded icon button-icon" aria-hidden="true">check_circle</span>
     *             </label>
     *             <input onChange="addOptionHandler('content-3')" type="text" id="choice-0-label" placeholder="Option" />
     *           </div>
     *
     *         </div>
     *       </div>
     *     </div>
     *
     *     <h4 class="content space-after-med">Incorrect</h4>
     *     <div class="content grow-wrap">
     *       <textarea onInput="this.parentNode.dataset.replicatedValue = this.value;" placeholder="Incorrect answer prompt"></textarea>
     *     </div>
     *   </div>
     * </div>
     */
    
    let wrap = document.createElement("div");
    wrap.classList.add("content");
    wrap.classList.add("content-group");
    wrap.classList.add("space-after-lg");
    wrap.id = contentId;
    wrap.dataset.contentType = "question";
    
    let mainIcon = document.createElement("span");
    mainIcon.classList.add("icon");
    mainIcon.classList.add("material-symbols-rounded");
    mainIcon.setAttribute("aria-hidden", "true");
    mainIcon.setAttribute("aria-label", "question");
    mainIcon.innerHTML = "help_center";
    
    let mainContent = document.createElement("div");
    mainContent.classList.add("content");

    let contentGroup = document.createElement("div");
    contentGroup.classList.add("content-group");
    contentGroup.classList.add("space-after-med");
    
    let dropDown = generateContentTypeDropDown(contentId, "question");
    
    let questionInput = document.createElement("input");
    questionInput.classList.add("content");
    questionInput.classList.add("heading-text");
    questionInput.classList.add("space-after-med");
    questionInput.placeholder = "Question";
    questionInput.type = "text";
    questionInput.value = existingText;
    
    let stackableGroup = document.createElement("div");
    stackableGroup.classList.add("content");
    stackableGroup.classList.add("stackable-group");
    stackableGroup.classList.add("space-after-med");
    
    let optionContent = document.createElement("div");
    optionContent.classList.add("content");
    
    let questionTypeWrap = document.createElement("div");
    questionTypeWrap.classList.add("center-up-down");
    questionTypeWrap.classList.add("space-after-med");

    let questionTypeLabel = document.createElement("label");
    questionTypeLabel.setAttribute("for", contentId + "-question-type");
    questionTypeLabel.innerHTML = "Question type";
    
    let questionTypeSelect = document.createElement("select");
    questionTypeSelect.setAttribute("name", contentId + "-question-type");
    questionTypeSelect.id = contentId + "-question-type";
    questionTypeSelect.addEventListener("change", function() { changeQuestionType(contentId) } );
    
    let questionType1 = document.createElement("option");
    questionType1.value = "select-one";
    questionType1.innerHTML = "Select one";
    questionType1.checked = "true";
    
    let questionType2 = document.createElement("option");
    questionType2.value = "select-many";
    questionType2.innerHTML = "Select many";
    
    let randomizeWrap = document.createElement("div");
    randomizeWrap.classList.add("center-up-down");
    randomizeWrap.classList.add("space-after-med");
    
    let randomizeLabel = document.createElement("label");
    randomizeLabel.classList.add("choice-input");
    randomizeLabel.classList.add("center-up-down");
    randomizeLabel.id = contentId + "-switch";
    
    let randomizeInput = document.createElement("input");
    randomizeInput.type = "checkbox";
    randomizeInput.addEventListener("change", function() { updateSwitchIcons(contentId) } );
    
    let randomizeIcon = document.createElement("span");
    randomizeIcon.classList.add("material-symbols-rounded");
    randomizeIcon.classList.add("button-icon");
    randomizeIcon.classList.add("icon");
    randomizeIcon.setAttribute("aria-hidden", "true");
    randomizeIcon.innerHTML = switchOff;
    
    let randomizeText = document.createElement("span");
    randomizeText.innerHTML = "Randomize answer order";
    
    let rangeLabel = document.createElement("div");
    rangeLabel.classList.add("range-label");
    rangeLabel.classList.add("space-after-sm");
    rangeLabel.innerHTML = "<span>Introductory</span><span>Advanced</span>";
    
    let rangeWrap = document.createElement("div");
    rangeWrap.classList.add("range-wrap");
    rangeWrap.classList.add("space-after-med");
    rangeWrap.setAttribute("name", "dotted-range");
    
    let range = document.createElement("input");
    range.type = "range";
    range.id = contentId + "-difficulty";
    range.setAttribute("name", "difficulty");
    range.setAttribute("aria-label", "difficulty");
    range.min = 1;
    range.max = 5;
    range.value = 3;
    
    let rangeDotWrap = document.createElement("div");               // Dots created by addSliderDots(), called in previous method after being added to body
    rangeDotWrap.classList.add("range-dot-wrap");
    rangeDotWrap.id = "difficulty-range-dots";
    
    let choiceContent = document.createElement("div");
    choiceContent.classList.add("content");
    choiceContent.classList.add("question");
    
    let choicesWrap = document.createElement("div");
    choicesWrap.id = contentId + "-choices";
    
    let optionWrap = document.createElement("div");
    optionWrap.classList.add("center-up-down");
    optionWrap.classList.add("space-after-med");
    optionWrap.dataset.last = "true";
    
    let optionLabel = document.createElement("label");
    optionLabel.classList.add("choice-input");
    optionLabel.setAttribute("name", contentId + "-choice-input");
    
    let optionInput = document.createElement("input");
    optionInput.type = "radio";
    optionInput.checked = "true";
    optionInput.id = "choice-0";
    optionInput.setAttribute("name", contentId + "-question");
    optionInput.addEventListener("change", function() { updateQuestionicon(contetnId) } );
    
    let optionIcon = document.createElement("span");
    optionIcon.classList.add("material-symbols-rounded");
    optionIcon.classList.add("button-icon");
    optionIcon.classList.add("icon");
    optionIcon.setAttribute("aria-hidden", "true");
    optionIcon.innerHTML = checkedOne;
    
    let optionText = document.createElement("input");
    optionText.type = "text";
    optionText.id = "choice-0-label";
    optionText.placeholder = "Option";
    optionText.addEventListener("change", function() { addOptionHandler(contentId) } );
    
    let incorrectHeader = document.createElement("h4");
    incorrectHeader.classList.add("content");
    incorrectHeader.classList.add("space-after-med");
    incorrectHeader.innerHTML = "Incorrect";
    
    let textArea = generateTextArea("Incorrect answer prompt");
    
    wrap.appendChild(mainIcon);
    wrap.appendChild(mainContent);
    
    mainContent.appendChild(contentGroup);
    mainContent.appendChild(questionInput);
    mainContent.appendChild(stackableGroup);
    mainContent.appendChild(incorrectHeader);
    mainContent.appendChild(textArea);
    
    contentGroup.appendChild(dropDown);
    contentGroup.appendChild(createIconButton("delete", "delete content", function() { deleteContent(contentId) } ));
    contentGroup.appendChild(createIconButton("keyboard_arrow_up", "move content up", function() { moveContentUp(contentId)} ));
    contentGroup.appendChild(createIconButton("keyboard_arrow_down", "move content down", function() { moveContentDown(contentId)} ));

    stackableGroup.appendChild(optionContent);
    optionContent.appendChild(questionTypeWrap);
    
    questionTypeWrap.appendChild(questionTypeLabel);
    questionTypeWrap.appendChild(questionTypeSelect);
    questionTypeSelect.appendChild(questionType1);
    questionTypeSelect.appendChild(questionType2);
    
    optionContent.appendChild(randomizeWrap);
    randomizeWrap.appendChild(randomizeLabel);
    randomizeLabel.appendChild(randomizeInput);
    randomizeLabel.appendChild(randomizeIcon);
    randomizeLabel.appendChild(randomizeText);
    
    optionContent.appendChild(rangeLabel);
    optionContent.appendChild(rangeWrap);
    rangeWrap.appendChild(range);
    rangeWrap.appendChild(rangeDotWrap);
    
    stackableGroup.appendChild(choiceContent);
    choiceContent.appendChild(choicesWrap);
    choicesWrap.appendChild(optionWrap);
    optionWrap.appendChild(optionLabel);
    optionLabel.appendChild(optionInput);
    optionLabel.appendChild(optionIcon);
    
    optionWrap.appendChild(optionText);
    
    return wrap
}

function generateFlashContent(contentId) {
    // vvv GENERATING THIS vvv
    /* <div class="content content-group space-after-lg" id="content-4" data-content-type="flash">
     *   <span class="material-symbols-rounded" aria-hidden="true" aria-label="question">sticky_note_2</span>
     *   <div class="content">
     *     <div class="content-group space-after-med">
     *       <div class="content">
     *         <select name="content-type" onChange="changeContentType('content-4')" id="content-4-type-drop-down">
     *           <option value="header">Heading</option>
     *           <option value="long_text">Text</option>
     *           <option value="media">Media</option>
     *           <option value="question">Question</option>
     *           <option value="flash" selected>Flash Card</option>
     *         </select>
     *       </div>
     *       
     *       <button class="button-icon icon" aria-label="swap front and back">
     *         <span class="material-symbols-rounded" aria-hidden="true">swap_vert</span>
     *       </button>
     *       
     *       <div class="icon-separator"></div>
     *       
     *       <button class="button-icon icon" aria-label="delete content" onClick="deleteContent('content-4');">
     *         <span class="material-symbols-rounded" aria-hidden="true">delete</span>
     *       </button>
     *       <button class="button-icon icon" aria-label="move content up" onClick="moveContentUp('content-4');";>
     *         <span class="material-symbols-rounded" aria-hidden="true">keyboard_arrow_up</span>
     *       </button>
     *       <button class="button-icon icon" aria-label="move content down" onClick="moveContentDown('content-4');">
     *         <span class="material-symbols-rounded" aria-hidden="true">keyboard_arrow_down</span>
     *       </button>
     *     </div>
     *     
     *     <div class="content flash-card-wrap space-after-med">
     *       <h4 class="content space-after-med">Front</h3>
     *     </div>
     *     
     *     <div class="content flash-card-wrap space-after-med">
     *       <h4 class="content space-after-med">Back</h3>
     *     </div>
     *   </div>
     * </div>
     */

    let wrap = document.createElement("div");
    wrap.classList.add("content");
    wrap.classList.add("content-group");
    wrap.classList.add("space-after-lg");
    wrap.id = contentId;
    wrap.dataset.contentType = "flash";
    
    let mainIcon = document.createElement("span");
    mainIcon.classList.add("icon");
    mainIcon.classList.add("material-symbols-rounded");
    mainIcon.setAttribute("aria-hidden", "true");
    mainIcon.setAttribute("aria-label", "flash card");
    mainIcon.innerHTML = "sticky_note_2";
    
    let mainContent = document.createElement("div");
    mainContent.classList.add("content");

    let contentGroup = document.createElement("div");
    contentGroup.classList.add("content-group");
    contentGroup.classList.add("space-after-med");
    
    let dropDown = generateContentTypeDropDown(contentId, "flash");
    
    let iconSeprator = document.createElement("div");
    iconSeprator.classList.add("icon-separator");
    
    let frontContainer = document.createElement("div");
    frontContainer.classList.add("content");
    frontContainer.classList.add("flash-card-wrap");
    frontContainer.classList.add("space-after-med");
    
    let backContainer = frontContainer.cloneNode();
    
    let frontHeader = document.createElement("h4");
    frontHeader.classList.add("content");
    frontHeader.classList.add("space-after-med");
    frontHeader.innerHTML = "Front";
    
    let backHeader = frontHeader.cloneNode();
    backHeader.innerHTML = "Back";
    
    wrap.appendChild(mainIcon);
    wrap.appendChild(mainContent);
    mainContent.appendChild(contentGroup);
    
    contentGroup.appendChild(dropDown);
    contentGroup.appendChild(createIconButton("swap_vert", "swap front and back"));
    contentGroup.appendChild(iconSeprator);
    contentGroup.appendChild(createIconButton("delete", "delete content", function() { deleteContent(contentId) } ));
    contentGroup.appendChild(createIconButton("keyboard_arrow_up", "move content up", function() { moveContentUp(contentId)} ));
    contentGroup.appendChild(createIconButton("keyboard_arrow_down", "move content down", function() { moveContentDown(contentId)} ));
    
    mainContent.appendChild(frontContainer);
    frontContainer.appendChild(frontHeader);
    
    mainContent.appendChild(backContainer);
    backContainer.appendChild(backHeader);
    
    return wrap;
}

function generateContentTypeDropDown(contentId, selectedContentType = "long_text") {
    let dropDownContent = document.createElement("div");
    dropDownContent.classList.add("content");

    let dropDown = document.createElement("select");
    dropDown.name = "content-type";
    dropDown.id = contentId + "-type-drop-down";
    dropDown.addEventListener("change", function() { changeContentType(contentId) } );

    const dropDownOptionsIndex = ["header", "long_text", "media", "question", "flash"];
    const dropDownOptionsSeen = ["Heading", "Text", "Media", "Question", "Flash Card"];
    
    for (let i = 0; i < dropDownOptionsIndex.length; i++) {
        let newOption = document.createElement("option");
        newOption.value = dropDownOptionsIndex[i];
        newOption.innerHTML = dropDownOptionsSeen[i];
        if (dropDownOptionsIndex[i] == selectedContentType) {
            newOption.selected = true;
        }
        dropDown.appendChild(newOption);
    }
    
    dropDownContent.appendChild(dropDown);
    return dropDownContent;
}

function generateTextArea(placeholder = "", value = "") {
    let textAreaWrap = document.createElement("div");
    textAreaWrap.classList.add("content");
    textAreaWrap.classList.add("grow-wrap");

    let textArea = document.createElement("textarea");
    textArea.placeholder = placeholder;
    textArea.value = value;
    textArea.addEventListener("input", function() { this.parentNode.dataset.replicatedValue = this.value; }, false);
    
    textAreaWrap.appendChild(textArea);
    return textAreaWrap;
}
