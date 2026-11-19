/**
 * NEXA PORTFOLIO — script.js
 * JavaScript Vanilla tanpa framework
 * ============================================================
 *
 * TABLE OF CONTENTS
 * 1.  CONFIG — ubah nama brand dan info kontak di sini
 * 2.  DOM Ready Helper
 * 3.  Admin Data Loader (baca data dari admin.html)
 * 4.  Copyright Year (otomatis)
 * 5.  Navbar Scroll Effect
 * 6.  Hamburger Mobile Menu
 * 7.  Smooth Scrolling
 * 8.  Active Nav Link (saat scroll)
 * 9.  Scroll Reveal (Intersection Observer)
 * 10. Project Filter
 * 11. Back to Top Button
 * ============================================================
 */


/* ============================================================
   1. CONFIG
   ✏️ Fallback jika belum ada data dari Admin Panel
   ============================================================ */
const CONFIG = {
  brandName: "NEXA",
  fullName:  "Bagas Adrian Saputra",
  email:     "Bagasadrian091@gmail.com",
  whatsapp:  "085763879676",
  location:  "Purwokerto Barat, Banyumas",
  instagram: "https://instagram.com/username",   /* ← placeholder, isi nanti */
  linkedin:  "https://linkedin.com/in/username", /* ← placeholder, isi nanti */
  github:    "https://github.com/username",      /* ← placeholder, isi nanti */
};

/* Key localStorage — harus sama dengan yang di admin.html */
const STORE_KEY = "nexa_admin_data";


/* ============================================================
   2. DOM READY
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  loadAdminData();      /* ← Load data admin terlebih dahulu */
  applyConfig();
  setCopyrightYear();
  initNavbarScroll();
  initHamburgerMenu();
  initSmoothScroll();
  initActiveNavLink();
  initScrollReveal();
  initProjectFilter();
  initBackToTop();

});


/* ============================================================
   3. ADMIN DATA LOADER
   Membaca data yang disimpan dari admin.html dan
   menerapkannya ke elemen HTML secara otomatis.
   ============================================================ */
