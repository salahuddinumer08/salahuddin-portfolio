// Small progressive enhancements. The site works fully without this file.
(function () {
  var root = document.documentElement;

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  // Copy email address
  var copyBtn = document.querySelector("[data-copy]");
  var status = document.querySelector(".copy-status");
  if (copyBtn && navigator.clipboard) {
    copyBtn.hidden = false;
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(copyBtn.getAttribute("data-copy")).then(function () {
        if (status) status.textContent = "Email address copied.";
      }, function () {
        if (status) status.textContent = "Couldn't copy. The address is " + copyBtn.getAttribute("data-copy") + ".";
      });
    });
  }

  // Light/dark theme switch (remembers choice where storage is available)
  var themeBtn = document.querySelector(".theme-toggle");
  function current() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function label() { if (themeBtn) themeBtn.textContent = current() === "dark" ? "Switch to light theme" : "Switch to dark theme"; }
  if (themeBtn) {
    themeBtn.hidden = false;
    label();
    themeBtn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
  }
})();

// Chart hover tooltips (progressive enhancement; native <title> tooltips and table views work without JS)
(function () {
  document.querySelectorAll(".chart-plot").forEach(function (plot) {
    var tip = plot.querySelector(".chart-tip"), svg = plot.querySelector("svg"), cross = plot.querySelector(".c-cross");
    if (!tip || !svg) return;
    plot.querySelectorAll(".c-hit").forEach(function (hit) {
      var t = hit.querySelector("title"); if (t) t.remove(); // avoid a duplicate native tooltip; data is in the table view
      hit.addEventListener("mouseenter", function () {
        var box = hit.getBoundingClientRect(), pb = plot.getBoundingClientRect();
        tip.textContent = hit.getAttribute("data-tip");
        tip.style.left = (box.left - pb.left + box.width / 2) + "px";
        tip.hidden = false;
        if (cross) { var vb = svg.viewBox.baseVal, x = +hit.getAttribute("x") + (+hit.getAttribute("width")) / 2; cross.setAttribute("x1", x); cross.setAttribute("x2", x); cross.style.opacity = 1; void vb; }
      });
      hit.addEventListener("mouseleave", function () { tip.hidden = true; if (cross) cross.style.opacity = 0; });
    });
  });
})();
