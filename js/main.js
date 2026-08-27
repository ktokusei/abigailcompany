// Renders the deal + testimonial lists from js/data.js, and runs the
// drag-to-crop avatar in the hero. No dependencies, no build step.

(function () {
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };

  var heroBox = document.getElementById("hero-slides");
  if (heroBox && window.HERO_SLIDES && window.HERO_SLIDES.length) {
    heroBox.innerHTML = window.HERO_SLIDES.map(function (s, i) {
      return '<img class="' + (i === 0 ? "on" : "") + '" src="' + esc(s.photo) + '" alt="' + esc(s.alt || "") + '" />';
    }).join("");
    var frames = heroBox.querySelectorAll("img");
    if (frames.length > 1) {
      var at = 0;
      setInterval(function () {
        frames[at].classList.remove("on");
        at = (at + 1) % frames.length;
        frames[at].classList.add("on");
      }, window.HERO_MS || 5000);
    }
  }

  var stamp = document.getElementById("deals-updated");
  if (stamp) stamp.textContent = window.DEALS_UPDATED || "";

  var deals = document.getElementById("deals");
  if (deals && window.DEALS) {
    deals.innerHTML = window.DEALS.map(function (d) {
      var facts = (d.facts || []).map(function (f) { return "<span>" + esc(f) + "</span>"; }).join("");
      return '<article>' +
        '<div class="deal-media"><img src="' + esc(d.photo) + '" alt="' + esc(d.address) + '" loading="lazy" />' +
        '<span class="deal-role">' + esc(d.role) + '</span></div>' +
        '<div class="deal-line"><h3>' + esc(d.address) + '</h3><span class="deal-price">' + esc(d.price) + '</span></div>' +
        '<p class="deal-city">' + esc(d.city) + '</p>' +
        '<p class="deal-blurb">' + esc(d.blurb) + '</p>' +
        '<div class="deal-facts">' + facts + '</div>' +
      '</article>';
    }).join("");
  }

  var quotes = document.getElementById("testimonials");
  if (quotes && window.TESTIMONIALS) {
    quotes.innerHTML = window.TESTIMONIALS.map(function (t) {
      var mug = t.photo ? '<img src="' + esc(t.photo) + '" alt="' + esc(t.name) + '" loading="lazy" />' : "";
      var li = t.linkedin ? '<a class="quote-li" href="' + esc(t.linkedin) + '" target="_blank" rel="noopener">LinkedIn ↗</a>' : "";
      return '<figure class="quote">' +
        "<blockquote>" + esc(t.quote) + "</blockquote>" +
        '<figcaption><div class="mug">' + mug + "</div><div>" +
          '<div class="quote-name">' + esc(t.name) + "</div>" +
          '<div class="quote-title">' + esc(t.title) + "</div>" + li +
        "</div></figcaption></figure>";
    }).join("");
  }

  // ── avatar crop ──────────────────────────────────────────────
  // Drag to pan, scroll to zoom, double-click to reset. The chosen
  // framing is remembered in localStorage on this browser. To ship a
  // fixed framing to every visitor, replace DEFAULT below.
  var DEFAULT = { x: 0, y: 0, s: 1.6 };
  var KEY = "ga-avatar-crop";
  var box = document.getElementById("avatar");
  var img = document.getElementById("avatar-img");
  if (!box || !img) return;

  var crop = DEFAULT;
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && typeof saved.x === "number") crop = saved;
  } catch (e) {}

  function paint() {
    img.style.transform = "translate(-50%, -50%) translate(" + crop.x + "px, " + crop.y + "px) scale(" + crop.s + ")";
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(crop)); } catch (e) {} }
  paint();

  box.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    var px = e.clientX, py = e.clientY, ox = crop.x, oy = crop.y;
    box.style.cursor = "grabbing";
    function move(ev) { crop = { x: ox + (ev.clientX - px), y: oy + (ev.clientY - py), s: crop.s }; paint(); }
    function up() {
      box.style.cursor = "grab";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      save();
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  });

  box.addEventListener("wheel", function (e) {
    e.preventDefault();
    crop = { x: crop.x, y: crop.y, s: Math.min(5, Math.max(1, crop.s * (e.deltaY < 0 ? 1.08 : 0.926))) };
    paint(); save();
  }, { passive: false });

  box.addEventListener("dblclick", function () { crop = DEFAULT; paint(); save(); });
})();
