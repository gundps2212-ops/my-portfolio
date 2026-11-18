// =========================================================
// PRATIK GUND — INTERACTIONS
// Keeps the original navigation, typing, validation and
// Web3Forms contact submission behaviour.
// =========================================================

// Loading screen
const loader = document.getElementById("loader");
window.addEventListener("load", () => {
  if (loader) window.setTimeout(() => loader.classList.add("hide"), 650);
});

// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const opened = navLinks.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", String(opened));
    const icon = menuBtn.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars", !opened);
      icon.classList.toggle("fa-xmark", opened);
    }
  });
}
navItems.forEach((item) => item.addEventListener("click", () => {
  navLinks?.classList.remove("active");
  menuBtn?.setAttribute("aria-expanded", "false");
  const icon = menuBtn?.querySelector("i");
  if (icon) {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  }
}));

// Sticky header
const header = document.getElementById("header");
const backToTop = document.getElementById("backToTop");
const sections = document.querySelectorAll("section[id]");
function handleScroll() {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 70);
  backToTop?.classList.toggle("show", y > 500);

  let current = "";
  sections.forEach((section) => {
    if (y >= section.offsetTop - 150) current = section.id;
  });
  navItems.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
}
window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Strong scroll-triggered reveal animations with staggered cards
const revealItems = document.querySelectorAll(".reveal, .fade");
revealItems.forEach((item) => {
  if (item.matches(".skill-card, .project-card, .service-card")) {
    const siblings = Array.from(item.parentElement.children);
    item.style.transitionDelay = (siblings.indexOf(item) % 4) * 110 + "ms";
  }
  if (item.matches(".section-title")) item.classList.add("zoom-in");
  else if (item.matches(".hero-content, .about-card, .contact-info")) item.classList.add("from-left");
  else if (item.matches(".hero-image, .contact-form")) item.classList.add("from-right");
});
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active", "show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -55px 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("active", "show"));
}

// Typing headline
const words = ["Junior Full Stack Web Developer", "Frontend Developer", "IT Student"];
const typing = document.querySelector(".typing");
let wordIndex = 0, charIndex = 0, deleting = false;
function typingEffect() {
  if (!typing) return;
  const word = words[wordIndex];
  typing.textContent = word.substring(0, charIndex);
  if (!deleting && charIndex < word.length) {
    charIndex++;
    window.setTimeout(typingEffect, 95);
  } else if (!deleting) {
    deleting = true;
    window.setTimeout(typingEffect, 1450);
  } else if (charIndex > 0) {
    charIndex--;
    window.setTimeout(typingEffect, 42);
  } else {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    window.setTimeout(typingEffect, 300);
  }
}
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) typingEffect();
else if (typing) typing.textContent = words[0];

// Pointer-reactive ambient light and subtle 3D tilt
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (finePointer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let pointerFrame = 0;
  document.addEventListener("pointermove", (event) => {
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--mx", event.clientX + "px");
      document.documentElement.style.setProperty("--my", event.clientY + "px");
      pointerFrame = 0;
    });
  }, { passive: true });

  const tiltTargets = document.querySelectorAll(".project-card, .skill-card, .service-card");
  tiltTargets.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 7;
      const rotateX = (0.5 - y) * 7;
      card.style.transform = "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-5px)";
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  const imageCard = document.querySelector(".image-card");
  imageCard?.addEventListener("pointermove", (event) => {
    const rect = imageCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    imageCard.style.transform = "rotateY(" + ((x - 0.5) * 13 - 5) + "deg) rotateX(" + ((0.5 - y) * 10 + 3) + "deg)";
  });
  imageCard?.addEventListener("pointerleave", () => {
    imageCard.style.transform = "";
  });
}

// Contact form validation + Web3Forms
const ACCESS_KEY = "40701f1e-3266-4fd7-8fa4-73c0c2263255";
const contactForm = document.getElementById("contactForm");

