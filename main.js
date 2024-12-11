/* 
    Languagues
*/

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

/* 
    Animation
*/
function toggle() {
    document.body.classList.add("animation-ready");
    document.body.classList.toggle("dark");
}

// Group observer options
const observerOptions = {
    section: {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
    },
    footer: {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0.1,
    },
};

// Group observers
const observers = {
    section: new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains("initial-section")) {
                requestAnimationFrame(() => {
                    const index = Array.from(document.querySelectorAll("section")).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add("visible");
                    }, index * 20);
                });
                observers.section.unobserve(entry.target);
            }
        });
    }, observerOptions.section),

    footer: new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        entry.target.classList.add("visible");
                    }, 50);
                });
                observers.footer.unobserve(entry.target);
            }
        });
    }, observerOptions.footer),
};

/* 
    Main
*/
// Wait for the page to be fully loaded
window.addEventListener("load", function () {
    // Initialize animation
    document.body.classList.add("animation-ready");

    // Prepare sections for animation
    const sections = document.querySelectorAll("section");
    sections.forEach((section, index) => {
        if (index < 2) {
            section.classList.add("initial-section");
        } else {
            observers.section.observe(section);
        }
    });

    // Observe footer separately
    const footer = document.querySelector(".content-wrapper > footer");
    if (footer) {
        observers.footer.observe(footer);
    }

    // Animation sequence
    setTimeout(() => {
        toggle(); // Trigger transition to night mode

        // Display stripes after delay
        setTimeout(() => {
            document.body.classList.add("show-stripe");

            // Display main structure
            setTimeout(() => {
                document.body.classList.add("show-structure");

                // Display logo
                setTimeout(() => {
                    document.body.classList.add("show-logo");

                    // Display initial sections one by one
                    const initialSections = document.querySelectorAll(".initial-section");
                    initialSections.forEach((section, index) => {
                        setTimeout(() => {
                            document.body.classList.add(`show-content-${index}`);
                        }, 500 + index * 300);
                    });
                }, 300);
            }, 1000);
        }, 500); // Delay before displaying stripes
    }, 700);
});

document.addEventListener("DOMContentLoaded", () => {
    /** Theme toggle */
    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            toggle();
        });
    }

    /** Subscription form */
    const form = document.querySelector(".subscription-container");
    const button = form.querySelector(".subscribe-button");
    const buttonText = button.querySelector(".subscribe-text");
    const emailInput = form.querySelector(".email-input");

    // Add spinner and check icon to button
    const spinner = document.createElement("img");
    spinner.src = "images/tail-spin.svg";
    spinner.classList.add("spinner");

    const checkIcon = document.createElement("img");
    checkIcon.src = "images/check.svg";
    checkIcon.classList.add("check-icon");

    button.appendChild(spinner);
    button.appendChild(checkIcon);

    emailInput.addEventListener("input", () => {
        button.disabled = false;
        button.classList.remove("success");
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Disable button and input
        button.disabled = true;
        emailInput.disabled = true;

        // Start loading state
        button.classList.add("loading");

        const startTime = Date.now();

        try {
            const formData = new FormData();
            formData.append("fields[email]", emailInput.value);
            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
            });

            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(0, 1500 - elapsedTime);

            setTimeout(() => {
                if (!response.ok) {
                    console.error("Subscription error:", error);
                    // Reset to initial state on error
                    button.classList.remove("loading");
                    buttonText.textContent = "Try Again";
                    button.disabled = false;
                    emailInput.disabled = false;
                    throw new Error("Subscription failed");
                }

                // Success state
                button.classList.remove("loading");
                button.classList.add("success");
                emailInput.disabled = false;
            }, delay);
        } catch (error) {
            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(0, 1500 - elapsedTime);

            setTimeout(() => {
                console.error("Subscription error:", error);
                // Reset to initial state on error
                button.classList.remove("loading");
                buttonText.textContent = "Try Again";
                button.disabled = false;
                emailInput.disabled = false;
            }, delay);
        }
    });
});
