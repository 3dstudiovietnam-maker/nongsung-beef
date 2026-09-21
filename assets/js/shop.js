/* ============================================================
   NONGSUNG BEEF — ร้านค้าออนไลน์ (sample shop)
   ------------------------------------------------------------
   MINDEN, AMI A FARMTÓL MÉG HIÁNYZIK, EGY HELYEN VAN: a CONFIG
   és a PRODUCTS blokkban. Amint megjönnek a valódi árak és a
   fizetési adatok, csak ezt a két blokkot kell átírni — a
   kosár, a szállítás és a rendelés-küldés változatlan marad.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- CONFIG — a farm adatai ---------------- */

  var CONFIG = {
    // A rendelés ide megy. Mindkettő a nyilvános weboldalról való.
    orderWhatsApp: "66610281908",          // +66 61 028 1908
    orderEmail: "nongsungbeef@gmail.com",
    orderLine: "",                          // LINE hivatalos link — MÉG NINCS MEG
    promptPayId: "",                        // PromptPay (telefonszám vagy adószám) — MÉG NINCS MEG

    // Az árak MINTAÉRTÉKEK, amíg a farm nem küldi a sajátjait.
    // Amíg ez true, a boltban mindenhol ott van a figyelmeztetés.
    pricesArePlaceholders: true,

    currency: "฿"
  };

  /* ---------------- TERMÉKEK ---------------- */
  /* A nevek és a leírások a meglévő weboldalról jönnek, tehát
     valódiak. Csak az árak mintaértékek. */

  var PRODUCTS = [
    {
      id: "jerky60",
      img: "assets/img/jerky.jpg",
      price: 150,
      tag: "export",
      th: { name: "เนื้อโคขุนอบพรีเมียม 60 ก.", unit: "ต่อกล่อง",
            desc: "ทำจากเนื้อโคขุนแท้ 100% หมักและอบช้า พร้อมทาน เก็บได้นาน" },
      en: { name: "Premium Beef Jerky 60 g", unit: "per box",
            desc: "100% Nong Sung fattened beef, marinated and slow-baked. Ready to eat, shelf-stable." }
    },
    {
      id: "jerkyCarton",
      img: "assets/img/market.jpg",
      price: 1600,
      tag: "export",
      th: { name: "เนื้ออบพรีเมียม ยกลัง (12 × 60 ก.)", unit: "ต่อลัง",
            desc: "สำหรับร้านค้าและของฝาก รับผลิตแบรนด์ลูกค้า (OEM) ได้" },
      en: { name: "Jerky carton (12 × 60 g)", unit: "per carton",
            desc: "For shops and gift sets. OEM / private label available." }
    },
    {
      id: "ribeye",
      img: "assets/img/case.jpg",
      price: 1200,
      tag: "chilled",
      th: { name: "ริบอาย (Ribeye)", unit: "ต่อกิโลกรัม",
            desc: "คัดเกรดไขมันแทรกรายซาก ตัดแต่งตามสั่ง ส่งแบบลูกโซ่ความเย็น" },
      en: { name: "Ribeye", unit: "per kg",
            desc: "Marbling graded per carcass, cut to your specification, full cold chain." }
    },
    {
      id: "striploin",
      img: "assets/img/case.jpg",
      price: 1100,
      tag: "chilled",
      th: { name: "สตริปลอยน์ (Striploin)", unit: "ต่อกิโลกรัม",
            desc: "คัดเกรดไขมันแทรกรายซาก ตัดแต่งตามสั่ง" },
      en: { name: "Striploin", unit: "per kg",
            desc: "Marbling graded per carcass, cut to your specification." }
    },
    {
      id: "tenderloin",
      img: "assets/img/case.jpg",
      price: 1500,
      tag: "chilled",
      th: { name: "เทนเดอร์ลอยน์ (Tenderloin)", unit: "ต่อกิโลกรัม",
            desc: "ส่วนที่นุ่มที่สุด สำหรับร้านอาหารและโรงแรม" },
      en: { name: "Tenderloin", unit: "per kg",
            desc: "The most tender cut — for restaurants and hotels." }
    },
    {
      id: "skewers",
      img: "assets/img/feed.jpg",
      price: 180,
      tag: "frozen",
      th: { name: "เนื้อหมักนมสดเสียบไม้ 320 ก.", unit: "ต่อแพ็ก",
            desc: "หมักนมสด พร้อมย่าง สะดวกทั้งร้านและที่บ้าน" },
      en: { name: "Milk-marinated skewers 320 g", unit: "per pack",
            desc: "Marinated in fresh milk, ready to grill." }
    },
    {
      id: "frozen500",
      img: "assets/img/cattle.jpg",
      price: 350,
      tag: "frozen",
      th: { name: "เนื้อโคขุนแช่แข็ง 500 ก.", unit: "ต่อแพ็ก",
            desc: "สำหรับร้านค้าและครัวเรือน" },
      en: { name: "Frozen beef pack 500 g", unit: "per pack",
            desc: "For shops and home kitchens." }
    }
  ];

  /* Ezek még nem eladhatók — csak megmutatjuk, hogy hol lesz a helyük.
     Így a farm látja, mit érdemes hozzáadni. */
  var SOON = [
    { th: { name: "เสื้อยืด BLACK MUKDA", note: "รอขนาด สี ราคา" },
      en: { name: "BLACK MUKDA T-shirt", note: "awaiting sizes, colours, price" } },
    { th: { name: "หมวก BLACK MUKDA", note: "รอราคา" },
      en: { name: "BLACK MUKDA cap", note: "awaiting price" } },
    { th: { name: "แก้ว NONGSUNG", note: "รอราคา" },
      en: { name: "NONGSUNG cup", note: "awaiting price" } },
    { th: { name: "เมนู Black Mukda Café", note: "รอเมนู ราคา และเวลาเปิด-ปิด" },
      en: { name: "Black Mukda Café menu", note: "awaiting menu, prices, opening hours" } }
  ];

  /* ---------------- SZÁLLÍTÁS ---------------- */

  var SHIPPING = [
    { id: "flash",  fee: 60, th: "Flash Express (1–2 วัน)", en: "Flash Express (1–2 days)" },
    { id: "thp",    fee: 50, th: "ไปรษณีย์ไทย EMS",         en: "Thailand Post EMS" },
    { id: "cold",   fee: 250, th: "ส่งแบบแช่เย็น/แช่แข็ง (เนื้อสด)", en: "Cold-chain delivery (fresh cuts)" },
    { id: "pickup", fee: 0,  th: "รับเองที่ฟาร์ม (ฟรี)",     en: "Pick up at the farm (free)" }
  ];

  /* ---------------- FELÜLET SZÖVEGEI ---------------- */

  var UI = {
    th: {
      "html.lang": "th",
      "title": "ร้านค้าออนไลน์ | NONGSUNG BEEF",
      "back": "กลับไปหน้าเว็บไซต์",
      "head.eyebrow": "สั่งซื้อออนไลน์",
      "head.title": "ร้านค้าออนไลน์ NONGSUNG BEEF",
      "head.lead": "เลือกสินค้า ใส่จำนวน แล้วส่งออเดอร์ให้เราได้เลย — ตลอด 24 ชั่วโมง",
      "demo.title": "นี่คือตัวอย่างร้านค้า",
      "demo.body": "ราคาที่แสดงเป็น<b>ราคาตัวอย่าง</b> ยังไม่ใช่ราคาจริง รอข้อมูลจากฟาร์มครับ",
      "tag.export": "พร้อมส่งออก",
      "tag.chilled": "แช่เย็น",
      "tag.frozen": "แช่แข็ง",
      "add": "ใส่ตะกร้า",
      "soon.title": "กำลังจะมา",
      "soon.lead": "พื้นที่พร้อมแล้ว รอแค่ข้อมูลจากฟาร์ม",
      "cart.title": "ตะกร้าสินค้า",
      "cart.empty": "ยังไม่มีสินค้าในตะกร้า",
      "cart.sub": "รวมค่าสินค้า",
      "cart.ship": "ค่าจัดส่ง",
      "cart.total": "รวมทั้งหมด",
      "ship.title": "วิธีจัดส่ง",
      "form.title": "ข้อมูลผู้สั่งซื้อ",
      "form.name": "ชื่อ–นามสกุล",
      "form.phone": "เบอร์โทรศัพท์",
      "form.addr": "ที่อยู่จัดส่ง",
      "form.note": "หมายเหตุ (ถ้ามี)",
      "pay.title": "การชำระเงิน",
      "pay.body": "โอนผ่าน PromptPay QR หรือเก็บเงินปลายทาง — รายละเอียดจะแจ้งหลังยืนยันออเดอร์",
      "pay.missing": "ยังไม่ได้ตั้งค่า PromptPay — รอข้อมูลจากฟาร์ม",
      "send.wa": "ส่งออเดอร์ทาง WhatsApp",
      "send.line": "ส่งออเดอร์ทาง LINE",
      "send.mail": "ส่งออเดอร์ทางอีเมล",
      "send.copy": "คัดลอกออเดอร์",
      "copied": "คัดลอกแล้ว ✓",
      "err.fill": "กรุณากรอกชื่อ เบอร์โทร และที่อยู่ครับ",
      "err.empty": "กรุณาเลือกสินค้าก่อนครับ",
      "order.head": "ออเดอร์ใหม่ — NONGSUNG BEEF",
      "order.items": "รายการสินค้า",
      "order.cust": "ผู้สั่งซื้อ",
      "foot": "ตัวอย่างร้านค้าออนไลน์ · NONGSUNG BEEF · Black Mukda Wagyu"
    },
    en: {
      "html.lang": "en",
      "title": "Online shop | NONGSUNG BEEF",
      "back": "Back to the website",
      "head.eyebrow": "Order online",
      "head.title": "NONGSUNG BEEF online shop",
      "head.lead": "Pick your products, set the quantity and send us the order — any time, day or night.",
      "demo.title": "This is a sample shop",
      "demo.body": "The prices shown are <b>examples only</b> — the real prices are still to come from the farm.",
      "tag.export": "Export ready",
      "tag.chilled": "Chilled",
      "tag.frozen": "Frozen",
      "add": "Add to cart",
      "soon.title": "Coming soon",
      "soon.lead": "The space is ready — only the farm's data is missing",
      "cart.title": "Your cart",
      "cart.empty": "Your cart is empty",
      "cart.sub": "Subtotal",
      "cart.ship": "Delivery",
      "cart.total": "Total",
      "ship.title": "Delivery method",
      "form.title": "Your details",
      "form.name": "Full name",
      "form.phone": "Phone number",
      "form.addr": "Delivery address",
      "form.note": "Note (optional)",
      "pay.title": "Payment",
      "pay.body": "PromptPay QR transfer or cash on delivery — details follow once the order is confirmed.",
      "pay.missing": "PromptPay not set up yet — awaiting the farm's details",
      "send.wa": "Send order on WhatsApp",
      "send.line": "Send order on LINE",
      "send.mail": "Send order by email",
      "send.copy": "Copy order",
      "copied": "Copied ✓",
      "err.fill": "Please fill in your name, phone and address.",
      "err.empty": "Please choose a product first.",
      "order.head": "New order — NONGSUNG BEEF",
      "order.items": "Items",
      "order.cust": "Customer",
      "foot": "Sample online shop · NONGSUNG BEEF · Black Mukda Wagyu"
    }
  };

  var LANGS = [
    { code: "th", label: "ไทย", short: "ไทย" },
    { code: "en", label: "English", short: "EN" }
  ];

  /* ---------------- ÁLLAPOT ---------------- */

  var lang = "th";                 // a thai piac a cél → thaiul nyílik
  var cart = {};                   // id -> qty
  var ship = SHIPPING[0].id;

  function t(k) { return (UI[lang] && UI[lang][k]) || UI.th[k] || k; }
  function money(n) { return CONFIG.currency + " " + n.toLocaleString("en-US"); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ---------------- RENDER ---------------- */

  function renderProducts() {
    var host = document.getElementById("grid");
    host.innerHTML = "";
    PRODUCTS.forEach(function (p) {
      var L = p[lang] || p.th;
      var c = el("article", "pcard");
      c.innerHTML =
        '<div class="pcard__media">' +
          '<img src="' + p.img + '" alt="" loading="lazy">' +
          '<span class="pcard__tag">' + t("tag." + p.tag) + "</span>" +
        "</div>" +
        '<div class="pcard__body">' +
          "<h3>" + L.name + "</h3>" +
          "<p>" + L.desc + "</p>" +
          '<div class="pcard__price">' +
            "<b>" + money(p.price) + "</b>" +
            "<span>" + L.unit + "</span>" +
            (CONFIG.pricesArePlaceholders
              ? '<i class="ph">' + (lang === "th" ? "ราคาตัวอย่าง" : "example price") + "</i>"
              : "") +
          "</div>" +
        "</div>";

      var row = el("div", "qrow");
      var minus = el("button", "qbtn", "−");
      var out = el("output", "qval", "0");
      var plus = el("button", "qbtn", "+");
      var add = el("button", "btn btn--gold btn--sm", t("add"));

      var n = 0;
      function sync() { out.textContent = String(n); }
      minus.onclick = function () { if (n > 0) n--; sync(); };
      plus.onclick = function () { n++; sync(); };
      add.onclick = function () {
        if (n === 0) n = 1;
        cart[p.id] = (cart[p.id] || 0) + n;
        n = 0; sync();
        renderCart();
        add.classList.add("is-hit");
        setTimeout(function () { add.classList.remove("is-hit"); }, 400);
      };

      row.append(minus, out, plus, add);
      c.querySelector(".pcard__body").appendChild(row);
      host.appendChild(c);
    });
  }

  function renderSoon() {
    var host = document.getElementById("soonGrid");
    host.innerHTML = "";
    SOON.forEach(function (s) {
      var L = s[lang] || s.th;
      host.appendChild(el("div", "soon",
        "<b>" + L.name + "</b><span>" + L.note + "</span>"));
    });
  }

  function renderShipping() {
    var host = document.getElementById("shipList");
    host.innerHTML = "";
    SHIPPING.forEach(function (s) {
      var id = "ship_" + s.id;
      var row = el("label", "shipopt");
      row.innerHTML =
        '<input type="radio" name="ship" id="' + id + '" value="' + s.id + '"' +
        (s.id === ship ? " checked" : "") + ">" +
        "<span>" + s[lang] + "</span>" +
        "<b>" + (s.fee ? money(s.fee) : (lang === "th" ? "ฟรี" : "free")) + "</b>";
      row.querySelector("input").onchange = function () { ship = s.id; renderCart(); };
      host.appendChild(row);
    });
  }

  function shipFee() {
    var s = SHIPPING.filter(function (x) { return x.id === ship; })[0];
    return s ? s.fee : 0;
  }

  function renderCart() {
    var host = document.getElementById("cartBody");
    var ids = Object.keys(cart).filter(function (k) { return cart[k] > 0; });
    host.innerHTML = "";

    if (!ids.length) {
      host.appendChild(el("p", "cart__empty", t("cart.empty")));
      document.getElementById("cartSums").hidden = true;
      return;
    }
    document.getElementById("cartSums").hidden = false;

    var sub = 0;
    ids.forEach(function (id) {
      var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
      var L = p[lang] || p.th;
      var line = p.price * cart[id];
      sub += line;

      var r = el("div", "citem");
      r.innerHTML =
        "<span class='citem__n'>" + L.name + "</span>" +
        "<span class='citem__q'>× " + cart[id] + "</span>" +
        "<span class='citem__p'>" + money(line) + "</span>";
      var x = el("button", "citem__x", "✕");
      x.onclick = function () { delete cart[id]; renderCart(); };
      r.appendChild(x);
      host.appendChild(r);
    });

    document.getElementById("sumSub").textContent = money(sub);
    document.getElementById("sumShip").textContent = money(shipFee());
    document.getElementById("sumTotal").textContent = money(sub + shipFee());
  }

  /* ---------------- RENDELÉS ---------------- */

  function orderText() {
    var ids = Object.keys(cart).filter(function (k) { return cart[k] > 0; });
    var sub = 0;
    var lines = [t("order.head"), "", t("order.items") + ":"];

    ids.forEach(function (id) {
      var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
      var L = p[lang] || p.th;
      var line = p.price * cart[id];
      sub += line;
      lines.push("• " + L.name + " × " + cart[id] + " = " + money(line));
    });

    var s = SHIPPING.filter(function (x) { return x.id === ship; })[0];
    lines.push("", t("cart.sub") + ": " + money(sub));
    lines.push(t("ship.title") + ": " + s[lang] + " — " + money(shipFee()));
    lines.push(t("cart.total") + ": " + money(sub + shipFee()));

    lines.push("", t("order.cust") + ":");
    lines.push(t("form.name") + ": " + val("fName"));
    lines.push(t("form.phone") + ": " + val("fPhone"));
    lines.push(t("form.addr") + ": " + val("fAddr"));
    if (val("fNote")) lines.push(t("form.note") + ": " + val("fNote"));

    if (CONFIG.pricesArePlaceholders) {
      lines.push("", lang === "th"
        ? "(ราคาในร้านยังเป็นราคาตัวอย่าง)"
        : "(Shop prices are still examples.)");
    }
    return lines.join("\n");
  }

  function val(id) { return (document.getElementById(id).value || "").trim(); }

  function validate() {
    var ids = Object.keys(cart).filter(function (k) { return cart[k] > 0; });
    if (!ids.length) { flash(t("err.empty")); return false; }
    if (!val("fName") || !val("fPhone") || !val("fAddr")) { flash(t("err.fill")); return false; }
    return true;
  }

  function flash(msg) {
    var b = document.getElementById("flash");
    b.textContent = msg;
    b.hidden = false;
    setTimeout(function () { b.hidden = true; }, 3200);
  }

  function initOrderButtons() {
    document.getElementById("sendWa").onclick = function () {
      if (!validate()) return;
      window.open("https://wa.me/" + CONFIG.orderWhatsApp +
                  "?text=" + encodeURIComponent(orderText()), "_blank");
    };

    var lineBtn = document.getElementById("sendLine");
    if (CONFIG.orderLine) {
      lineBtn.onclick = function () {
        if (!validate()) return;
        window.open(CONFIG.orderLine, "_blank");
      };
    } else {
      lineBtn.hidden = true;   // nincs LINE-link → ne kínáljunk halott gombot
    }

    document.getElementById("sendMail").onclick = function () {
      if (!validate()) return;
      location.href = "mailto:" + CONFIG.orderEmail +
        "?subject=" + encodeURIComponent(t("order.head")) +
        "&body=" + encodeURIComponent(orderText());
    };

    document.getElementById("sendCopy").onclick = function () {
      if (!validate()) return;
      var txt = orderText();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(txt).then(function () { flash(t("copied")); },
                                                function () { fallbackCopy(txt); });
      } else { fallbackCopy(txt); }
    };
  }

  function fallbackCopy(txt) {
    var ta = document.createElement("textarea");
    ta.value = txt; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); flash(t("copied")); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------------- NYELV ---------------- */

  function applyLang(code) {
    lang = code;
    document.documentElement.lang = t("html.lang");
    document.title = t("title");

    document.querySelectorAll("[data-t]").forEach(function (e) {
      e.textContent = t(e.getAttribute("data-t"));
    });
    document.querySelectorAll("[data-th]").forEach(function (e) {
      e.innerHTML = t(e.getAttribute("data-th"));
    });
    document.querySelectorAll("[data-tp]").forEach(function (e) {
      e.placeholder = t(e.getAttribute("data-tp"));
    });

    var pay = document.getElementById("payMissing");
    pay.hidden = !!CONFIG.promptPayId;

    document.querySelectorAll(".lang__opt").forEach(function (b) {
      b.classList.toggle("is-on", b.dataset.lang === code);
    });
    var cur = document.getElementById("langCur");
    var m = LANGS.filter(function (l) { return l.code === code; })[0];
    if (cur && m) cur.textContent = m.short;
    var alt = document.getElementById("langAlt");
    if (alt) alt.textContent = code === "en" ? "ไทย" : "EN";

    renderProducts(); renderSoon(); renderShipping(); renderCart();
  }

  function buildLangSwitch() {
    var host = document.getElementById("lang");
    var btn = el("button", "lang__btn");
    btn.type = "button";
    btn.innerHTML =
      '<svg class="lang__globe" viewBox="0 0 16 16" aria-hidden="true">' +
      '<circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.2"/>' +
      '<path d="M1.6 8h12.8M8 1.6c1.7 1.8 2.6 4 2.6 6.4S9.7 12.6 8 14.4C6.3 12.6 5.4 10.4 5.4 8S6.3 3.4 8 1.6z"' +
      ' fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' +
      '<span id="langCur"></span><i class="lang__sep"></i><span id="langAlt" class="lang__alt"></span>' +
      '<svg class="lang__chev" viewBox="0 0 10 6" aria-hidden="true">' +
      '<path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';

    var menu = el("div", "lang__menu");
    LANGS.forEach(function (l) {
      var o = el("button", "lang__opt");
      o.type = "button";
      o.dataset.lang = l.code;
      o.innerHTML = '<span class="lang__code">' + l.code + "</span><span></span>";
      o.lastChild.textContent = l.label;
      o.onclick = function () { applyLang(l.code); host.classList.remove("is-open"); };
      menu.appendChild(o);
    });

    host.append(btn, menu);
    btn.onclick = function (e) { e.stopPropagation(); host.classList.toggle("is-open"); };
    document.addEventListener("click", function (e) {
      if (!host.contains(e.target)) host.classList.remove("is-open");
    });
  }

  /* ---------------- INDULÁS ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    buildLangSwitch();
    initOrderButtons();
    applyLang("th");
    var y = document.getElementById("yr");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
