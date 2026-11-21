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


// FULL-PAGE THREE.JS BACKGROUND: interactive 3D energy orb
(function initPageBackground3D() {
  const canvas = document.getElementById("background-3d-canvas");
  if (!canvas || !window.THREE) {
    console.warn("Three.js background unavailable. Check CDN connection.");
    return;
  }

  const THREE = window.THREE;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, .1, 100);
  camera.position.set(0, 0, 12);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  if ("outputEncoding" in renderer) renderer.outputEncoding = THREE.sRGBEncoding;

  scene.add(new THREE.HemisphereLight(0x8da8d8, 0x080b20, .8));
  const keyLight = new THREE.PointLight(0x31cfff, 2.1, 28);
  keyLight.position.set(3, 4, 6); scene.add(keyLight);
  const violetLight = new THREE.PointLight(0x7950ff, 2.0, 24);
  violetLight.position.set(-4, -2, 3); scene.add(violetLight);
  const rimLight = new THREE.PointLight(0x16a9ff, 1.2, 22);
  rimLight.position.set(1, 4, -4); scene.add(rimLight);

  // Center the orb in the viewport so it remains the visual focus across every section.
  const orbRig = new THREE.Group();
  orbRig.position.set(0, 0, -1.1);
  scene.add(orbRig);

  const coreMaterial = new THREE.MeshPhongMaterial({
    color: 0x101b3a, specular: 0x8cecff, shininess: 95,
    emissive: 0x071b42, emissiveIntensity: .75,
    transparent: true, opacity: .94
  });
  const core = new THREE.Mesh(new THREE.SphereGeometry(1.48, 64, 48), coreMaterial);
  orbRig.add(core);

  const innerSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.23, 48, 36),
    new THREE.MeshBasicMaterial({ color: 0x102c69, wireframe: true, transparent: true, opacity: .2 })
  );
  orbRig.add(innerSphere);

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(1.62, 48, 36),
    new THREE.MeshBasicMaterial({ color: 0x42cfff, wireframe: true, transparent: true, opacity: .13 })
  );
  orbRig.add(shell);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(1.78, 48, 36),
    new THREE.MeshBasicMaterial({ color: 0x247cff, side: THREE.BackSide, transparent: true, opacity: .055 })
  );
  orbRig.add(halo);

  const orbitMaterial = new THREE.MeshPhongMaterial({
    color: 0x1b477b, specular: 0x75eaff, shininess: 100,
    emissive: 0x09234b, emissiveIntensity: .8,
    transparent: true, opacity: .9
  });
  const orbitA = new THREE.Mesh(new THREE.TorusGeometry(2.12, .035, 12, 180), orbitMaterial);
  orbitA.rotation.set(1.08, .28, -.24); orbRig.add(orbitA);
  const orbitB = new THREE.Mesh(new THREE.TorusGeometry(2.34, .022, 10, 180), orbitMaterial.clone());
  orbitB.rotation.set(.32, 1.1, .72); orbRig.add(orbitB);
  const orbitC = new THREE.Mesh(new THREE.TorusGeometry(1.88, .018, 10, 180), orbitMaterial.clone());
  orbitC.rotation.set(1.45, -.45, .18); orbRig.add(orbitC);

  // Curved energy filaments wrap around the sphere and slowly travel with it.
  const energyMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x5beaff, transparent: true, opacity: .72 }),
    new THREE.MeshBasicMaterial({ color: 0x9874ff, transparent: true, opacity: .55 }),
    new THREE.MeshBasicMaterial({ color: 0x238dff, transparent: true, opacity: .5 })
  ];
  const filaments = [];
  for (let k = 0; k < 3; k++) {
    const points = [];
    const radius = 1.52 + k * .055;
    for (let i = 0; i <= 100; i++) {
      const u = i / 100 * Math.PI * 2;
      const v = Math.sin(u * (2 + k) + k) * .42;
      points.push(new THREE.Vector3(
        Math.cos(u) * radius * Math.cos(v),
        Math.sin(u) * radius * Math.cos(v),
        Math.sin(v) * radius
      ));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const line = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, .012, 5, false), energyMaterials[k]);
    line.rotation.set(k * .85, k * .62, k * .4);
    orbRig.add(line);
    filaments.push(line);
  }

  // Tiny satellites orbit the energy sphere.
  const satellites = [];
  const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0x8cecff });
  for (let i = 0; i < 8; i++) {
    const satellite = new THREE.Mesh(new THREE.SphereGeometry(i % 3 === 0 ? .055 : .032, 12, 10), satelliteMaterial);
    orbRig.add(satellite);
    satellites.push({ mesh: satellite, angle: i / 8 * Math.PI * 2, radius: 2.2 + (i % 2) * .28, speed: .22 + (i % 3) * .08, tilt: i % 2 ? .7 : -.55 });
  }

  // Background particles add depth without obscuring text.
  const particleCount = 760;
  const positions = new Float32Array(particleCount * 3);
  const seeds = [];
  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - .5) * 20;
    const y = (Math.random() - .5) * 13;
    const z = -3 - Math.random() * 8;
    positions.set([x, y, z], i * 3);
    seeds.push({ x, y, z, phase: Math.random() * Math.PI * 2, speed: .25 + Math.random() * .55 });
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
    color: 0x56cfff, size: .045, transparent: true, opacity: .58,
    sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending
  }));
  scene.add(particles);

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.addEventListener("pointermove", event => {
    pointer.targetX = (event.clientX / window.innerWidth - .5) * 2;
    pointer.targetY = (event.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mobile = width <= 600;
    const tablet = width > 600 && width <= 1024;
    // Keep a generous orb on desktop, then scale it to fit tablet and phone screens.
    const responsiveScale = mobile ? .78 : tablet ? .94 : 1.14;
    orbRig.position.set(0, 0, -1.1);
    orbRig.scale.setScalar(responsiveScale);
    canvas.style.opacity = mobile ? ".68" : tablet ? ".76" : ".84";
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.5));
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const clock = new THREE.Clock();
  let frame = 0;
  let paused = document.hidden;
  function animate() {
    if (paused) return;
    frame = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const motion = reducedMotion ? .12 : 1;
    pointer.x += (pointer.targetX - pointer.x) * .035;
    pointer.y += (pointer.targetY - pointer.y) * .035;

    orbRig.rotation.y += ((pointer.x * .42 + Math.sin(t * .24) * .12) - orbRig.rotation.y) * .035;
    orbRig.rotation.x += ((-pointer.y * .32 + Math.cos(t * .2) * .1) - orbRig.rotation.x) * .035;
    orbRig.position.y = Math.sin(t * .42) * .12 * motion;
    core.rotation.y = t * .08 * motion;
    innerSphere.rotation.y = -t * .12 * motion;
    innerSphere.rotation.x = t * .06 * motion;
    shell.rotation.y = -t * .045 * motion;
    orbitA.rotation.z = -.24 + t * .16 * motion;
    orbitB.rotation.z = .72 - t * .12 * motion;
    orbitC.rotation.x = 1.45 + Math.sin(t * .3) * .16 * motion;
    filaments.forEach((line, index) => {
      line.rotation.y += (.002 + index * .0005) * motion;
      line.rotation.x = index * .85 + Math.sin(t * .32 + index) * .12 * motion;
    });
    satellites.forEach(item => {
      const angle = item.angle + t * item.speed * motion;
      item.mesh.position.set(
        Math.cos(angle) * item.radius,
        Math.sin(angle) * item.radius * item.tilt,
        Math.sin(angle * 1.4) * .72
      );
    });
    const array = particleGeometry.attributes.position.array;
    seeds.forEach((p, i) => {
      array[i * 3] = p.x + Math.sin(t * p.speed + p.phase) * .18 + pointer.x * .12;
      array[i * 3 + 1] = p.y + Math.cos(t * p.speed + p.phase) * .2 - pointer.y * .12;
      array[i * 3 + 2] = p.z;
    });
    particleGeometry.attributes.position.needsUpdate = true;
    keyLight.position.x = 3 + pointer.x * 1.5 + Math.sin(t * .3) * .6;
    violetLight.position.y = -2 + pointer.y * 1.2;
    renderer.render(scene, camera);
  }

  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
    if (paused) cancelAnimationFrame(frame);
    else { clock.start(); animate(); }
  });
  if (!paused) animate();
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
