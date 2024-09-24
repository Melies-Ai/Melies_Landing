const availableLanguages = ["fr", "en"];
// Call updateContent() on page load
window.addEventListener("DOMContentLoaded", async () => {
    let userPreferredLanguage;
    const userLanguage = navigator.language.split("-")[0];
    if (!availableLanguages.includes(userLanguage)) {
        userPreferredLanguage = "en";
    } else {
        userPreferredLanguage = userLanguage;
    }

    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
});

// Function to fetch language data
async function fetchLanguageData(lang) {
    const response = await fetch(`languages/${lang}.json`);
    console.log(response);
    return response.json();
}

// Function to update content based on selected language
function updateContent(langData) {
    // Update text content for elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (element.tagName.toLowerCase() === "a") {
            element.setAttribute("aria-label", langData[key]);
        } else if (element.tagName.toLowerCase() === "img") {
            element.alt = langData[key];
        } else {
            element.textContent = langData[key];
        }
    });
}