function loadAdminData() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return;

  let d;
  try { d = JSON.parse(raw); }
  catch (e) { console.warn("NEXA: Gagal membaca data admin.", e); return; }

  /* ---- IDENTITY ---- */
  if (d.identity) {
    const id = d.identity;
    if (id.brandName) {
      CONFIG.brandName = id.brandName;
      document.querySelectorAll(".logo-mark").forEach(el => el.textContent = id.brandName);
      document.title = `${id.brandName} — Personal Portfolio`;
    }
    setText("hero-h1-line1", id.headline1);
    setText("hero-h1-line2", id.headline2, "em");
    setText("hero-desc-text",    id.heroDesc);
    setText("hero-status-text",  id.heroStatus);
    setText("hero-location-text",id.heroLocation);
  }

  /* ---- ABOUT ---- */
  if (d.about) {
    const ab = d.about;
    setText("about-name-text",     ab.name);
    setText("about-title-text",    ab.title);
    setText("about-greeting-text", ab.greeting);
    setText("about-p1-text",       ab.p1);
    setText("about-p2-text",       ab.p2);

    /* Tags */
    if (ab.tags) {
      const tagContainer = document.getElementById("about-tags-container");
      if (tagContainer) {
        tagContainer.innerHTML = ab.tags.split(",")
          .map(t => `<span class="tag">${t.trim()}</span>`).join("");
      }
    }

    /* Education list */
    if (ab.education && ab.education.length) {
      const eduList = document.getElementById("about-edu-list");
      if (eduList) {
        eduList.innerHTML = ab.education.map(edu => `
          <li>
            <strong>${edu.school}</strong> — ${edu.major}
            <span class="about__list-meta">${edu.year}</span>
          </li>`).join("");
      }
    }
  }

  /* ---- PROJECTS ---- */
  if (d.projects && d.projects.length) {
    const grid = document.getElementById("projects-grid");
    if (grid) {
      grid.innerHTML = d.projects.map((p, i) => {
        const catLabel = {
          web:"Web Development", uiux:"UI/UX Design",
          graphic:"Graphic Design", business:"Business Project", academic:"Academic Project"
        }[p.category] || p.category;

        const techTags = (p.tech || "").split(",")
          .map(t => `<span class="tech-tag">${t.trim()}</span>`).join("");
        const demoBtn   = p.demo   ? `<a href="${p.demo}"   class="btn btn--sm btn--ghost" target="_blank" rel="noopener"><i class="ph ph-arrow-square-out"></i> Live Demo</a>` : "";
        const githubBtn = p.github ? `<a href="${p.github}" class="btn btn--sm btn--ghost" target="_blank" rel="noopener"><i class="ph ph-github-logo"></i> GitHub</a>` : "";

        return `
          <article class="project-card reveal" data-category="${p.category}">
            <div class="project-card__thumb">
              <img src="${p.thumb || `assets/images/project-${i+1}.jpg`}" alt="${p.title}"
                onerror="this.parentElement.classList.add('no-img')" />
              <div class="project-card__thumb-fallback"><i class="ph ph-layout"></i></div>
              <span class="project-card__category">${catLabel}</span>
            </div>
            <div class="project-card__body">
              <h3 class="project-card__title">${p.title}</h3>
              <p class="project-card__desc">${p.desc}</p>
              <div class="project-card__tech">${techTags}</div>
              <div class="project-card__actions">
                <a href="#" class="btn btn--sm btn--primary">View Details</a>
                ${demoBtn}${githubBtn}
              </div>
            </div>
          </article>`;
      }).join("");
    }
  }

  /* ---- SKILLS ---- */
  if (d.skills && d.skills.length) {
    const grid = document.getElementById("skills-grid-dynamic");
    if (grid) {
      const iconMap = {
        "Desain Grafis & Multimedia":"palette",
        "Microsoft Office & Administrasi":"microsoft-word-logo",
        "IT, Jaringan & Web Development":"code",
        "UI/UX & Digital Marketing":"figma-logo",
        "Soft Skills & Manajemen":"users-three",
      };
      grid.innerHTML = d.skills.map((group, gi) => {
        const icon = iconMap[group.category] || "wrench";
        const delay = gi % 3 === 1 ? "reveal--delay-1" : gi % 3 === 2 ? "reveal--delay-2" : "";
        const badge = group.level ? `<div class="skill-group__level-badge skill-group__level-badge--${group.level}">
          ${group.level === "proficient" ? "Berpengalaman" : "Sedang Belajar"}</div>` : "";
        const itemIcon = group.level === "learning" ? "student" : "check";
        return `
          <div class="skill-group reveal ${delay}">
            <div class="skill-group__header">
              <i class="ph ph-${icon}"></i><h3>${group.category}</h3>
            </div>
            ${badge}
            <ul class="skill-list">
              ${(group.items || []).map(item =>
                `<li class="skill-item"><i class="ph ph-${itemIcon}"></i> ${item}</li>`
              ).join("")}
            </ul>
          </div>`;
      }).join("");
    }
  }

  /* ---- EXPERIENCE ---- */
  if (d.experience && d.experience.length) {
    const timeline = document.getElementById("timeline-dynamic");
    if (timeline) {
      const iconMap  = { org:"users", event:"calendar-check", work:"briefcase", edu:"graduation-cap" };
      const typeLabel = { org:"Organisasi", event:"Kepanitiaan", work:"Magang / PKL", edu:"Pendidikan" };
      timeline.innerHTML = d.experience.map(exp => `
        <div class="timeline__item reveal" data-type="${exp.type}">
          <div class="timeline__dot"><i class="ph ph-${iconMap[exp.type]||"star"}"></i></div>
          <div class="timeline__content">
            <div class="timeline__meta">
              <span class="timeline__type">${typeLabel[exp.type]||exp.type}</span>
              <span class="timeline__year">${exp.year}</span>
            </div>
            <h3 class="timeline__title">${exp.title}</h3>
            <p class="timeline__place">${exp.place}</p>
            <p class="timeline__desc">${exp.desc}</p>
          </div>
        </div>`).join("");
    }
  }

  /* ---- CONTACT ---- */
  if (d.contact) {
    const c = d.contact;
    if (c.email) {
      CONFIG.email = c.email;
      document.querySelectorAll("[data-contact='email']").forEach(el => {
        el.href = `mailto:${c.email}`;
        const val = el.querySelector(".contact-link__value");
        if (val) val.textContent = c.email;
      });
      document.querySelectorAll("[data-contact='email-mailto']").forEach(el => {
        el.href = `mailto:${c.email}`;
      });
    }
    if (c.whatsapp) {
      CONFIG.whatsapp = c.whatsapp;
      setContactLink("contact-whatsapp", toWaLink(c.whatsapp), c.whatsapp);
    }
    if (c.location) {
      CONFIG.location = c.location;
      const locVal = document.querySelector("#contact-location .contact-link__value");
      if (locVal) locVal.textContent = c.location;
    }
    setContactLink("contact-instagram", c.instagram, "@" + (c.instagram||"").split("/").pop());
    setContactLink("contact-linkedin",  c.linkedin,  (c.linkedin||"").replace("https://",""));
    setContactLink("contact-github",    c.github,    (c.github||"").replace("https://",""));
  }
}

