const btnOpenForm = document.querySelector(".btn-mobile");
const btnCloseForm = document.querySelector(".close-form");
const form = document.querySelector(".form");

btnOpenForm.addEventListener("click", (e) => {
    form.classList.add("open");
});

btnCloseForm.addEventListener("click", (e) => {
    form.classList.remove("open");
});

//-------------------------  Change select field colors -------------------------
(() => {
    const selects = Array.from(document.querySelectorAll("select"));
    const CSS_VARIABLES = getComputedStyle(document.documentElement);
    const placeholderColor =
        CSS_VARIABLES.getPropertyValue("--clr-placeholder");
    const fieldColor = CSS_VARIABLES.getPropertyValue("--clr-field");

    selects.forEach((select) => {
        select.style.color = placeholderColor;

        select.addEventListener("change", (e) => {
            if (e.target.value === "" || e.target.value === "nulo") {
                select.style.color = placeholderColor;
            } else {
                select.style.color = fieldColor;
            }
        });
    });
})();
