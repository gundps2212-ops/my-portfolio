// ==========================
// Fade Animation on Scroll
// ==========================
const faders = document.querySelectorAll(".fade");

function revealSections() {
  faders.forEach((section) => {
    const position = section.getBoundingClientRect().top;

    if (position < window.innerHeight - 100) {
      section.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);

// ==========================
// Typing Effect
// ==========================
const words = [
  "Junior Full Stack Web Developer",
  "Frontend Developer",
  "IT Student"
];

const typing = document.querySelector(".typing");

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typingEffect() {
  if (!typing) return;

  const currentWord = words[wordIndex];

  if (!deleting) {
    typing.textContent = currentWord.substring(0, charIndex++);
  } else {
    typing.textContent = currentWord.substring(0, charIndex--);
  }

  let speed = deleting ? 60 : 120;

  if (!deleting && charIndex > currentWord.length) {
    deleting = true;
    speed = 1500;
  }

  if (deleting && charIndex < 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 400;
  }

  setTimeout(typingEffect, speed);
}

typingEffect();

// ==========================
// Contact Form (Web3Forms)
// ==========================

const ACCESS_KEY = "40701f1e-3266-4fd7-8fa4-73c0c2263255";

const contactForm = document.getElementById("contactForm");

if (contactForm) {

  contactForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const button = contactForm.querySelector("button");

    button.disabled = true;
    button.innerHTML = "Sending...";

    const formData = {
      access_key: ACCESS_KEY,
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim()
    };

    try {

      const response = await fetch("https://api.web3forms.com/submit", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },

        body: JSON.stringify(formData)

      });

      const result = await response.json();

      if (result.success) {

        alert("✅ Message Sent Successfully!");

        contactForm.reset();

      } else {

        alert("❌ " + result.message);

      }

    } catch (error) {

      console.error(error);

      alert("❌ Failed to send message.");

    }

    button.disabled = false;
    button.innerHTML = "Send Message";

  });

}