/* -- Helpers -- */
function setText(id, value, wrapTag) {
  if (!value) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = wrapTag ? `<${wrapTag}>${value}</${wrapTag}>` : "";
  if (!wrapTag) el.textContent = value;
}

/* Ubah nomor lokal (08xx...) menjadi link WhatsApp (wa.me/628xx...) */
function toWaLink(num) {
  let n = String(num || "").replace(/[^\d]/g, "");
  if (n.startsWith("0")) n = "62" + n.slice(1);
  return n ? `https://wa.me/${n}` : "";
}

function setContactLink(id, url, displayText) {
  if (!url) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.href = url;
  const val = el.querySelector(".contact-link__value");
  if (val && displayText) val.textContent = displayText;
}


/* ============================================================
   4. APPLY CONFIG
   ============================================================ */
function applyConfig() {
  document.querySelectorAll(".logo-mark").forEach(el => el.textContent = CONFIG.brandName);
  document.title = `${CONFIG.brandName} — Personal Portfolio`;
}


/* ============================================================
   5. COPYRIGHT YEAR
   ============================================================ */
function setCopyrightYear() {
  const el = document.getElementById("current-year");
  if (el) el.textContent = new Date().getFullYear();
}


/* ============================================================
   6. NAVBAR SCROLL EFFECT
   ============================================================ */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const THRESHOLD = 60;
  function update() { navbar.classList.toggle("navbar--scrolled", window.scrollY > THRESHOLD); }
  update();
  window.addEventListener("scroll", update, { passive: true });
}


/* ============================================================
   7. HAMBURGER MOBILE MENU
   ============================================================ */
function initHamburgerMenu() {
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!hamburger || !mobileMenu) return;

  const open = () => {
    hamburger.classList.add("is-open");
    mobileMenu.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    hamburger.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  hamburger.addEventListener("click", () =>
    hamburger.classList.contains("is-open") ? close() : open());

  mobileMenu.querySelectorAll(".mobile-nav-link").forEach(l => l.addEventListener("click", close));

  document.addEventListener("click", (e) => {
    if (mobileMenu.classList.contains("is-open") &&
        !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) close();
  });

  window.addEventListener("resize", () => { if (window.innerWidth > 768) close(); });
}


/* ============================================================
   8. SMOOTH SCROLLING
   ============================================================ */
function initSmoothScroll() {
  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--navbar-h")) || 68;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", function(e) {
      const id = this.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: "smooth" });
    });
  });
}


/* ============================================================
   9. ACTIVE NAV LINK
   ============================================================ */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  if (!navLinks.length) return;
  const sections = Array.from(navLinks).map(l => document.getElementById(l.dataset.section)).filter(Boolean);
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--navbar-h")) || 68;

  function update() {
    let current = "";
    sections.forEach(s => {
      const top = s.getBoundingClientRect().top;
      if (top <= navH + 60 && top + s.offsetHeight > navH) current = s.id;
    });
    navLinks.forEach(l => l.classList.toggle("active", l.dataset.section === current));
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}


/* ============================================================
   10. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); observer.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach(el => observer.observe(el));
}


/* ============================================================
   11. PROJECT FILTER
   ============================================================ */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const grid        = document.getElementById("projects-grid");
  const empty       = document.getElementById("projects-empty");

  if (!filterBtns.length || !grid) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const filter = this.dataset.filter;
      filterBtns.forEach(b => b.classList.remove("filter-btn--active"));
      this.classList.add("filter-btn--active");

      let count = 0;
      grid.querySelectorAll(".project-card").forEach(card => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !show);
        if (show) {
          count++;
          card.classList.remove("is-visible");
          requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("is-visible")));
        }
      });
      if (empty) empty.style.display = count === 0 ? "flex" : "none";
    });
  });
}


/* ============================================================
   12. BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () =>
    btn.classList.toggle("is-visible", window.scrollY > 400), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
