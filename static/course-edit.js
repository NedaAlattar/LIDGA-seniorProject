function save() {
    console.warn("save() not implemted!");
}

function updateCourseIcon() {
    const courseIcon = document.getElementById("course-icon");
    const categorySelect = document.getElementById("course-catagory");

    switch (categorySelect.value) {
        case "ART":
            courseIcon.innerHTML = "theater_comedy";
            break;
        case "COR":
            courseIcon.innerHTML = "school";
            break;
        case "TEC":
            courseIcon.innerHTML = "terminal";
            break;
        case "GE ":
            courseIcon.innerHTML = "engineering";
            break;
        case "ENG":
            courseIcon.innerHTML = "book_5";
            break;
        default:
            courseIcon.innerHTML = "school";
            break;
    }
    
    // TODO: Save change
}
