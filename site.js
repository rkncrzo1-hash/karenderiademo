/* =====================================================================
   Aling Nena's Kainan - shared site script
   1) Edit the SITE_CONFIG block below (the ONLY place you need to edit)
   2) Wires up Messenger / Facebook / Viber / Maps links on every page
   3) Carries the Menu page tray over to the Order page
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

  var TRAY_KEY = "alingNena.tray";

  function isSet(v) {
    return typeof v === "string" && v.trim() !== "" && v.indexOf("YOUR_") === -1;
  }

  var messengerUrl = isSet(SITE_CONFIG.messengerUsername)
    ? "https://m.me/" + encodeURIComponent(SITE_CONFIG.messengerUsername.trim())
    : "";

  // Used by the order form on order.html
  window.SITE = {
    messengerUrl: function () { return messengerUrl; },
    trayKey: TRAY_KEY
  };

  /* ---------- 1) Link wiring ---------- */
  var targets = {
    messenger: messengerUrl,
    facebook: isSet(SITE_CONFIG.facebookUrl) ? SITE_CONFIG.facebookUrl.trim() : "",
    viber: isSet(SITE_CONFIG.viberUrl) ? SITE_CONFIG.viberUrl.trim() : "",
    maps: isSet(SITE_CONFIG.mapsUrl) ? SITE_CONFIG.mapsUrl.trim() : ""
  };

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
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireLinks);
  } else {
    wireLinks();
  }

  /* ---------- 2) Carry the menu tray over to the order form ---------- */
  var list = document.getElementById("dishList");
  if (!list) return;

  var saved = [];
  try { saved = JSON.parse(localStorage.getItem(TRAY_KEY) || "[]"); } catch (e) { saved = []; }
  if (!Array.isArray(saved) || saved.length === 0) return;

  var rows = Array.prototype.slice.call(list.querySelectorAll(".dish-item"));
  if (rows.length === 0) return;
  var pristine = rows[0].cloneNode(true); // untouched copy used as template
  var fresh = document.createDocumentFragment();

  function markSelected(row, qty) {
    row.querySelector(".dish-check").checked = true;
    row.querySelector(".qty-val").textContent = String(qty);
    row.querySelectorAll(".qty-btn").forEach(function (b) { b.removeAttribute("disabled"); });
    row.classList.remove("bg-surface-container-low");
    row.classList.add("bg-surface-container-highest");
  }

  saved.forEach(function (item, idx) {
    var name = String(item && item.name || "").trim();
    var price = Number(item && item.price);
    var qty = Math.max(1, parseInt(item && item.qty, 10) || 1);
    if (!name || !isFinite(price)) return;

    var row = rows.filter(function (r) {
      return (r.dataset.name || "").toLowerCase() === name.toLowerCase();
    })[0];

    if (!row) {
      row = pristine.cloneNode(true);
      row.dataset.name = name;
      row.dataset.price = String(price);
      var cb = row.querySelector(".dish-check");
      var id = "dish-menu-" + idx;
      cb.id = id;
      cb.checked = false;
      var label = row.querySelector("label");
      label.setAttribute("for", id);
      label.textContent = name;
      label.title = name;
      row.querySelector("span.text-secondary").textContent = "\u20B1" + price.toFixed(2);
      fresh.appendChild(row);
    }
    markSelected(row, qty);
  });

  list.insertBefore(fresh, list.firstChild);
})();
