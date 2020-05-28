const defaultTimeout = 5000;

function showError(errorMsg, elementsToHide) {
    const errorElement = document.getElementsByClassName("erreur")[0];

    if (elementsToHide != null) {
        elementsToHide.forEach(element => {
            element.style.visibility = "hidden";
        });
    }

    errorElement.textContent = errorMsg;
    errorElement.style.display = "inline-block";
}

function hideError(elementsToShow) {
    const errorElement = document.getElementsByClassName("erreur")[0];

    errorElement.style.display = "none";

    if (elementsToShow != null) {
        elementsToShow.forEach(element => {
            element.style.visibility = "visible";
        });
    }
}