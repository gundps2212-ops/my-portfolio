// Scroll fade animation
const faders = document.querySelectorAll(".fade");

window.addEventListener("scroll", () => {
  faders.forEach(section => {
    const position = section.getBoundingClientRect().top;
    if(position < window.innerHeight - 100){
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

function type(){
  if(i < text.length){
    if(!isDeleting && j <= text[i].length){
      currentText = text[i].substring(0, j++);
    }else if(isDeleting && j >= 0){
      currentText = text[i].substring(0, j--);
    }

    typing.innerHTML = currentText;

    if(j == text[i].length){
      isDeleting = true;
      setTimeout(type,1000);
      return;
    }

    if(j == 0){
      isDeleting = false;
      i++;
      if(i == text.length) i = 0;
    }
  }

  setTimeout(type,100);
}

type();
document.getElementById("contactForm")
.addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const message = document.getElementById("message").value;

const response = await fetch("/send", {
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

this.reset();

});