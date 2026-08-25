/* ============================================================
   NONGSUNG BEEF — app
   ============================================================ */
(function () {
  "use strict";

  var DEFAULT_LANG = "th";
  var STORE_KEY = "nsb.lang";

  /* ---------- language ---------- */

  function pickLang() {
    // A per-language build pins its own language and must win over anything
    // remembered from another file — otherwise the visitor opens the Thai
    // export and sees the language they last used in a different build.
    if (window.FORCE_LANG && window.I18N[window.FORCE_LANG]) return window.FORCE_LANG;

    var q = new URLSearchParams(location.search).get("lang");
    if (q && window.I18N[q]) return q;
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (saved && window.I18N[saved]) return saved;
    return DEFAULT_LANG;
  }

  function apply(lang) {
    var dict = window.I18N[lang];
    if (!dict) return;

    document.documentElement.lang = dict["html.lang"] || lang;
    document.title = dict["meta.title"] || document.title;

    var md = document.querySelector('meta[name="description"]');
    if (md && dict["meta.desc"]) md.setAttribute("content", dict["meta.desc"]);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });

    document.querySelectorAll("#lang button").forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.lang === lang);
    });

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}

    buildMarquee(dict);
  }

  function buildLangSwitch() {
    var host = document.getElementById("lang");
    if (!host) return;
    window.LANGS.forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button";
      b.dataset.lang = l.code;
      b.textContent = l.label;
      b.addEventListener("click", function () { apply(l.code); });
      host.appendChild(b);
    });
  }

  /* ---------- marquee ---------- */

  function buildMarquee(dict) {
    var track = document.getElementById("marqTrack");
    if (!track) return;
    var items = ["marq.1", "marq.2", "marq.3", "marq.4", "marq.5"]
      .map(function (k) { return dict[k]; })
      .filter(Boolean);
    track.innerHTML = "";
    // duplicated once so the -50% translate loops seamlessly
    for (var pass = 0; pass < 2; pass++) {
      items.forEach(function (t) {
        var s = document.createElement("span");
        s.textContent = t;
        track.appendChild(s);
      });
    }
  }

  /* ---------- nav ---------- */

  function initNav() {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("burger");

    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });

    document.querySelectorAll("#navLinks a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- reveal on scroll ---------- */

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px", threshold: 0 });
    els.forEach(function (e) { io.observe(e); });

    // Anything already on screen reveals immediately — a negative rootMargin
    // used to swallow the hero's own buttons, leaving the first screen blank.
    els.forEach(function (e) {
      if (e.getBoundingClientRect().top < window.innerHeight) e.classList.add("in");
    });

    // Last resort: content is never allowed to stay invisible.
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.in)").forEach(function (e) {
        if (e.getBoundingClientRect().top < window.innerHeight * 1.5) e.classList.add("in");
      });
    }, 1200);
  }

  /* ---------- hero parallax ---------- */

  function initParallax() {
    var img = document.getElementById("heroImg");
    if (!img || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, window.innerHeight);
        img.style.transform = "scale(1.02) translateY(" + (y * 0.18) + "px)";
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- traceability hotspots ---------- */

  function initTrace() {
    var hots = document.querySelectorAll(".hot");
    var panels = document.querySelectorAll(".trace__i");
    if (!hots.length) return;

    function select(n) {
      hots.forEach(function (h) { h.classList.toggle("is-on", h.dataset.hot === n); });
      panels.forEach(function (p) { p.classList.toggle("is-open", p.dataset.panel === n); });
    }

    hots.forEach(function (h) {
      h.addEventListener("click", function () { select(h.dataset.hot); });
      h.addEventListener("mouseenter", function () { select(h.dataset.hot); });
    });
    panels.forEach(function (p) {
      p.addEventListener("click", function () { select(p.dataset.panel); });
      p.addEventListener("mouseenter", function () { select(p.dataset.panel); });
    });
  }

  /* ---------- B2B form → mailto ---------- */

  function initForm() {
    var form = document.getElementById("b2bForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var f = new FormData(form);
      var lines = [
        "Name: " + (f.get("name") || ""),
        "Company: " + (f.get("company") || ""),
        "Email: " + (f.get("email") || ""),
        "Country / market: " + (f.get("country") || ""),
        "Interested in: " + (f.get("interest") || ""),
        "",
        f.get("message") || ""
      ];

      var subject = "Nongsung Beef — enquiry from " + (f.get("company") || f.get("name") || "website");
      location.href =
        "mailto:nongsungbeef@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
    });
  }

  /* ---------- go ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    var y = document.getElementById("yr");
    if (y) y.textContent = new Date().getFullYear();

    buildLangSwitch();
    apply(pickLang());
    initNav();
    initReveal();
    initParallax();
    initTrace();
    initForm();
  });
})();
