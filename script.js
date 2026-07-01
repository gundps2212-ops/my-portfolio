// ==========================
// Loading Screen
// ==========================
const loader = document.getElementById("loader");

window.addEventListener("load", () => {
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hide");
    }, 800);
  }
});

// ==========================
// Mobile Navbar Toggle
// ==========================
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (navLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  });
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("active");

    const icon = menuBtn.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  });
});

// ==========================
// Sticky Navbar
// ==========================
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
  if (header) {
    if (window.scrollY > 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
});

// ==========================
// Fade / Scroll Reveal Animation
// ==========================
const faders = document.querySelectorAll(".fade, .reveal");

function revealSections() {
  faders.forEach((section) => {
    const position = section.getBoundingClientRect().top;

    if (position < window.innerHeight - 100) {
      section.classList.add("show");
      section.classList.add("active");
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
    typing.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  } else {
    typing.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  }

  let speed = deleting ? 60 : 120;

  if (!deleting && charIndex === currentWord.length) {
    deleting = true;
    speed = 1500;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 400;
  }

  setTimeout(typingEffect, speed);
}

typingEffect();

// ==========================
// Active Navbar Link On Scroll
// ==========================
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.clientHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navItems.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

// ==========================
// Back To Top Button
// ==========================
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (backToTop) {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// ==========================
// Contact Form Validation + Web3Forms
// ==========================
const ACCESS_KEY = "40701f1e-3266-4fd7-8fa4-73c0c2263255";

const contactForm = document.getElementById("contactForm");

function showError(input, message) {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector("small");

  if (small) {
    small.textContent = message;
  }

  input.style.borderColor = "#ff4d6d";
}

function showSuccess(input) {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector("small");

  if (small) {
    small.textContent = "";
  }

  input.style.borderColor = "#00d4ff";
}

function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function validatePhone(phone) {
  const pattern = /^[0-9]{10}$/;
  return pattern.test(phone);
}

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    const button = contactForm.querySelector("button");

    let isValid = true;

    // Name Validation
    if (!name || name.value.trim() === "") {
      showError(name, "Full name is required");
      isValid = false;
    } else if (name.value.trim().length < 3) {
      showError(name, "Name must be at least 3 characters");
      isValid = false;
    } else {
      showSuccess(name);
    }

    // Email Validation
    if (!email || email.value.trim() === "") {
      showError(email, "Email address is required");
      isValid = false;
    } else if (!validateEmail(email.value.trim())) {
      showError(email, "Enter a valid email address");
      isValid = false;
    } else {
      showSuccess(email);
    }

    // Phone Validation
    if (!phone || phone.value.trim() === "") {
      showError(phone, "Phone number is required");
      isValid = false;
    } else if (!validatePhone(phone.value.trim())) {
      showError(phone, "Enter a valid 10 digit phone number");
      isValid = false;
    } else {
      showSuccess(phone);
    }

    // Subject Validation
    if (!subject || subject.value.trim() === "") {
      showError(subject, "Subject is required");
      isValid = false;
    } else {
      showSuccess(subject);
    }

    // Message Validation
    if (!message || message.value.trim() === "") {
      showError(message, "Message is required");
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showError(message, "Message must be at least 10 characters");
      isValid = false;
    } else {
      showSuccess(message);
    }

    if (!isValid) return;

    button.disabled = true;
    button.innerHTML = "Sending...";

    const formData = {
      access_key: ACCESS_KEY,
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      subject: subject.value.trim(),
      message: message.value.trim()
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },

        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Message Sent Successfully!");
        contactForm.reset();

        const inputs = contactForm.querySelectorAll("input, textarea");
        inputs.forEach((input) => {
          input.style.borderColor = "rgba(255, 255, 255, 0.14)";
        });
      } else {
        alert("❌ " + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to send message. Please try again.");
    }

    button.disabled = false;
    button.innerHTML = "Send Message";
  });
}

// ==========================
// Project Demo Button Alert
// ==========================
const projectButtons = document.querySelectorAll(".project-buttons a");

projectButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (button.getAttribute("href") === "#") {
      e.preventDefault();
      alert("Add your Live Demo or GitHub link here.");
    }
  });
});