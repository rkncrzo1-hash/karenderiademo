/* =====================================================================
   chEATday - shared site script
   1) Edit the SITE_CONFIG block below (the ONLY place you need to edit)
   2) Wires up Messenger / Facebook / Viber / Maps links on every page
   ===================================================================== */

/* ============================ EDIT THIS ============================ */
var SITE_CONFIG = {
  // The part after facebook.com/ in the diner's Facebook Page link.
  // Example: facebook.com/alingnenaskainan  ->  "alingnenaskainan"
  messengerUsername: "YOUR_FACEBOOK_PAGE_USERNAME",

  // Full links. Leave as "" until you have them.
  facebookUrl: "",  // e.g. "https://www.facebook.com/alingnenaskainan"
  viberUrl: "",     // Viber community invite link
  mapsUrl: ""       // "Share" link of the diner's real pin on Google Maps
};
/* =================================================================== */

(function () {
  "use strict";

  function isSet(v) {
    return typeof v === "string" && v.trim() !== "" && v.indexOf("YOUR_") === -1;
  }

  var messengerUrl = isSet(SITE_CONFIG.messengerUsername)
    ? "https://m.me/" + encodeURIComponent(SITE_CONFIG.messengerUsername.trim())
    : "";

  // Used by the order form on order.html
  window.SITE = { messengerUrl: function () { return messengerUrl; } };

  /* ---------- 1) Link wiring ---------- */
  var targets = {
    messenger: messengerUrl,
    facebook: isSet(SITE_CONFIG.facebookUrl) ? SITE_CONFIG.facebookUrl.trim() : "",
    viber: isSet(SITE_CONFIG.viberUrl) ? SITE_CONFIG.viberUrl.trim() : "",
    maps: isSet(SITE_CONFIG.mapsUrl) ? SITE_CONFIG.mapsUrl.trim() : ""
  };


  /* ---------- Mobile menu drawer (slides in from the right) ---------- */
  function buildDrawer() {
    var toggle = document.getElementById("navToggle");
    if (!toggle || document.getElementById("mobileNav")) return;

    var page = (location.pathname.split("/").pop() || "index").replace(/\.html$/i, "").toLowerCase() || "index";
    var items = [
      ["index", "index.html", "Home", "home"],
      ["menu", "menu.html", "Menu", "restaurant_menu"],
      ["about", "about.html", "About & Kwento", "info"],
      ["contact", "contact.html", "Contact & Bisita", "location_on"]
    ];

    var links = items.map(function (it) {
      var active = it[0] === page;
      var cls = active
        ? "bg-primary text-on-primary shadow-sm"
        : "text-on-surface hover:bg-surface-container-high";
      return '<a href="' + it[1] + '"' + (active ? ' aria-current="page"' : "") +
        ' class="flex items-center gap-space-md px-space-md py-3 rounded-xl font-label-lg text-label-lg transition-colors ' + cls + '">' +
        '<span class="material-symbols-outlined">' + it[3] + "</span>" + it[2] + "</a>";
    }).join("");

    var overlay = document.createElement("div");
    overlay.id = "navOverlay";
    overlay.className = "fixed inset-0 z-[70] bg-black/50 opacity-0 pointer-events-none transition-opacity duration-300";
    overlay.setAttribute("aria-hidden", "true");

    var drawer = document.createElement("aside");
    drawer.id = "mobileNav";
    drawer.className = "fixed top-0 right-0 bottom-0 z-[80] w-[85%] max-w-sm bg-surface shadow-2xl flex flex-col translate-x-full transition-transform duration-300 ease-out";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", "Menu ng website");
    drawer.setAttribute("inert", "");
    drawer.innerHTML =
      '<div class="flex items-center justify-between h-20 px-space-md border-b border-outline-variant shrink-0">' +
        '<span class="flex items-center gap-space-sm font-headline-sm text-headline-sm text-on-surface"><img src="images/logo.png" alt="" class="h-10 w-auto"/>chEATday</span>' +
        '<button id="navClose" type="button" class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors" aria-label="Isara ang menu">' +
          '<span class="material-symbols-outlined">close</span></button>' +
      "</div>" +
      '<nav class="flex-1 overflow-y-auto p-space-md flex flex-col gap-space-xs" aria-label="Mga page">' + links + "</nav>" +
      '<div class="p-space-md border-t border-outline-variant flex flex-col gap-space-sm shrink-0" style="padding-bottom:max(1rem, env(safe-area-inset-bottom))">' +
        '<div class="inline-flex items-center justify-center gap-space-xs self-start bg-tertiary-fixed text-on-tertiary-fixed px-space-md py-space-xs rounded-full font-label-sm text-label-sm">' +
          '<span class="inline-block w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>Bukas Ngayon (6:00 AM - 8:00 PM)</div>' +
        '<a href="contact.html" data-link="messenger" class="flex items-center justify-center gap-space-sm bg-primary text-on-primary font-label-lg text-label-lg min-h-[52px] rounded-xl shadow-md hover:bg-primary-container transition-colors">' +
          '<span class="material-symbols-outlined">forum</span>Mag-message sa Messenger</a>' +
        '<a href="tel:09178234567" class="flex items-center justify-center gap-space-sm bg-surface-container-lowest text-on-surface font-label-lg text-label-lg min-h-[48px] rounded-xl border-2 border-secondary-container">' +
          '<span class="material-symbols-outlined text-primary">call</span>(0917) 823-4567</a>' +
      "</div>";

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    var closeBtn = drawer.querySelector("#navClose");
    var isOpen = false;

    function setOpen(open) {
      isOpen = open;
      drawer.classList.toggle("translate-x-full", !open);
      overlay.classList.toggle("opacity-0", !open);
      overlay.classList.toggle("pointer-events-none", !open);
      overlay.classList.toggle("pointer-events-auto", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) { drawer.removeAttribute("inert"); } else { drawer.setAttribute("inert", ""); }
      document.body.style.overflow = open ? "hidden" : "";
      if (open) { closeBtn.focus(); } else { toggle.focus(); }
    }

    toggle.addEventListener("click", function () { setOpen(!isOpen); });
    closeBtn.addEventListener("click", function () { setOpen(false); });
    overlay.addEventListener("click", function () { setOpen(false); });
    drawer.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a");
      if (a) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key === "Tab") { // keep focus inside the drawer
        var f = drawer.querySelectorAll("a[href], button");
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    if (window.matchMedia) {
      var mq = window.matchMedia("(min-width: 1024px)");
      var onChange = function (e) { if (e.matches && isOpen) setOpen(false); };
      if (mq.addEventListener) mq.addEventListener("change", onChange); else if (mq.addListener) mq.addListener(onChange);
    }
  }

  // Runs after the whole page is parsed, because on some pages this script
  // is loaded before the footer and chat button exist.
  function wireLinks() {
    document.querySelectorAll("a[data-link]").forEach(function (a) {
      var url = targets[a.getAttribute("data-link")];
      if (url) {
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      } else if (a.getAttribute("href") === "#" || a.getAttribute("href") === "https://m.me") {
        // not configured yet: don't jump to top of page
        a.addEventListener("click", function (e) { e.preventDefault(); });
      }
    });
  }
  function onReady() { buildDrawer(); wireLinks(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();
