// Scroll fade animation
const faders = document.querySelectorAll(".fade");

window.addEventListener("scroll", () => {
  faders.forEach(section => {
    const position = section.getBoundingClientRect().top;

    if (position < window.innerHeight - 100) {
      section.classList.add("show");
    }
  });
});

// Typing Effect
const text = ["Junior Full Stack Web Developer", "IT Student"];

let i = 0;
let j = 0;
let currentText = "";
let isDeleting = false;

const typing = document.querySelector(".typing");

function type() {
  if (!typing) return;

  if (!isDeleting && j <= text[i].length) {
    currentText = text[i].substring(0, j++);
  } else if (isDeleting && j >= 0) {
    currentText = text[i].substring(0, j--);
  }

  typing.innerHTML = currentText;

  if (j === text[i].length) {
    isDeleting = true;
    setTimeout(type, 1000);
    return;
  }

  if (j === 0) {
    isDeleting = false;
    i++;

    if (i === text.length) {
      i = 0;
    }
  }

  setTimeout(type, 100);
}

type();

// Contact Form Submit - Web3Forms
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = {
      access_key: "YOUR_WEB3FORMS_ACCESS_KEY",
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert("Message Sent Successfully");
        contactForm.reset();
      } else {
        alert("Failed to Send Message");
      }

    } catch (error) {
      alert("Server error. Please try again.");
      console.log(error);
    }
  });
}