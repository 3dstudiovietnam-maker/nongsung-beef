/* ============================================================
   NONGSUNG BEEF — ร้านค้าออนไลน์ (sample shop) · v3
   ------------------------------------------------------------
   A FARM ADATAI (ár, kép, elérhetőség) → ebben a fájlban, a
   CONFIG és a PRODUCTS blokkban.
   A SZÖVEGEK (11 nyelv) → assets/js/shop-i18n.js

   v2: lebegő kosár + felcsúszó pénztár (telefonon a kosár
       korábban 3300 px-szel a termékek alatt volt).
   v3: 11 nyelv; a rendelés MINDIG thaiul is megy a farmra,
       különben egy kínai vevő rendelését Pim nem tudná elolvasni.
   v4 (09-22): az ELSŐ VALÓDI TERMÉK Pimtől — napon szárított thai wagyu,
       80 g, 199 ฿, ingyenes szállítás egész Thaiföldön (az ő plakátjáról).
       `real:true` → nincs „mintaár" jelzés; `freeShip:true` → ha a kosárban
       csak ilyen van, a szállítás ingyenes.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- CONFIG — a farm adatai ---------------- */

  var CONFIG = {
    orderWhatsApp: "66610281908",          // +66 61 028 1908 — a weboldalon már nyilvános
    orderEmail: "nongsungbeef@gmail.com",
    orderLine: "",                          // LINE hivatalos link — MÉG NINCS MEG
    promptPayId: "",                        // PromptPay — MÉG NINCS MEG
    pricesArePlaceholders: true,            // amíg true, mindenhol ott a „mintaár" jelzés
    currency: "฿",
    farmLang: "th"                          // a rendelés ezen a nyelven is megy a farmra
  };

  /* ---------------- TERMÉKEK (a szövegük a shop-i18n.js-ben) ---------------- */

  var PRODUCTS = [
    // VALÓDI ár (Pim, 09-22). A kép helyőrző, amíg nem jön valódi zacskófotó —
    // a jerky.jpg egy MÁSIK termék (60 g-os doboz), azt ide tenni „ไม่ตรงปก" lenne.
    { id: "sunDried80",  cat: "jerky",  img: "assets/img/sundried80-v2.svg", price: 199, badge: "freeship", real: true, freeShip: true },
    { id: "jerky60",     cat: "jerky",  img: "assets/img/jerky.jpg",  price: 150,  badge: "best" },
    { id: "jerkyCarton", cat: "jerky",  img: "assets/img/market.jpg", price: 1600, badge: "bulk" },
    { id: "ribeye",      cat: "fresh",  img: "assets/img/case.jpg",   price: 1200, badge: "chef" },
    { id: "striploin",   cat: "fresh",  img: "assets/img/trace.jpg",  price: 1100 },
    { id: "tenderloin",  cat: "fresh",  img: "assets/img/award.jpg",  price: 1500, badge: "chef" },
    { id: "skewers",     cat: "frozen", img: "assets/img/feed.jpg",   price: 180 },
    { id: "frozen500",   cat: "frozen", img: "assets/img/cattle.jpg", price: 350 }
  ];

  var SOON = [
    { id: "shirt", icon: "👕" },
    { id: "cap",   icon: "🧢" },
    { id: "cup",   icon: "🥤" },
    { id: "cafe",  icon: "☕" }
  ];

  var SHIPPING = [
    { id: "flash",  fee: 60 },
    { id: "thp",    fee: 50 },
    { id: "cold",   fee: 250 },
    { id: "pickup", fee: 0 }
  ];

  var CATS = ["all", "jerky", "fresh", "frozen"];

  /* ---------------- NYELV ---------------- */

  var DICT = window.SHOP_I18N || {};
  // Csak olyan nyelvet kínálunk, amihez van szótár — félkész build ne adjon néma gombot.
  var LANGS = (window.SHOP_LANGS || []).filter(function (l) { return DICT[l.code]; });
  var STORE_KEY = "nsb.lang";   // UGYANAZ a kulcs, mint a főoldalon → a választás átjön

  function pickLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && DICT[q]) return q;
    var saved = null;
    try { saved = sessionStorage.getItem(STORE_KEY); } catch (e) {}
    if (saved && DICT[saved]) return saved;
    return "th";                              // a thai piac a cél → thaiul nyílik
  }

  /* ---------------- ÁLLAPOT ---------------- */

  var lang = "th";
  var cart = {};
  var ship = SHIPPING[0].id;
  var filter = "all";

  function tx(key, lg) {
    var L = lg || lang;
    return (DICT[L] && DICT[L][key]) || (DICT.th && DICT.th[key]) || key;
  }
  function t(k, lg) { return tx("ui." + k, lg); }
  function pt(id, field, lg) { return tx("p." + id + "." + field, lg); }

  function money(n) { return CONFIG.currency + n.toLocaleString("en-US"); }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function product(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function cartIds() { return Object.keys(cart).filter(function (k) { return cart[k] > 0; }); }
  function subtotal() { return cartIds().reduce(function (s, id) { return s + product(id).price * cart[id]; }, 0); }
  function count() { return cartIds().reduce(function (s, id) { return s + cart[id]; }, 0); }
  // Ha a kosárban csak ingyen szállított termék van, bármelyik szállítási mód ingyenes.
  function allFreeShip() {
    var ids = cartIds();
    return ids.length > 0 && ids.every(function (id) { return product(id).freeShip; });
  }
  function feeOf(s) { return allFreeShip() ? 0 : s.fee; }
  function shipFee() { var s = SHIPPING.filter(function (x) { return x.id === ship; })[0]; return s ? feeOf(s) : 0; }

  /* ---------------- KATEGÓRIÁK ---------------- */

  function renderChips() {
    var host = $("chips");
    host.innerHTML = "";
    CATS.forEach(function (c) {
      var b = el("button", "chip" + (c === filter ? " is-on" : ""));
      b.type = "button";
      b.textContent = tx("cat." + c);
      b.onclick = function () { filter = c; renderChips(); renderProducts(); };
      host.appendChild(b);
    });
  }

  /* ---------------- TERMÉKEK ---------------- */

  function renderProducts() {
    var host = $("grid");
    host.innerHTML = "";
    PRODUCTS.filter(function (p) { return filter === "all" || p.cat === filter; })
      .forEach(function (p, i) {
        var c = el("article", "card2");
        c.style.setProperty("--i", i);
        c.innerHTML =
          '<div class="card2__media">' +
            '<img src="' + p.img + '" alt="" loading="lazy">' +
            (p.badge ? '<span class="card2__badge card2__badge--' + p.badge + '"></span>' : "") +
          "</div>" +
          '<div class="card2__body">' +
            '<p class="card2__size"></p><h3></h3><p class="card2__desc"></p>' +
            '<div class="card2__foot">' +
              '<div class="card2__price"><b>' + money(p.price) + "</b><span></span>" +
                (CONFIG.pricesArePlaceholders && !p.real ? "<em></em>" : "") +
              "</div>" +
              '<div class="stepper"><button type="button" aria-label="−">−</button>' +
                "<output>1</output><button type=\"button\" aria-label=\"+\">+</button></div>" +
            "</div>" +
            '<button type="button" class="card2__add"><span></span>' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>' +
            "</button>" +
          "</div>";

        // A szövegeket textContent-tel tesszük be: a fordításban lehet bármi, nem törheti a HTML-t.
        if (p.badge) c.querySelector(".card2__badge").textContent = t("badge." + p.badge);
        c.querySelector(".card2__size").textContent = pt(p.id, "size");
        c.querySelector("h3").textContent = pt(p.id, "name");
        c.querySelector(".card2__desc").textContent = pt(p.id, "desc");
        c.querySelector(".card2__price span").textContent = "/ " + pt(p.id, "unit");
        var em = c.querySelector(".card2__price em");
        if (em) em.textContent = t("example");
        c.querySelector(".card2__add span").textContent = t("add");

        var n = 1, out = c.querySelector("output"), btns = c.querySelectorAll(".stepper button");
        btns[0].onclick = function () { if (n > 1) n--; out.textContent = n; };
        btns[1].onclick = function () { n++; out.textContent = n; };

        c.querySelector(".card2__add").onclick = function (e) {
          cart[p.id] = (cart[p.id] || 0) + n;
          n = 1; out.textContent = "1";
          updateCart();
          toast(t("added"));
          bump(e.currentTarget);
        };
        host.appendChild(c);
      });
  }

  function renderSoon() {
    var host = $("soonGrid");
    host.innerHTML = "";
    SOON.forEach(function (s) {
      var d = el("div", "soon2",
        '<span class="soon2__icon">' + s.icon + '</span><span class="soon2__badge"></span><b></b><small></small>');
      d.querySelector(".soon2__badge").textContent = t("soon.badge");
      d.querySelector("b").textContent = tx("sn." + s.id + ".name");
      d.querySelector("small").textContent = tx("sn." + s.id + ".note");
      host.appendChild(d);
    });
  }

  /* ---------------- KOSÁR ---------------- */

  function updateCart() {
    var n = count();
    $("fab").hidden = n === 0;
    $("fabCount").textContent = n;
    $("fabTotal").textContent = money(subtotal());
    renderShipping();
    renderDrawer();
  }

  function renderDrawer() {
    var host = $("cartItems");
    host.innerHTML = "";
    var ids = cartIds();

    $("cartEmpty").hidden = ids.length > 0;
    $("checkout").hidden = ids.length === 0;
    $("drawerFoot").hidden = ids.length === 0;   // üres kosárnál ne kínáljunk küldés-gombot

    ids.forEach(function (id) {
      var p = product(id);
      var r = el("div", "line",
        '<img src="' + p.img + '" alt="">' +
        '<div class="line__txt"><b></b><small></small></div>' +
        '<div class="stepper stepper--sm"><button type="button">−</button><output>' + cart[id] +
          '</output><button type="button">+</button></div>' +
        '<b class="line__sum">' + money(p.price * cart[id]) + "</b>");
      r.querySelector(".line__txt b").textContent = pt(id, "name");
      r.querySelector(".line__txt small").textContent =
        pt(id, "size") + " · " + money(p.price) + " / " + pt(id, "unit");
      var b = r.querySelectorAll(".stepper button");
      b[0].onclick = function () { cart[id]--; if (cart[id] <= 0) delete cart[id]; updateCart(); };
      b[1].onclick = function () { cart[id]++; updateCart(); };
      host.appendChild(r);
    });

    $("sumSub").textContent = money(subtotal());
    $("sumShip").textContent = shipFee() ? money(shipFee()) : t("free");
    $("sumTotal").textContent = money(subtotal() + shipFee());
  }

  function renderShipping() {
    var host = $("shipList");
    host.innerHTML = "";
    SHIPPING.forEach(function (s) {
      var row = el("label", "shipopt2" + (s.id === ship ? " is-on" : ""),
        '<input type="radio" name="ship" value="' + s.id + '"' + (s.id === ship ? " checked" : "") + ">" +
        '<span class="shipopt2__txt"><b></b><small></small></span>' +
        '<span class="shipopt2__fee"></span>');
      row.querySelector("b").textContent = tx("sh." + s.id + ".label");
      row.querySelector("small").textContent = tx("sh." + s.id + ".sub");
      row.querySelector(".shipopt2__fee").textContent = feeOf(s) ? money(feeOf(s)) : t("free");
      row.querySelector("input").onchange = function () { ship = s.id; renderShipping(); renderDrawer(); };
      host.appendChild(row);
    });
  }

  function openDrawer() { document.body.classList.add("is-drawer"); $("drawer").setAttribute("aria-hidden", "false"); }
  function closeDrawer() { document.body.classList.remove("is-drawer"); $("drawer").setAttribute("aria-hidden", "true"); }

  /* ---------------- VISSZAJELZÉS ---------------- */

  var toastTimer;
  function toast(msg) {
    var b = $("toast");
    b.textContent = msg;
    b.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { b.classList.remove("is-on"); }, 2200);
  }
  function bump(btn) {
    btn.classList.remove("is-hit"); void btn.offsetWidth; btn.classList.add("is-hit");
    var f = $("fab"); f.classList.remove("is-bump"); void f.offsetWidth; f.classList.add("is-bump");
  }

  /* ---------------- RENDELÉS ---------------- */

  function val(id) { return ($(id).value || "").trim(); }

  // Egy nyelvű rendelés-blokk. A vevő a sajátját látja, a farm a thait.
  function orderBlock(lg) {
    var lines = [t("order.head", lg), "", t("order.items", lg) + ":"];
    cartIds().forEach(function (id) {
      var p = product(id);
      lines.push("• " + pt(id, "name", lg) + " (" + pt(id, "size", lg) + ") × " + cart[id] +
                 " = " + money(p.price * cart[id]));
    });
    lines.push("", t("cart.sub", lg) + ": " + money(subtotal()));
    lines.push(t("ship.title", lg) + ": " + tx("sh." + ship + ".label", lg) + " — " +
               (shipFee() ? money(shipFee()) : t("free", lg)));
    lines.push(t("cart.total", lg) + ": " + money(subtotal() + shipFee()));
    lines.push("", t("order.cust", lg) + ":");
    lines.push(t("form.name", lg) + ": " + val("fName"));
    lines.push(t("form.phone", lg) + ": " + val("fPhone"));
    lines.push(t("form.addr", lg) + ": " + val("fAddr"));
    if (val("fNote")) lines.push(t("form.note", lg) + ": " + val("fNote"));
    if (CONFIG.pricesArePlaceholders) lines.push("", t("order.note", lg));
    return lines.join("\n");
  }

  function orderText() {
    var own = orderBlock(lang);
    if (lang === CONFIG.farmLang) return own;
    var langName = (LANGS.filter(function (l) { return l.code === lang; })[0] || {}).label || lang;
    // A farmnak szóló thai blokk: a vevő nyelvét is megmondja, hogy tudják, milyen nyelven válaszoljanak.
    return own + "\n\n━━━━━━━━━━  🇹🇭  ━━━━━━━━━━\n\n" + orderBlock(CONFIG.farmLang) +
           "\n\n(" + "ลูกค้าใช้ภาษา: " + langName + ")";
  }

  function validate() {
    if (!cartIds().length) { toast(t("err.empty")); return false; }
    var need = ["fName", "fPhone", "fAddr"];
    var bad = need.filter(function (id) { return !val(id); });
    need.forEach(function (id) { $(id).classList.toggle("is-bad", bad.indexOf(id) > -1); });
    if (bad.length) { toast(t("err.fill")); $(bad[0]).focus(); return false; }
    return true;
  }

  function initOrder() {
    $("sendWa").onclick = function () {
      if (!validate()) return;
      window.open("https://wa.me/" + CONFIG.orderWhatsApp + "?text=" + encodeURIComponent(orderText()), "_blank");
    };
    if (CONFIG.orderLine) {
      $("sendLine").onclick = function () { if (validate()) window.open(CONFIG.orderLine, "_blank"); };
    } else {
      $("sendLine").hidden = true;
    }
    $("sendMail").onclick = function () {
      if (!validate()) return;
      location.href = "mailto:" + CONFIG.orderEmail + "?subject=" + encodeURIComponent(t("order.head", CONFIG.farmLang)) +
                      "&body=" + encodeURIComponent(orderText());
    };
    $("sendCopy").onclick = function () {
      if (!validate()) return;
      var txt = orderText();
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(txt).then(function () { toast(t("copied")); }, function () { fallbackCopy(txt); });
      } else { fallbackCopy(txt); }
    };
  }

  function fallbackCopy(txt) {
    var ta = document.createElement("textarea");
    ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast(t("copied")); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------------- NYELV ALKALMAZÁSA ---------------- */

  function applyLang(code) {
    if (!DICT[code]) code = "th";
    lang = code;
    document.documentElement.lang = tx("html.lang");
    document.title = t("title");
    document.querySelectorAll("[data-t]").forEach(function (e) { e.textContent = t(e.getAttribute("data-t")); });

    $("payMissing").hidden = !!CONFIG.promptPayId;
    $("ribbon").hidden = !CONFIG.pricesArePlaceholders;

    document.querySelectorAll(".lang__opt").forEach(function (b) { b.classList.toggle("is-on", b.dataset.lang === code); });
    var m = LANGS.filter(function (l) { return l.code === code; })[0];
    if (m) $("langCur").textContent = m.short;
    var pair = code === "en" ? "th" : "en";
    var mp = LANGS.filter(function (l) { return l.code === pair; })[0];
    $("langAlt").textContent = mp ? mp.short : "";

    try { sessionStorage.setItem(STORE_KEY, code); } catch (e) {}

    renderChips(); renderProducts(); renderSoon(); renderShipping(); updateCart();
  }

  function buildLangSwitch() {
    var host = $("lang");
    var btn = el("button", "lang__btn");
    btn.type = "button";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.innerHTML =
      '<svg class="lang__globe" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.2"/>' +
      '<path d="M1.6 8h12.8M8 1.6c1.7 1.8 2.6 4 2.6 6.4S9.7 12.6 8 14.4C6.3 12.6 5.4 10.4 5.4 8S6.3 3.4 8 1.6z" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' +
      '<span id="langCur"></span><i class="lang__sep"></i><span id="langAlt" class="lang__alt"></span>' +
      '<svg class="lang__chev" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
    var menu = el("div", "lang__menu");
    menu.setAttribute("role", "listbox");
    LANGS.forEach(function (l) {
      var o = el("button", "lang__opt");
      o.type = "button"; o.dataset.lang = l.code;
      o.innerHTML = '<span class="lang__code">' + l.code + "</span><span></span>";
      o.lastChild.textContent = l.label;
      o.onclick = function () { applyLang(l.code); host.classList.remove("is-open"); };
      menu.appendChild(o);
    });
    host.append(btn, menu);
    btn.onclick = function (e) { e.stopPropagation(); host.classList.toggle("is-open"); };
    document.addEventListener("click", function (e) { if (!host.contains(e.target)) host.classList.remove("is-open"); });
  }

  /* ---------------- INDULÁS ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    buildLangSwitch();
    initOrder();
    $("fab").onclick = openDrawer;
    $("drawerClose").onclick = closeDrawer;
    $("scrim").onclick = closeDrawer;
    $("emptyCta").onclick = function () { closeDrawer(); $("shop").scrollIntoView({ behavior: "smooth" }); };
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
    applyLang(pickLang());
  });
})();
