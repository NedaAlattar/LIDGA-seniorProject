
window.onload = function() {
    let isCorrect = "{ isCorrect }"; 

    if (isCorrect === "True") {
        document.getElementById("correctMessage").style.display = "block";
        document.getElementById("incorrectMessage").style.display = "none";
    } else if (isCorrect === "False") {
        document.getElementById("correctMessage").style.display = "none";
        document.getElementById("incorrectMessage").style.display = "block";
    } else {
        document.getElementById("correctMessage").style.display = "none";
        document.getElementById("incorrectMessage").style.display = "none"; 
    }
};
