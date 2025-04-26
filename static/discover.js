var searchInput = document.getElementById("search");
var noSearchText = document.getElementById("empty-search");
var courses = document.getElementById("courses").children;

function updateSearch() {
    let normilizedSearch = searchInput.value.toUpperCase();
    normilizedSearch = normilizedSearch.replace(/^ +| +$|[\.,\|\!\?\\/:]/g, ""); // Remove start and end spaces and unwanted chars
    normilizedSearch = normilizedSearch.replace(/ +/g, " ");        // Remove multiple spaces
    normilizedSearch = normilizedSearch.replaceAll("&", "AND");
    
    noSearchText.classList.remove("hidden");
    
    for (let course of courses) {
        if (
            course.dataset.name.includes(normilizedSearch)
            | course.dataset.catagory.includes(normilizedSearch)
            | course.dataset.instructor.includes(normilizedSearch)
            | course.children[1].children[1].innerHTML.toUpperCase().includes(normilizedSearch) // If in description
        ) {
            course.classList.remove("hidden");
            noSearchText.classList.add("hidden");
        } else
            course.classList.add("hidden");
    }
}

const startText = "Search by ";
const endTexts = ["course", "instructor", "catagory", "description"];
var textIndex = 0;

setInterval(function() {
    textIndex = ++textIndex % endTexts.length;
    searchInput.placeholder = startText + endTexts[textIndex];
}, 3000);
