const checkedOne = "radio_button_checked";
const uncheckedOne = "radio_button_unchecked";
const checkedMany = "check_box";
const uncheckedMany = "check_box_outline_blank";

function updateIcons() {
    let options = document.getElementsByName("choice-input");
    let questionType = "select-one";
    
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
