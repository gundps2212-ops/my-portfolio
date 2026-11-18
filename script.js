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


// FULL-PAGE THREE.JS BACKGROUND: premium floating chrome rings
(function initPageBackground3D() {
  const canvas = document.getElementById("background-3d-canvas");
  if (!canvas || !window.THREE) {
    console.warn("Three.js background unavailable. Check CDN connection.");
    return;
  }
  const THREE = window.THREE;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, .1, 100);
  camera.position.set(0, 0, 10.8);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  if ("outputEncoding" in renderer) renderer.outputEncoding = THREE.sRGBEncoding;

  scene.add(new THREE.HemisphereLight(0x8795ad, 0x05070c, .62));
  const keyLight = new THREE.PointLight(0x8995aa, 1.15, 26);
  keyLight.position.set(4, 5, 7); scene.add(keyLight);
  const coolLight = new THREE.PointLight(0x345b83, 1.0, 22);
  coolLight.position.set(-5, 1, 4); scene.add(coolLight);
  const warmLight = new THREE.PointLight(0x51416f, .72, 20);
  warmLight.position.set(2, -5, 3); scene.add(warmLight);
  const rimLight = new THREE.PointLight(0x263d68, .8, 22);
  rimLight.position.set(5, -2, -1); scene.add(rimLight);

  const rig = new THREE.Group();
  rig.position.set(0, .05, -1.1);
  scene.add(rig);

  // Polished liquid-chrome / dark-silver metal, matching the supplied reference.
  // Dark graphite base + sharp white reflections create real 3D depth (not a flat white ring).
  const chrome = new THREE.MeshPhongMaterial({
    color: 0x171d27, specular: 0x68788e, shininess: 105,
    emissive: 0x02050a, emissiveIntensity: .08
  });
  const darkChrome = new THREE.MeshPhongMaterial({
    color: 0x0b0e16, specular: 0x596078, shininess: 125,
    emissive: 0x02030a, emissiveIntensity: .06
  });
  const brightChrome = new THREE.MeshPhongMaterial({
    color: 0x252d39, specular: 0x8290a5, shininess: 115,
    emissive: 0x03060b, emissiveIntensity: .08
  });

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.72, .17, 32, 260), chrome);
  ringA.rotation.set(1.08, .25, -.28); rig.add(ringA);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.08, .13, 28, 240), brightChrome);
  ringB.rotation.set(.35, 1.02, .68); rig.add(ringB);
  const ringC = new THREE.Mesh(new THREE.TorusGeometry(3.18, .10, 24, 260), darkChrome);
  ringC.rotation.set(1.42, -.52, .2); rig.add(ringC);

  // A fine inner orbit adds depth without making the page visually busy.
  const innerOrbit = new THREE.Mesh(
    new THREE.TorusGeometry(1.48, .055, 16, 220),
    new THREE.MeshPhongMaterial({ color: 0x111722, specular: 0x68788e, shininess: 100, emissive: 0x02050a, emissiveIntensity: .06, transparent: true, opacity: .96 })
  );
  innerOrbit.rotation.set(.9, .4, .1); rig.add(innerOrbit);


  // Small floating helper bots: lightweight 3D characters distributed around the page.
  const bots = [];
  const botMetal = new THREE.MeshStandardMaterial({ color: 0x111722, metalness: .68, roughness: .48 });
  const botDark = new THREE.MeshStandardMaterial({ color: 0x05080e, metalness: .42, roughness: .52 });
  const botGlow = new THREE.MeshBasicMaterial({ color: 0x16445e });
  const botPositions = [
    [-5.5, 3.2, -1.8], [-3.8, 3.0, -2.0], [-1.9, 3.45, -2.2], [0, 3.55, -2.2], [1.9, 3.35, -2.0], [3.8, 3.0, -1.9], [5.5, 2.8, -2.1],
    [-5.7, 1.0, -1.7], [5.7, .8, -1.8], [-5.7, -.9, -1.8], [5.7, -.8, -1.7],
    [-5.5, -2.8, -1.9], [-3.7, -3.1, -2.0], [-1.8, -3.4, -2.1], [0, -3.55, -2.2], [1.8, -3.3, -2.0], [3.7, -3.0, -1.9], [5.5, -2.7, -1.8]
  ];
  botPositions.forEach((pos, index) => {
    const bot = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(.16, 18, 14), botMetal);
    body.scale.set(1, 1.12, .82); bot.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(.12, 18, 14), botDark);
    head.position.y = .20; bot.add(head);
    [-.065, .065].forEach(x => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(.025, 10, 8), botGlow);
      eye.position.set(x, .215, .11); bot.add(eye);
    });
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(.009, .013, .10, 8), botMetal);
    antenna.position.y = .34; bot.add(antenna);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(.035, 10, 8), botGlow);
    tip.position.y = .405; bot.add(tip);
    [-1, 1].forEach(side => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .14, 10), botMetal);
      arm.position.set(side * .24, -.02, 0);
      arm.rotation.z = side * -.35; bot.add(arm);
    });
    bot.position.set(...pos);
    bot.scale.setScalar(.38 + (index % 3) * .045);
    scene.add(bot);
    bots.push({ group: bot, baseX: pos[0], baseY: pos[1], phase: index * 1.17, speed: .42 + index * .055 });
  });

  // Tiny glowing data particles across the whole screen for a futuristic atmosphere.
  const dotCount = 1200;
  const dotPositions = new Float32Array(dotCount * 3);
  const dotSeeds = [];
  for (let i = 0; i < dotCount; i++) {
    const x = (Math.random() - .5) * 20.5;
    const y = (Math.random() - .5) * 13.5;
    const z = -2.8 - Math.random() * 7.0;
    dotPositions[i * 3] = x;
    dotPositions[i * 3 + 1] = y;
    dotPositions[i * 3 + 2] = z;
    dotSeeds.push({ x, y, z, phase: Math.random() * Math.PI * 2, speed: .85 + Math.random() * 1.8, drift: .28 + Math.random() * .58, parallax: .28 + Math.random() * .72 });
  }
  const dotGeometry = new THREE.BufferGeometry();
  dotGeometry.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
  const dotMaterial = new THREE.PointsMaterial({
    color: 0x48cfff, size: 0.075, transparent: true, opacity: .98,
    sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const starDots = new THREE.Points(dotGeometry, dotMaterial);
  scene.add(starDots);

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", event => {
    pointer.x = (event.clientX / window.innerWidth - .5) * 2;
    pointer.y = (event.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const narrow = window.innerWidth < 760;
    rig.position.x = 0;
    rig.scale.setScalar(narrow ? .68 : .98);
    rig.position.y = narrow ? -.15 : .05;
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const clock = new THREE.Clock();
  let frame = 0, paused = false;
  function animate() {
    if (paused) return;
    frame = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Gentle automatic orbit always runs; pointer movement adds responsive tilt.
    rig.position.y = (window.innerWidth < 760 ? -.15 : .05) + Math.sin(t * .48) * .2;
    const viewHalfH = Math.tan(THREE.MathUtils.degToRad(camera.fov * .5)) * camera.position.z;
    const viewHalfW = viewHalfH * camera.aspect;
    const dotArray = dotGeometry.attributes.position.array;
    dotSeeds.forEach((dot, i) => {
      dotArray[i * 3] = dot.x + Math.sin(t * dot.speed + dot.phase) * dot.drift + pointer.x * dot.parallax;
      dotArray[i * 3 + 1] = dot.y + Math.cos(t * dot.speed * .82 + dot.phase) * dot.drift * 1.25 - pointer.y * dot.parallax;
      dotArray[i * 3 + 2] = dot.z + Math.sin(t * 1.1 + dot.phase) * .34;
    });
    dotGeometry.attributes.position.needsUpdate = true;
    dotMaterial.opacity = .78 + (Math.sin(t * 2.0) + 1) * .11;

    bots.forEach((bot, index) => {
      const x = Math.max(-viewHalfW * .88, Math.min(viewHalfW * .88, bot.baseX * Math.min(1, viewHalfW / 5.8)));
      bot.group.position.x = x + Math.sin(t * bot.speed + bot.phase) * .22 + pointer.x * .12;
      bot.group.position.y = bot.baseY * Math.min(1, viewHalfH / 3.5) + Math.sin(t * (bot.speed + .28) + bot.phase) * .24 - pointer.y * .08;
      bot.group.rotation.y = Math.sin(t * .65 + bot.phase) * .28 + pointer.x * .12;
      bot.group.rotation.z = Math.sin(t * .9 + bot.phase) * .08;
    });
    rig.rotation.y += (pointer.x * .62 + Math.sin(t * .34) * .22 - rig.rotation.y) * .035;
    rig.rotation.x += (-pointer.y * .48 + Math.cos(t * .28) * .16 - rig.rotation.x) * .035;
    ringA.rotation.z = -.28 + t * .24;
    ringA.rotation.x = 1.08 + Math.sin(t * .42) * .16;
    ringB.rotation.z = .68 - t * .30;
    ringB.rotation.x = .35 + Math.cos(t * .36) * .20;
    ringC.rotation.y = -.52 + t * .18;
    innerOrbit.rotation.z = .1 + t * .2;
    coolLight.position.x = -5 + Math.sin(t * .45) * 1.4;
    warmLight.position.y = -5 + Math.cos(t * .38) * 1.2;
    rimLight.position.x = 5 + Math.cos(t * .32) * 1.2;
    renderer.render(scene, camera);
  }
  animate();

  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
    if (paused) cancelAnimationFrame(frame);
    else { clock.start(); animate(); }
  });
})();

// Give the portrait a real perspective tilt and layered depth on pointer movement.
(function initPortrait3D() {
  const frame = document.querySelector(".hero-photo-frame");
  const photo = document.querySelector(".hero-profile-photo");
  if (!frame || !photo || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  frame.addEventListener("pointermove", event => {
    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - .5) * 15;
    const rotateX = (.5 - y) * 12;
    frame.style.setProperty("--photo-rotate-x", rotateX + "deg");
    frame.style.setProperty("--photo-rotate-y", rotateY + "deg");
    frame.style.setProperty("--photo-shift-x", ((x - .5) * 10) + "px");
    frame.style.setProperty("--photo-shift-y", ((y - .5) * 10) + "px");
    frame.classList.add("photo-hovering");
  });
  frame.addEventListener("pointerleave", () => {
    frame.classList.remove("photo-hovering");
    frame.style.setProperty("--photo-rotate-x", "0deg");
    frame.style.setProperty("--photo-rotate-y", "0deg");
    frame.style.setProperty("--photo-shift-x", "0px");
    frame.style.setProperty("--photo-shift-y", "0px");
  });
})();
