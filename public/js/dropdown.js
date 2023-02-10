let isDroppedDown = false;

const hamburger = document.getElementById("hamburger");
hamburger.addEventListener("click", () => {
    if (!isDroppedDown) {
        isDroppedDown = true;
        document.querySelector(".dropdown-nav").style.display = "block";
        document.getElementById("hamburger").src = "imgs/close.svg";       
    } else {
        isDroppedDown = false;
        document.querySelector(".dropdown-nav").style.display = "none";
        document.getElementById("hamburger").src = "imgs/hamburger.svg";       
    }
});