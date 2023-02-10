const filtersToDisplay = document.getElementById("filters-to-display");
const filterHeading = document.querySelector(".filter-heading");
let filtersAreDroppedDown = false;
filterHeading.addEventListener("click", () => {
    if (!filtersAreDroppedDown) {
        filtersAreDroppedDown = true;
        filtersToDisplay.style.display = "block";
    } else {
        filtersAreDroppedDown = false;
        filtersToDisplay.style.display = "none";
    }
});