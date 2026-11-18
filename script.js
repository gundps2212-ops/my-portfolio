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


// THREE.JS: animated 3D robot built from real 3D meshes
(function initThreeRobot() {
  const canvas = document.getElementById("three-canvas");
  if (!canvas || !window.THREE) {
    console.warn("Three.js unavailable: check the CDN connection.");
    return;
  }
  const THREE = window.THREE, host = canvas.parentElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.15, 8.5);
  const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.setClearColor(0x000000,0);
  scene.add(new THREE.HemisphereLight(0x9edcff,0x11152e,2.1));
  const key=new THREE.PointLight(0x63eaff,3.2,18);key.position.set(3,4,5);scene.add(key);
  const violetLight=new THREE.PointLight(0x8b63ff,2.7,15);violetLight.position.set(-4,-1,2);scene.add(violetLight);
  const rim=new THREE.DirectionalLight(0xffffff,1.5);rim.position.set(0,3,-4);scene.add(rim);
  const robot=new THREE.Group();scene.add(robot);
  const shell=new THREE.MeshPhysicalMaterial({color:0x8fcfff,metalness:.78,roughness:.23,clearcoat:1,clearcoatRoughness:.12});
  const dark=new THREE.MeshStandardMaterial({color:0x101b35,metalness:.85,roughness:.28});
  const glow=new THREE.MeshStandardMaterial({color:0x64f4ff,emissive:0x16bfff,emissiveIntensity:2.4,metalness:.25,roughness:.2});
  const violet=new THREE.MeshStandardMaterial({color:0x9775ff,emissive:0x4b20ff,emissiveIntensity:1.3,metalness:.65,roughness:.25});
  function ball(parent,mat,pos,scale,segments=40){const m=new THREE.Mesh(new THREE.SphereGeometry(1,segments,segments),mat);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;parent.add(m);return m;}
  function tube(parent,mat,rt,rb,h,pos,rot=[0,0,0]){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,32),mat);m.position.set(...pos);m.rotation.set(...rot);m.castShadow=true;parent.add(m);return m;}
  // chest, neck and shoulder armour
  tube(robot,dark,.28,.34,.42,[0,-.93,0]);
  ball(robot,shell,[0,-1.55,0],[1.02,.82,.57]);
  ball(robot,dark,[0,-1.42,.48],[.65,.42,.15]);
  ball(robot,glow,[0,-1.42,.625],[.28,.12,.035],24);
  ball(robot,shell,[-1.12,-1.28,0],[.42,.48,.45]);ball(robot,shell,[1.12,-1.28,0],[.42,.48,.45]);
  tube(robot,dark,.22,.28,.75,[-1.24,-1.86,0],[0,0,-.12]);tube(robot,dark,.22,.28,.75,[1.24,-1.86,0],[0,0,.12]);
  ball(robot,violet,[-1.27,-2.28,.02],[.25,.25,.25],24);ball(robot,violet,[1.27,-2.28,.02],[.25,.25,.25],24);
  // head, visor and glowing eyes
  ball(robot,shell,[0,.18,0],[.91,1.02,.7],48);
  ball(robot,dark,[0,.08,.59],[.72,.56,.17],40);
  ball(robot,glow,[-.32,.2,.75],[.17,.115,.055],24);ball(robot,glow,[.32,.2,.75],[.17,.115,.055],24);
  ball(robot,violet,[0,.55,.69],[.36,.055,.035],24);
  for(let i=0;i<5;i++){const bar=new THREE.Mesh(new THREE.BoxGeometry(.055,.17,.035),glow);bar.position.set((i-2)*.105,-.28,.75);robot.add(bar);}
  ball(robot,dark,[-.9,.12,0],[.2,.38,.28]);ball(robot,dark,[.9,.12,0],[.2,.38,.28]);
  ball(robot,glow,[-1.02,.13,.12],[.075,.19,.09],20);ball(robot,glow,[1.02,.13,.12],[.075,.19,.09],20);
  tube(robot,violet,.035,.055,.34,[0,1.2,0]);ball(robot,glow,[0,1.4,0],[.12,.12,.12],24);
  // three rotating energy rings
  const orbit=new THREE.Group();robot.add(orbit);
  const ring1=new THREE.Mesh(new THREE.TorusGeometry(1.72,.018,12,150),glow);ring1.rotation.set(1.18,.1,.22);orbit.add(ring1);
  const ring2=new THREE.Mesh(new THREE.TorusGeometry(2.05,.012,10,150),violet);ring2.rotation.set(.45,-.65,-.55);orbit.add(ring2);
  const ring3=new THREE.Mesh(new THREE.TorusGeometry(1.5,.009,8,120),shell);ring3.rotation.set(1.9,.8,.3);orbit.add(ring3);
  for(let i=0;i<8;i++){const n=new THREE.Mesh(new THREE.SphereGeometry(.055,16,16),i%2?glow:violet);const a=i/8*Math.PI*2;n.position.set(Math.cos(a)*1.95,Math.sin(a)*1.45,Math.sin(a*2)*.55);orbit.add(n);}
  // floating particles
  const count=180,coords=new Float32Array(count*3);
  for(let i=0;i<count;i++){coords[i*3]=(Math.random()-.5)*5.8;coords[i*3+1]=(Math.random()-.5)*6.5;coords[i*3+2]=(Math.random()-.5)*2.5-1;}
  const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(coords,3));
  const particles=new THREE.Points(pg,new THREE.PointsMaterial({color:0x9bdfff,size:.025,transparent:true,opacity:.72}));scene.add(particles);
  const pointer={x:0,y:0};
  host.addEventListener("pointermove",e=>{const r=host.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5)*2;pointer.y=((e.clientY-r.top)/r.height-.5)*2;},{passive:true});
  host.addEventListener("pointerleave",()=>{pointer.x=0;pointer.y=0;});
  function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  resize();if("ResizeObserver"in window)new ResizeObserver(resize).observe(host);else window.addEventListener("resize",resize);
  const clock=new THREE.Clock();let frame=0,paused=false;
  function animate(){if(paused)return;frame=requestAnimationFrame(animate);const t=clock.getElapsedTime();robot.position.y=Math.sin(t*1.15)*.09;robot.rotation.y+=(pointer.x*.28-robot.rotation.y)*.035;robot.rotation.x+=(-pointer.y*.16-robot.rotation.x)*.035;orbit.rotation.y=t*.2;orbit.rotation.z=Math.sin(t*.35)*.12;particles.rotation.y=t*.025;renderer.render(scene,camera);}
  animate();
  document.addEventListener("visibilitychange",()=>{paused=document.hidden;if(!paused){clock.start();animate();}else cancelAnimationFrame(frame);});
})();
