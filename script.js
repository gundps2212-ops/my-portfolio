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
  } 
  else if (isDeleting && j >= 0) {
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

// Contact Form Submit
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
      const response = await fetch("https://portfolio-backend-8rap.onrender.com/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        contactForm.reset();
      }

    } catch (error) {
      alert("Server error. Please try again.");
      console.log(error);
    }
  });
}