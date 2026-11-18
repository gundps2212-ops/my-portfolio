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


// THREE.JS: elegant abstract 3D background sculpture (no character/robot)
(function initAbstractScene() {
  const canvas = document.getElementById("three-canvas");
  if (!canvas || !window.THREE) {
    console.warn("Three.js unavailable: check the CDN connection.");
    return;
  }
  const THREE = window.THREE, host = canvas.parentElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 8.2);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000, 0);
  scene.add(new THREE.HemisphereLight(0xb8e9ff, 0x17102e, 2.2));
  const cyanLight = new THREE.PointLight(0x58eaff, 3.6, 18);
  cyanLight.position.set(3, 3, 4); scene.add(cyanLight);
  const purpleLight = new THREE.PointLight(0x986bff, 3.4, 18);
  purpleLight.position.set(-3, -2, 2); scene.add(purpleLight);

  const sculpture = new THREE.Group(); scene.add(sculpture);
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x8bdfff, metalness: .42, roughness: .12,
    transparent: true, opacity: .72, transmission: .25,
    clearcoat: 1, clearcoatRoughness: .08
  });
  const blue = new THREE.MeshStandardMaterial({
    color: 0x287dff, metalness: .72, roughness: .22,
    emissive: 0x102c8b, emissiveIntensity: .55
  });
  const violet = new THREE.MeshStandardMaterial({
    color: 0x9c72ff, metalness: .68, roughness: .2,
    emissive: 0x4114b5, emissiveIntensity: .8
  });
  const glow = new THREE.MeshBasicMaterial({ color: 0x72edff });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.08, 2), glass);
  sculpture.add(core);
  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(.72, 1),
    new THREE.MeshStandardMaterial({ color: 0x182c60, metalness: .8, roughness: .18, wireframe: true })
  );
  sculpture.add(inner);
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(.9, .026, 180, 12, 2, 5), blue);
  knot.rotation.set(.8, .25, .35); sculpture.add(knot);
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.75, .018, 12, 160), glow);
  ringA.rotation.set(1.18, .22, .12); sculpture.add(ringA);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.05, .012, 10, 160), violet);
  ringB.rotation.set(.45, -.68, -.5); sculpture.add(ringB);
  const ringC = new THREE.Mesh(new THREE.TorusGeometry(1.42, .012, 10, 140), blue);
  ringC.rotation.set(1.85, .65, .25); sculpture.add(ringC);

  // Small floating crystal facets around the central glass form.
  const shards = [];
  for (let i = 0; i < 9; i++) {
    const shard = new THREE.Mesh(
      new THREE.OctahedronGeometry(.12 + (i % 3) * .035, 0),
      i % 2 ? violet : glow
    );
    const angle = i / 9 * Math.PI * 2;
    shard.position.set(Math.cos(angle) * (1.9 + (i % 2) * .2),
      Math.sin(angle) * (1.45 + (i % 3) * .12), Math.sin(angle * 2) * .35);
    shard.userData.phase = angle;
    sculpture.add(shard); shards.push(shard);
  }

  // Fine particle field adds depth without competing with the portfolio text.
  const count = 260, positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - .5) * 7;
    positions[i * 3 + 1] = (Math.random() - .5) * 7;
    positions[i * 3 + 2] = (Math.random() - .5) * 3 - 1;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeometry,
    new THREE.PointsMaterial({ color: 0x9edfff, size: .018, transparent: true, opacity: .7 }));
  scene.add(particles);

  const pointer = { x: 0, y: 0 };
  host.addEventListener("pointermove", event => {
    const rect = host.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - .5) * 2;
  }, { passive: true });
  host.addEventListener("pointerleave", () => { pointer.x = 0; pointer.y = 0; });
  function resize() {
    const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height; camera.updateProjectionMatrix();
  }
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(host);
  else window.addEventListener("resize", resize);

  const clock = new THREE.Clock();
  let frame = 0, paused = false;
  function animate() {
    if (paused) return;
    frame = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    sculpture.rotation.y += (pointer.x * .24 - sculpture.rotation.y) * .025;
    sculpture.rotation.x += (-pointer.y * .16 - sculpture.rotation.x) * .025;
    sculpture.position.y = Math.sin(t * .7) * .12;
    core.rotation.x = t * .12; core.rotation.y = -t * .16;
    inner.rotation.y = -t * .2; inner.rotation.z = t * .1;
    knot.rotation.z = .35 + t * .12;
    ringA.rotation.z = .12 + t * .09;
    ringB.rotation.y = -.68 + t * .08;
    ringC.rotation.x = 1.85 + t * .07;
    shards.forEach((shard, i) => {
      shard.position.y += Math.sin(t * .8 + shard.userData.phase) * .0008;
      shard.rotation.x = t * (.18 + i * .006);
      shard.rotation.y = t * .22;
    });
    particles.rotation.y = t * .018;
    renderer.render(scene, camera);
  }
  animate();
  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
    if (paused) cancelAnimationFrame(frame);
    else { clock.start(); animate(); }
  });
})();