function showError(input, message) {
  if (!input) return;
  const small = input.parentElement?.querySelector("small");
  if (small) small.textContent = message;
  input.style.borderColor = "#ff6688";
}
function showSuccess(input) {
  if (!input) return;
  const small = input.parentElement?.querySelector("small");
  if (small) small.textContent = "";
  input.style.borderColor = "#63eaff";
}
const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validatePhone = (value) => /^[0-9]{10}$/.test(value);

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");
    const button = contactForm.querySelector('button[type="submit"]');
    let valid = true;

    if (!name?.value.trim()) { showError(name, "Full name is required"); valid = false; }
    else if (name.value.trim().length < 3) { showError(name, "Name must be at least 3 characters"); valid = false; }
    else showSuccess(name);

    if (!email?.value.trim()) { showError(email, "Email address is required"); valid = false; }
    else if (!validateEmail(email.value.trim())) { showError(email, "Enter a valid email address"); valid = false; }
    else showSuccess(email);

    if (!phone?.value.trim()) { showError(phone, "Phone number is required"); valid = false; }
    else if (!validatePhone(phone.value.trim())) { showError(phone, "Enter a valid 10 digit phone number"); valid = false; }
    else showSuccess(phone);

    if (!subject?.value.trim()) { showError(subject, "Subject is required"); valid = false; }
    else showSuccess(subject);

    if (!message?.value.trim()) { showError(message, "Message is required"); valid = false; }
    else if (message.value.trim().length < 10) { showError(message, "Message must be at least 10 characters"); valid = false; }
    else showSuccess(message);

    if (!valid || !button) return;
    const originalButton = button.innerHTML;
    button.disabled = true;
    button.innerHTML = 'Sending <i class="fa-solid fa-spinner fa-spin"></i>';

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
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to send message.");
      contactForm.reset();
      contactForm.querySelectorAll("input, textarea").forEach((input) => {
        input.style.borderColor = "rgba(164,190,255,.17)";
      });
      const success = document.getElementById("formSuccess");
      if (success) {
        success.style.display = "block";
        success.textContent = "Message sent successfully! Thank you for reaching out.";
      } else {
        window.alert("Message sent successfully!");
      }
    } catch (error) {
      window.alert("Message could not be sent. " + error.message);
    } finally {
      button.disabled = false;
      button.innerHTML = originalButton;
    }
  });
}

// Placeholder project links remain intentionally unchanged until real URLs are supplied.
document.querySelectorAll(".project-buttons a[href='#']").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.alert("Add your Live Demo or GitHub link here.");
  });
});


// FULL-PAGE THREE.JS BACKGROUND: floating abstract 3D form
(function initPageBackground3D() {
  const canvas = document.getElementById("background-3d-canvas");
  if (!canvas || !window.THREE) {
    console.warn("Three.js background unavailable. Check CDN connection.");
    return;
  }
  const THREE = window.THREE;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, .1, 100);
  camera.position.set(0, 0, 10);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  scene.add(new THREE.HemisphereLight(0x9acfff, 0x171126, 1.8));
  const light1 = new THREE.PointLight(0x48cfff, 2.6, 22);
  light1.position.set(4, 3, 5); scene.add(light1);
  const light2 = new THREE.PointLight(0x9562ff, 2.2, 22);
  light2.position.set(-4, -3, 3); scene.add(light2);

  const model = new THREE.Group();
  model.position.set(2.35, .1, -1.2);
  scene.add(model);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x58cfff, wireframe: true, transparent: true, opacity: .28 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x397bca, metalness: .62, roughness: .18,
    transparent: true, opacity: .17, clearcoat: 1
  });
  const violetMat = new THREE.MeshBasicMaterial({ color: 0x986bff, transparent: true, opacity: .48 });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 2), glassMat);
  model.add(core);
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.64, 2), wireMat);
  model.add(wire);
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.22, .025, 180, 10, 2, 5),
    new THREE.MeshBasicMaterial({ color: 0x5bdfff, transparent: true, opacity: .55 }));
  knot.rotation.set(.8, .3, .2); model.add(knot);
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.25, .012, 8, 160), violetMat);
  ring1.rotation.set(1.1, .25, .2); model.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.65, .009, 8, 160),
    new THREE.MeshBasicMaterial({ color: 0x62eaff, transparent: true, opacity: .38 }));
  ring2.rotation.set(.35, -.7, -.4); model.add(ring2);

  const dots = [];
  for (let i = 0; i < 14; i++) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.035 + (i % 3) * .012, 12, 12),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0x9c7aff : 0x67eaff }));
    const a = i / 14 * Math.PI * 2;
    dot.position.set(Math.cos(a) * (2.4 + (i % 3) * .12), Math.sin(a) * 1.9, Math.sin(a * 2) * .5);
    model.add(dot); dots.push(dot);
  }

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", event => {
    pointer.x = (event.clientX / window.innerWidth - .5) * 2;
    pointer.y = (event.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });
  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", resize, { passive: true });

  const clock = new THREE.Clock();
  let frame = 0, paused = false;
  function animate() {
    if (paused) return;
    frame = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    // Automatic floating/rotation continues even when the mouse is still.
    model.position.y = .1 + Math.sin(t * .42) * .22;
    model.rotation.y += (pointer.x * .25 + Math.sin(t * .22) * .12 - model.rotation.y) * .018;
    model.rotation.x += (-pointer.y * .16 + Math.cos(t * .2) * .08 - model.rotation.x) * .018;
    core.rotation.y = t * .12;
    wire.rotation.x = -t * .08;
    knot.rotation.z = .2 + t * .1;
    ring1.rotation.z = .2 + t * .07;
    ring2.rotation.y = -.7 + t * .06;
    dots.forEach((dot, i) => {
      dot.position.y += Math.sin(t * .7 + i) * .0007;
      dot.rotation.x = t * .25;
    });
    renderer.render(scene, camera);
  }
  animate();
  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
    if (paused) cancelAnimationFrame(frame);
    else { clock.start(); animate(); }
  });
})();