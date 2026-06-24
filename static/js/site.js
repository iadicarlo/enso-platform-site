/* site.js - shared site chrome loaded on every page:
   - click/tap-to-open nav dropdowns (idempotent; works on touch)
   - "About" nav link
   - mobile hamburger menu
   - site footer with author credit, contact, and data-source pointer
   Self-contained and safe to load alongside app.js. */
(function () {
  function wireNavDropdowns() {
    document.querySelectorAll(".nav-dropdown-toggle").forEach(function (t) {
      if (t.dataset.navWired) return;
      t.dataset.navWired = "1";
      t.addEventListener("click", function (e) {
        e.stopPropagation();
        var parent = t.closest(".nav-dropdown");
        if (!parent) return;
        var wasOpen = parent.classList.contains("open");
        document.querySelectorAll(".nav-dropdown.open").forEach(function (p) {
          if (p !== parent) p.classList.remove("open");
        });
        parent.classList.toggle("open", !wasOpen);
      });
    });
    if (!document.body.dataset.navOutsideWired) {
      document.body.dataset.navOutsideWired = "1";
      document.addEventListener("click", function (e) {
        if (e.target.closest(".nav-dropdown")) return;
        document.querySelectorAll(".nav-dropdown.open").forEach(function (p) { p.classList.remove("open"); });
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          document.querySelectorAll(".nav-dropdown.open").forEach(function (p) { p.classList.remove("open"); });
        }
      });
    }
  }

  function injectChrome() {
    var headerInner = document.querySelector(".header-inner");
    var nav = headerInner ? headerInner.querySelector("nav") : null;

    if (nav && !nav.querySelector('a[href="about.html"]')) {
      var a = document.createElement("a");
      a.href = "about.html";
      a.textContent = "About";
      a.setAttribute("data-nav", "about");
      if (document.body.dataset.page === "about") a.classList.add("active");
      nav.appendChild(a);
    }

    if (headerInner && nav && !headerInner.querySelector(".nav-toggle")) {
      var btn = document.createElement("button");
      btn.className = "nav-toggle";
      btn.type = "button";
      btn.setAttribute("aria-label", "Toggle navigation");
      btn.innerHTML = "<span></span><span></span><span></span>";
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        headerInner.classList.toggle("nav-open");
      });
      headerInner.appendChild(btn);
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") headerInner.classList.remove("nav-open");
      });
    }

    if (!document.querySelector("footer.site-footer")) {
      var f = document.createElement("footer");
      f.className = "site-footer";
      f.innerHTML =
        '<div class="footer-inner">' +
          '<div class="footer-col">' +
            '<div class="footer-title">ENSOscope</div>' +
            '<p>Operational El Niño / La Niña forecasts and teleconnection maps, turning seasonal climate forecasts into regional signals for anticipatory action.</p>' +
            '<p class="footer-muted">Created by Isma Abdelkader Di Carlo (PhD), Utrecht University, in collaboration with Médecins Sans Frontières (MSF).</p>' +
          '</div>' +
          '<div class="footer-col">' +
            '<div class="footer-title">Explore</div>' +
            '<a href="index.html">Forecast</a>' +
            '<a href="map_explorer.html">Teleconnections</a>' +
            '<a href="hindcast_skill.html">Skill</a>' +
            '<a href="methodology.html">Methodology and data sources</a>' +
            '<a href="about.html">About and contact</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<div class="footer-title">Contact and code</div>' +
            '<a href="https://github.com/iadicarlo" target="_blank" rel="noopener">github.com/iadicarlo</a>' +
            '<a href="about.html">Full contact details</a>' +
            '<p class="footer-muted">All input datasets are open and cited on the Methodology page.</p>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">For research and humanitarian decision-support. Seasonal forecasts carry real uncertainty; read the Skill and Methodology pages before acting on them.</div>';
      document.body.appendChild(f);
    }
  }

  function init() { wireNavDropdowns(); injectChrome(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
