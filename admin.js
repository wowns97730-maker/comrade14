/* 관리자 화면: 로그인 → 제품 목록 → 등록 / 수정 / 삭제 */
window.Admin = (function () {
  "use strict";

  var STATUS = { available: "판매중", soldout: "품절", archive: "비매 (기록용)", upcoming: "발매 예정" };
  var root, app, editing = null, keep = [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function shell(html) { root.innerHTML = '<div class="admin">' + html + "</div>"; }
  function msg(text, bad) {
    var m = root.querySelector(".a-msg");
    if (m) { m.textContent = text || ""; m.classList.toggle("bad", !!bad); }
  }

  function render(el, ctx) {
    root = el; app = ctx;
    document.title = "관리자 — comrade 14";
    if (!app.sb) {
      shell("<h1>관리자</h1><p>아직 서버에 연결되지 않았습니다. 서버 연결이 끝나면 여기서 로그인하고 제품을 등록할 수 있습니다.</p>");
      return;
    }
    shell("<p>불러오는 중…</p>");
    app.sb.auth.getSession().then(function (r) {
      if (r.data && r.data.session) list(); else login();
    });
  }

  /* ---------- 로그인 ---------- */
  function login() {
    shell(
      "<h1>관리자 로그인</h1>" +
      '<form class="a-form" id="a-login">' +
        '<label>이메일<input type="email" name="email" autocomplete="username" required></label>' +
        '<label>비밀번호<input type="password" name="password" autocomplete="current-password" required></label>' +
        '<button class="a-btn">로그인</button><p class="a-msg"></p>' +
      "</form>");
    root.querySelector("#a-login").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target;
      msg("로그인 중…");
      app.sb.auth.signInWithPassword({ email: f.email.value, password: f.password.value }).then(function (r) {
        if (r.error) msg("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.", true); else list();
      });
    });
  }

  /* ---------- 목록 ---------- */
  function list() {
    var rows = app.items().slice().reverse().map(function (p) {
      return '<div class="a-row">' +
        '<img src="' + esc(p.images[0] || "") + '" alt="">' +
        "<span>" + esc(p.no) + "</span><span>" + esc(p.name) + "</span><span>" + STATUS[p.status] + "</span>" +
        "<span>" + (p.price != null ? "₩" + p.price.toLocaleString("en-US") : "—") + "</span>" +
        '<button data-edit="' + esc(p.no) + '">수정</button><button data-del="' + esc(p.no) + '">삭제</button></div>';
    }).join("");
    shell(
      '<div class="a-head"><h1>제품 관리</h1><button class="a-btn" id="a-new">+ 제품 등록</button><button id="a-out">로그아웃</button></div>' +
      '<p class="a-msg"></p>' +
      (rows || "<p>등록된 제품이 없습니다. ‘+ 제품 등록’을 눌러 첫 제품을 올려보세요.</p>"));
    root.querySelector("#a-new").onclick = function () { form(null); };
    root.querySelector("#a-out").onclick = function () { app.sb.auth.signOut().then(login); };
    root.querySelectorAll("[data-edit]").forEach(function (b) { b.onclick = function () { form(find(b.dataset.edit)); }; });
    root.querySelectorAll("[data-del]").forEach(function (b) { b.onclick = function () { remove(find(b.dataset.del)); }; });
  }
  function find(no) { return app.items().filter(function (p) { return p.no === no; })[0]; }
  function nextNo() {
    var max = 0;
    app.items().forEach(function (p) { var n = parseInt(p.no, 10); if (n > max) max = n; });
    return ("00" + (max + 1)).slice(-3);
  }

  /* ---------- 등록 / 수정 ---------- */
  function form(p) {
    editing = p;
    keep = p ? p.images.slice() : [];
    var v = p || { no: nextNo(), name: "", status: "available", price: "", sizes: ["OS"], material: "", color: "", dims: "", desc: "" };
    shell(
      "<h1>" + (p ? "제품 수정" : "제품 등록") + "</h1>" +
      '<form class="a-form" id="a-prod">' +
        '<label>번호<input name="no" value="' + esc(v.no) + '" required></label>' +
        '<label>제품명<input name="name" value="' + esc(v.name) + '" required></label>' +
        '<label>상태<select name="status">' + Object.keys(STATUS).map(function (k) {
          return '<option value="' + k + '"' + (k === v.status ? " selected" : "") + ">" + STATUS[k] + "</option>";
        }).join("") + "</select></label>" +
        '<label>가격 (원, 비매품이면 비워두기)<input name="price" type="number" min="0" step="100" value="' + esc(v.price == null ? "" : v.price) + '"></label>' +
        '<label>사이즈 (쉼표로 구분. 단일 사이즈면 OS)<input name="sizes" value="' + esc(v.sizes.join(", ")) + '"></label>' +
        '<label>소재<input name="material" value="' + esc(v.material) + '"></label>' +
        '<label>색상<input name="color" value="' + esc(v.color) + '"></label>' +
        '<label>치수 (선택)<input name="dims" value="' + esc(v.dims) + '"></label>' +
        '<label>설명<textarea name="desc" rows="4">' + esc(v.desc) + "</textarea></label>" +
        '<label>사진 (여러 장 선택 가능, 첫 장이 대표 사진)<input name="files" type="file" accept="image/*" multiple></label>' +
        '<div class="a-pics" id="a-pics"></div>' +
        '<div class="a-actions"><button class="a-btn">저장</button><button type="button" id="a-cancel">취소</button></div>' +
        '<p class="a-msg"></p>' +
      "</form>");
    pics();
    var f = root.querySelector("#a-prod");
    f.files.addEventListener("change", pics);
    root.querySelector("#a-cancel").onclick = list;
    root.querySelector("#a-pics").addEventListener("click", function (e) {
      var b = e.target.closest("[data-rm]");
      if (!b) return;
      keep.splice(+b.dataset.rm, 1);
      pics();
    });
    f.addEventListener("submit", function (e) { e.preventDefault(); save(f); });
  }

  function pics() {
    var box = root.querySelector("#a-pics"), f = root.querySelector("#a-prod");
    var html = keep.map(function (src, i) {
      return '<span><img src="' + esc(src) + '" alt=""><button type="button" data-rm="' + i + '" aria-label="사진 빼기">✕</button></span>';
    }).join("");
    Array.prototype.forEach.call(f.files.files, function (file) {
      html += '<span><img src="' + URL.createObjectURL(file) + '" alt=""><em>새 사진</em></span>';
    });
    box.innerHTML = html;
  }

  function save(f) {
    var btn = f.querySelector(".a-btn");
    var no = f.no.value.trim();
    var files = Array.prototype.slice.call(f.files.files);
    if (!keep.length && !files.length) { msg("사진을 한 장 이상 넣어주세요.", true); return; }
    btn.disabled = true;
    msg("저장 중…");

    var uploads = files.map(function (file, i) {
      var ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      var path = no.replace(/[^A-Za-z0-9_-]/g, "") + "-" + Date.now() + "-" + i + "." + ext;
      return app.sb.storage.from("products").upload(path, file, { contentType: file.type }).then(function (r) {
        if (r.error) throw r.error;
        return app.sb.storage.from("products").getPublicUrl(path).data.publicUrl;
      });
    });

    Promise.all(uploads).then(function (urls) {
      var sizes = f.sizes.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      var row = {
        no: no,
        name: f.name.value.trim(),
        status: f.status.value,
        price: f.price.value === "" ? null : parseInt(f.price.value, 10),
        sizes: sizes.length ? sizes : ["OS"],
        material: f.material.value.trim(),
        color: f.color.value.trim(),
        dims: f.dims.value.trim() || null,
        description: f.desc.value.trim(),
        images: keep.concat(urls),
      };
      var q = editing
        ? app.sb.from("products").update(row).eq("id", editing.id).select()
        : app.sb.from("products").insert(row).select();
      return q.then(function (r) {
        if (r.error) throw r.error;
        if (!r.data || !r.data.length) throw new Error("no-permission");
      });
    }).then(app.reload).then(function () {
      list();
      msg("저장했습니다.");
    }).catch(function (err) {
      btn.disabled = false;
      msg(explain(err), true);
    });
  }

  function remove(p) {
    if (!window.confirm(p.no + " " + p.name + " 제품을 삭제할까요? 되돌릴 수 없습니다.")) return;
    app.sb.from("products").delete().eq("id", p.id).select().then(function (r) {
      if (r.error || !r.data.length) { msg(explain(r.error || new Error("no-permission")), true); return; }
      var paths = p.images.map(function (u) { return u.split("/products/")[1]; }).filter(Boolean);
      if (paths.length) app.sb.storage.from("products").remove(paths);
      app.reload().then(function () { list(); msg("삭제했습니다."); });
    });
  }

  function explain(err) {
    var m = (err && err.message) || "";
    if (/duplicate|unique/i.test(m)) return "같은 번호의 제품이 이미 있습니다. 번호를 바꿔주세요.";
    if (/row-level|policy|no-permission|unauthor/i.test(m)) return "이 계정에는 등록 권한이 없습니다.";
    return "저장하지 못했습니다. (" + m + ")";
  }

  return { render: render };
})();
