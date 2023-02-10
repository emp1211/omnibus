let showApple = false;
let showSamsung = false;
let showMotorola = false;
let showGoogle = false;

const appleFilter = document.getElementById("apple");
const samsungFilter = document.getElementById("samsung");
const motorolaFilter = document.getElementById("motorola");
const googleFilter = document.getElementById("google");

let showSub500s = false;
let show500s = false;
let show600s = false;
let show700s = false;

const filterSub500 = document.getElementById("filter-sub-500");
const filter500 = document.getElementById("filter500");
const filter600 = document.getElementById("filter600");
const filter700 = document.getElementById("filter700");

// TODO :
// need to add a check at end of click event listeners that checks if all 4 showApple, showSamsung, etc are false
// if they are all false, after the box has been been clicked, then a function displayAllProducts() should be called to show allProducts

let allProducts = document.querySelectorAll('.manufacturer');
let allPrices = document.querySelectorAll('.price');


const displayAllProducts = (arr) => {
    arr.forEach((product) => {
        let detailsDiv = product.parentNode;
        let productTile = detailsDiv.parentNode;
        productTile.style.display = '';
    })
}

const ifAllFiltersOff = () => {
    if ((showApple === false) && (showSamsung === false) && (showMotorola === false) && (showGoogle === false) && 
       (showSub500s === false) && (show500s === false) && (show600s === false) && (show700s === false)) {
        console.log('remove all filters ran');
        displayAllProducts(allProducts);
    }
}


const displayFilteredProducts = (arr1, arr2) => {
    for (let i = 0; i < arr1.length; i++) {
        if ( // If a brand filter is on and there are no price filters on
            ((arr1[i].innerHTML === 'apple' && (showApple) || 
            arr1[i].innerHTML === 'samsung' && (showSamsung) ||
            arr1[i].innerHTML === 'motorola' && (showMotorola) || 
            arr1[i].innerHTML ===  'google' && (showGoogle)) &&
            ((showSub500s === false) && (show500s === false) && 
            (show600s === false) && (show700s === false))) ||

            // If a price filter is on and there are no brand filters on
            ((arr2[i].innerHTML[1] == 4 && (showSub500s) || 
            arr2[i].innerHTML[1] == 5 && (show500s) ||
            arr2[i].innerHTML[1] == 6 && (show600s) ||
            arr2[i].innerHTML[1] == 7 && (show700s)) && 
            ((showApple === false) && (showSamsung === false) &&
            (showMotorola === false) && (showGoogle === false))) || 

            // If a brand filter and a price filter are both on
           ( (arr1[i].innerHTML === 'apple' && (showApple) || 
            arr1[i].innerHTML === 'samsung' && (showSamsung) ||
            arr1[i].innerHTML === 'motorola' && (showMotorola) || 
            arr1[i].innerHTML ===  'google' && (showGoogle)) &&
            (arr2[i].innerHTML[1] == 4 && (showSub500s) || 
            arr2[i].innerHTML[1] == 5 && (show500s) ||
            arr2[i].innerHTML[1] == 6 && (show600s) ||
            arr2[i].innerHTML[1] == 7 && (show700s)))) {
                let detailsDiv = arr1[i].parentNode;
                let productTile = detailsDiv.parentNode;
                productTile.style.display = '';
                console.log(`first condition tripped on ${arr1[i].innerHTML}`);
        } else {
                let detailsDiv = arr1[i].parentNode;
                let productTile = detailsDiv.parentNode;
                productTile.style.display = 'none';
                console.log(`else condition tripped on ${arr1[i].innerHTML}`);
        }
    }
}


   



appleFilter.addEventListener("click", () => {
    if (!showApple) {
        showApple = true;
        displayFilteredProducts(allProducts, allPrices);    
    } else {
        showApple = false;
        displayFilteredProducts(allProducts, allPrices);    
    }
ifAllFiltersOff();
});

samsungFilter.addEventListener("click", () => {
    if (!showSamsung) {
        showSamsung = true;
        displayFilteredProducts(allProducts, allPrices);    
    } else {
        showSamsung = false;
        displayFilteredProducts(allProducts, allPrices);    
    }
ifAllFiltersOff();
});

motorolaFilter.addEventListener("click", () => {
    if (!showMotorola) {
        showMotorola = true;
        displayFilteredProducts(allProducts, allPrices);    
    } else {
        showMotorola = false;
        displayFilteredProducts(allProducts, allPrices);    
    }
ifAllFiltersOff();
});

googleFilter.addEventListener("click", () => {
    if (!showGoogle) {
        showGoogle = true;
        displayFilteredProducts(allProducts, allPrices);    
    } else {
        showGoogle = false;
        displayFilteredProducts(allProducts, allPrices);    
    }
ifAllFiltersOff();
});

console.log('js code ran')


// By Price Filter

filterSub500.addEventListener("click", () => {
    if (!showSub500s) {
        showSub500s = true;
        displayFilteredProducts(allProducts, allPrices);    
    } else {
        showSub500s = false;
        displayFilteredProducts(allProducts, allPrices);    
    }
ifAllFiltersOff();
})

filter500.addEventListener("click", () => {
    if (!show500s) {
        show500s = true;
        displayFilteredProducts(allProducts, allPrices);    
    } else {
        show500s = false;
        displayFilteredProducts(allProducts, allPrices);    
    }
ifAllFiltersOff();
});

filter600.addEventListener("click", () => {
    if (!show600s) {
        show600s = true;
        displayFilteredProducts(allProducts, allPrices);    
    } else {
        show600s = false;
        displayFilteredProducts(allProducts, allPrices);    
    }
ifAllFiltersOff();
});

filter700.addEventListener("click", () => {
    if (!show700s) {
        show700s = true;
        displayFilteredProducts(allProducts, allPrices);    
    } else {
        show700s = false;
        displayFilteredProducts(allProducts, allPrices);    
    }
ifAllFiltersOff();
});

