(function () {
  "use strict";

  var items = [], sb = null;
  function byNo(a, b) { return a.no < b.no ? -1 : 1; }

  /* 서버가 연결돼 있으면 서버에서, 아니면 products.js 예시에서 제품을 읽는다 */
  function load() {
    if (!sb) { items = PRODUCTS.slice().sort(byNo); return Promise.resolve(); }
    return sb.from("products").select("*").then(function (r) {
      if (r.error) throw r.error;
      items = r.data.map(function (d) {
        return { id: d.id, no: d.no, name: d.name, status: d.status, price: d.price, material: d.material, color: d.color,
          sizes: d.sizes && d.sizes.length ? d.sizes : ["OS"], dims: d.dims, desc: d.description, images: d.images || [] };
      }).sort(byNo);
    });
  }
  function connect() {
    if (typeof BACKEND === "undefined" || !BACKEND.url || !BACKEND.key) return Promise.resolve();
    return new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js";
      s.onload = function () { sb = window.supabase.createClient(BACKEND.url, BACKEND.key); resolve(); };
      s.onerror = resolve;
      document.head.appendChild(s);
    });
  }
  var main = document.getElementById("main");
  var size = null, heroNo = null, firstGrid = true;
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function find(no) { for (var i = 0; i < items.length; i++) if (items[i].no === no) return i; return -1; }
  function priceText(p) {
    if (p.status === "soldout") return "Sold out";
    if (p.status === "upcoming") return "Coming soon";
    if (p.status === "archive" || p.price == null) return "Archive";
    return "₩" + p.price.toLocaleString("en-US");
  }
  /* 마우스를 따라 기울어지는 이미지 */
  function tilt(src, alt, hero, id) {
    return '<span class="tilt"' + (hero ? ' style="view-transition-name:hero"' : "") + ">" +
      "<img" + (id ? ' id="' + id + '"' : "") + ' src="' + src + '" alt="' + esc(alt) + '">' +
      '<i class="glare" style="--src:url(\'' + src + "')\"></i></span>";
  }

  function renderGrid() {
    if (!items.length) { main.innerHTML = '<p class="empty">Coming soon</p>'; return; }
    main.innerHTML = '<div class="grid' + (firstGrid ? " enter" : "") + '">' + items.slice().reverse().map(function (p, i) {
      return '<a class="item' + (p.status === "available" ? "" : " off") + '" href="#/' + p.no + '" data-no="' + p.no + '" style="--i:' + i + '">' +
        tilt(p.images[0] || "", p.name, p.no === heroNo) +
        "<span>" + p.no + '</span><span class="sub">' + priceText(p) + "</span></a>";
    }).join("") + "</div>";
    firstGrid = false;
    document.title = SITE.name + " " + SITE.number;
  }

  function renderProduct(i) {
    var p = items[i], prev = items[i - 1], next = items[i + 1];
    var sized = p.sizes[0] !== "OS";
    size = sized ? null : "One size";
    heroNo = p.no;

    var thumbs = p.images.length > 1 ? '<div class="thumbs">' + p.images.map(function (src, n) {
      return '<button class="' + (n ? "" : "on") + '" data-img="' + src + '" aria-label="Image ' + (n + 1) + '"><img src="' + src + '" alt=""></button>';
    }).join("") + "</div>" : "";

    var sizes = sized && p.status === "available" ? '<div class="sizes">' + p.sizes.map(function (s) {
      return '<button data-size="' + esc(s) + '">' + esc(s) + "</button>";
    }).join("") + "</div>" : "";

    var order = p.status === "available"
      ? '<button class="order" id="order">' + (sized ? "Select size" : "Order") + "</button>"
      : '<span class="order off">' + priceText(p) + "</span>";

    main.innerHTML =
      '<div class="product">' +
        '<div class="product-img">' + tilt(p.images[0] || "", p.name, true, "pimg") + thumbs + "</div>" +
        '<div class="info">' +
          "<h1>" + p.no + "<br>" + esc(p.name) + "</h1>" +
          (p.price != null ? "<p>₩" + p.price.toLocaleString("en-US") + "</p>" : "") +
          '<p class="desc">' + esc(p.desc) + "</p>" +
          '<p class="mute">' + esc(p.material) + "<br>" + esc(p.color) + (p.dims ? "<br>" + esc(p.dims) : "") + "</p>" +
          sizes + order +
          '<div class="pager">' +
            (prev ? '<a href="#/' + prev.no + '">← ' + prev.no + "</a>" : "<span></span>") +
            (next ? '<a href="#/' + next.no + '">' + next.no + " →</a>" : "<span></span>") +
          "</div>" +
        "</div>" +
      "</div>";
    document.title = p.no + " " + p.name + " — " + SITE.name + " " + SITE.number;
  }

  main.addEventListener("click", function (e) {
    var item = e.target.closest(".item");
    if (item) {
      /* 누른 배지가 상품 페이지 이미지로 이어지도록 표시 */
      main.querySelectorAll(".tilt").forEach(function (t) { t.style.viewTransitionName = ""; });
      item.querySelector(".tilt").style.viewTransitionName = "hero";
      return;
    }
    var t = e.target.closest("[data-img],[data-size],#order");
    if (!t) return;
    if (t.dataset.img) {
      var img = document.getElementById("pimg");
      img.src = t.dataset.img;
      img.nextElementSibling.style.setProperty("--src", "url('" + t.dataset.img + "')");
    } else if (t.dataset.size) {
      size = t.dataset.size;
      document.getElementById("order").textContent = "Order";
    } else {
      if (!size) return;
      var p = items[find(location.hash.replace(/^#\/?/, ""))];
      location.href = "mailto:" + SITE.email +
        "?subject=" + encodeURIComponent("[" + p.no + "] Order — " + p.name) +
        "&body=" + encodeURIComponent("No. " + p.no + " — " + p.name + "\nSize: " + size + "\n\n이름:\n연락처:\n배송지:\n");
      return;
    }
    t.parentNode.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b === t); });
  });

  /* tilt: 포인터 위치에 따라 기울기와 반사광 이동 */
  var active = null;
  function release() {
    if (!active) return;
    active.classList.remove("live");
    active.style.setProperty("--rx", "0deg");
    active.style.setProperty("--ry", "0deg");
    active.style.setProperty("--s", "1");
    active = null;
  }
  main.addEventListener("pointermove", function (e) {
    if (calm || e.pointerType === "touch") return;
    var t = e.target.closest(".item, .product-img");
    t = t && t.querySelector(".tilt");
    if (t !== active) release();
    if (!t) return;
    active = t;
    var r = t.getBoundingClientRect();
    var x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    var y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    t.classList.add("live");
    t.style.setProperty("--ry", ((x - .5) * 36).toFixed(1) + "deg");
    t.style.setProperty("--rx", ((.5 - y) * 36).toFixed(1) + "deg");
    t.style.setProperty("--gx", (x * 100).toFixed(0) + "%");
    t.style.setProperty("--gy", (y * 100).toFixed(0) + "%");
    t.style.setProperty("--s", t.closest(".item") ? "1.12" : "1.03");
  });
  main.addEventListener("pointerleave", release);

  function route() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    var i = find(h);
    function draw() {
      active = null;
      if (h === "admin") Admin.render(main, { sb: sb, items: function () { return items; }, reload: load });
      else if (i < 0) renderGrid(); else renderProduct(i);
      window.scrollTo(0, 0);
    }
    if (document.startViewTransition && !calm) document.startViewTransition(draw); else draw();
  }

  /* 하단 로고 띠 */
  var logos = ["wordmark-3", "lessproduction", "mlf", "wordmark-1", "mlf-1"], band = "";
  for (var k = 0; k < 8; k++) logos.forEach(function (n) { band += '<img src="images/logos/' + n + '.png" alt="">'; });
  document.getElementById("band").innerHTML = band;

  document.getElementById("foot-mail").href = "mailto:" + SITE.email;
  document.getElementById("foot-ig").href = "https://instagram.com/" + SITE.instagram;

  window.addEventListener("hashchange", route);
  connect().then(load).catch(function () { sb = null; return load(); }).then(route);
})();
