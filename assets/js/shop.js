/* ============================================================
   NONGSUNG BEEF — ร้านค้าออนไลน์ (sample shop) · v2
   ------------------------------------------------------------
   MINDEN, AMI A FARMTÓL MÉG HIÁNYZIK, EGY HELYEN VAN: a CONFIG
   és a PRODUCTS blokkban. Amint megjönnek a valódi árak és a
   fizetési adatok, csak ezt a két blokkot kell átírni.

   v2: a pénztár egy felcsúszó panelben van, amit egy mindig
   látható lebegő kosárgomb nyit. Az első változatban a kosár
   telefonon 3300 px-szel a termékek ALATT volt — a gomb
   működött, de a vásárló semmit nem látott belőle.
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
    currency: "฿"
  };

  /* ---------------- TERMÉKEK ----------------
     A nevek és leírások a meglévő weboldalról jönnek.
     Csak az árak mintaértékek. */

  var PRODUCTS = [
    { id: "jerky60", cat: "jerky", img: "assets/img/jerky.jpg", price: 150, badge: "best",
      th: { name: "เนื้อโคขุนอบพรีเมียม", size: "60 กรัม", unit: "กล่อง",
            desc: "เนื้อโคขุนแท้ 100% หมักและอบช้า พร้อมทาน เก็บได้นาน ของฝากระดับพรีเมียม" },
      en: { name: "Premium Beef Jerky", size: "60 g", unit: "box",
            desc: "100% Nong Sung fattened beef, marinated and slow-baked. Ready to eat, shelf-stable." } },

    { id: "jerkyCarton", cat: "jerky", img: "assets/img/market.jpg", price: 1600, badge: "bulk",
      th: { name: "เนื้ออบพรีเมียม ยกลัง", size: "12 × 60 กรัม", unit: "ลัง",
            desc: "สำหรับร้านค้าและกระเช้าของขวัญ รับผลิตแบรนด์ลูกค้า (OEM)" },
      en: { name: "Jerky carton", size: "12 × 60 g", unit: "carton",
            desc: "For shops and gift hampers. OEM / private label available." } },

    { id: "ribeye", cat: "fresh", img: "assets/img/case.jpg", price: 1200, badge: "chef",
      th: { name: "ริบอาย", size: "Ribeye", unit: "กก.",
            desc: "คัดเกรดไขมันแทรกรายซาก ตัดแต่งตามสั่ง ส่งแบบลูกโซ่ความเย็น" },
      en: { name: "Ribeye", size: "per kg", unit: "kg",
            desc: "Marbling graded per carcass, cut to order, full cold chain." } },

    { id: "striploin", cat: "fresh", img: "assets/img/trace.jpg", price: 1100,
      th: { name: "สตริปลอยน์", size: "Striploin", unit: "กก.",
            desc: "คัดเกรดไขมันแทรกรายซาก ตัดแต่งตามความต้องการ" },
      en: { name: "Striploin", size: "per kg", unit: "kg",
            desc: "Marbling graded per carcass, cut to your specification." } },

    { id: "tenderloin", cat: "fresh", img: "assets/img/award.jpg", price: 1500, badge: "chef",
      th: { name: "เทนเดอร์ลอยน์", size: "Tenderloin", unit: "กก.",
            desc: "ส่วนที่นุ่มที่สุด สำหรับร้านอาหาร โรงแรม และโอกาสพิเศษ" },
      en: { name: "Tenderloin", size: "per kg", unit: "kg",
            desc: "The most tender cut — for restaurants, hotels and special occasions." } },

    { id: "skewers", cat: "frozen", img: "assets/img/feed.jpg", price: 180,
      th: { name: "เนื้อหมักนมสดเสียบไม้", size: "320 กรัม", unit: "แพ็ก",
            desc: "หมักนมสด พร้อมย่าง สะดวกทั้งร้านค้าและที่บ้าน" },
      en: { name: "Milk-marinated skewers", size: "320 g", unit: "pack",
            desc: "Marinated in fresh milk, ready to grill." } },

    { id: "frozen500", cat: "frozen", img: "assets/img/cattle.jpg", price: 350,
      th: { name: "เนื้อโคขุนแช่แข็ง", size: "500 กรัม", unit: "แพ็ก",
            desc: "สำหรับร้านค้าและครัวเรือน แช่แข็งทันทีหลังตัดแต่ง" },
      en: { name: "Frozen beef pack", size: "500 g", unit: "pack",
            desc: "For shops and home kitchens, frozen straight after cutting." } }
  ];

  var SOON = [
    { icon: "👕", th: { name: "เสื้อยืด BLACK MUKDA", note: "รอขนาด สี และราคา" },
                  en: { name: "BLACK MUKDA T-shirt", note: "Awaiting sizes, colours, price" } },
    { icon: "🧢", th: { name: "หมวก BLACK MUKDA", note: "รอราคา" },
                  en: { name: "BLACK MUKDA cap", note: "Awaiting price" } },
    { icon: "🥤", th: { name: "แก้ว NONGSUNG", note: "รอราคา" },
                  en: { name: "NONGSUNG cup", note: "Awaiting price" } },
    { icon: "☕", th: { name: "Black Mukda Café", note: "รอเมนู ราคา และเวลาเปิด–ปิด" },
                  en: { name: "Black Mukda Café", note: "Awaiting menu, prices, hours" } }
  ];

  var SHIPPING = [
    { id: "flash",  fee: 60,  th: "Flash Express",                en: "Flash Express",           sub: { th: "1–2 วัน", en: "1–2 days" } },
    { id: "thp",    fee: 50,  th: "ไปรษณีย์ไทย EMS",               en: "Thailand Post EMS",       sub: { th: "1–3 วัน", en: "1–3 days" } },
    { id: "cold",   fee: 250, th: "ส่งแบบแช่เย็น / แช่แข็ง",        en: "Cold-chain delivery",     sub: { th: "สำหรับเนื้อสด", en: "for fresh cuts" } },
    { id: "pickup", fee: 0,   th: "รับเองที่ฟาร์ม",                en: "Pick up at the farm",     sub: { th: "อ.หนองสูง", en: "Nong Sung" } }
  ];

  var CATS = [
    { id: "all",    th: "ทั้งหมด",     en: "All" },
    { id: "jerky",  th: "เนื้ออบ",     en: "Jerky" },
    { id: "fresh",  th: "เนื้อสด",     en: "Fresh cuts" },
    { id: "frozen", th: "แช่แข็ง",     en: "Frozen" }
  ];

  /* ---------------- FELÜLET SZÖVEGEI ---------------- */

  var UI = {
    th: {
      "html.lang": "th",
      "title": "ร้านค้าออนไลน์ | NONGSUNG BEEF",
      "ribbon": "ตัวอย่างร้านค้า · ราคาที่แสดงเป็นราคาตัวอย่าง รอราคาจริงจากฟาร์ม",
      "back": "หน้าเว็บไซต์",
      "hero.eyebrow": "ร้านค้าออนไลน์",
      "hero.title1": "วากิวแท้",
      "hero.title2": "ส่งตรงจากฟาร์ม",
      "hero.lead": "Black Mukda Wagyu จากสหกรณ์การเกษตรหนองสูง มุกดาหาร — สั่งได้ตลอด 24 ชั่วโมง",
      "hero.cta": "เลือกซื้อสินค้า",
      "trust.1": "ตรวจสอบย้อนกลับได้ทุกตัว",
      "trust.2": "ส่งแบบลูกโซ่ความเย็น",
      "trust.3": "โครงการ MIND STAR",
      "trust.4": "จากสหกรณ์หนองสูง",
      "shop.eyebrow": "สินค้าของเรา",
      "shop.title": "จากฟาร์มถึงโต๊ะอาหาร",
      "badge.best": "ขายดี",
      "badge.bulk": "ราคาส่ง",
      "badge.chef": "เชฟแนะนำ",
      "example": "ราคาตัวอย่าง",
      "add": "ใส่ตะกร้า",
      "added": "ใส่ตะกร้าแล้ว ✓",
      "soon.eyebrow": "เร็วๆ นี้",
      "soon.title": "ของที่ระลึกและคาเฟ่",
      "soon.lead": "พื้นที่พร้อมแล้ว — รอแค่ข้อมูลจากฟาร์ม",
      "soon.badge": "เร็วๆ นี้",
      "fab": "ตะกร้า",
      "cart.title": "ตะกร้าสินค้า",
      "cart.empty": "ยังไม่มีสินค้าในตะกร้า",
      "cart.emptyCta": "เลือกซื้อสินค้า",
      "cart.sub": "รวมค่าสินค้า",
      "cart.ship": "ค่าจัดส่ง",
      "cart.total": "รวมทั้งหมด",
      "free": "ฟรี",
      "ship.title": "วิธีจัดส่ง",
      "form.title": "ข้อมูลผู้สั่งซื้อ",
      "form.name": "ชื่อ–นามสกุล",
      "form.phone": "เบอร์โทรศัพท์",
      "form.addr": "ที่อยู่จัดส่ง",
      "form.note": "หมายเหตุ (ถ้ามี)",
      "pay.title": "การชำระเงิน",
      "pay.body": "โอนผ่าน PromptPay QR หรือเก็บเงินปลายทาง — แจ้งรายละเอียดหลังยืนยันออเดอร์",
      "pay.missing": "ยังไม่ได้ตั้งค่า PromptPay — รอข้อมูลจากฟาร์ม",
      "send.wa": "ส่งออเดอร์ทาง WhatsApp",
      "send.line": "ส่งออเดอร์ทาง LINE",
      "send.mail": "ส่งทางอีเมล",
      "send.copy": "คัดลอกออเดอร์",
      "copied": "คัดลอกออเดอร์แล้ว ✓",
      "err.fill": "กรุณากรอกชื่อ เบอร์โทร และที่อยู่ครับ",
      "err.empty": "กรุณาเลือกสินค้าก่อนครับ",
      "order.head": "ออเดอร์ใหม่ — NONGSUNG BEEF",
      "order.items": "รายการสินค้า",
      "order.cust": "ผู้สั่งซื้อ",
      "order.note": "(ราคาในร้านยังเป็นราคาตัวอย่าง)",
      "close": "ปิด",
      "foot": "สหกรณ์การเกษตรหนองสูง จำกัด · อ.หนองสูง จ.มุกดาหาร 49160"
    },
    en: {
      "html.lang": "en",
      "title": "Online shop | NONGSUNG BEEF",
      "ribbon": "Sample shop · prices shown are examples until the farm confirms real prices",
      "back": "Website",
      "hero.eyebrow": "Online shop",
      "hero.title1": "Real wagyu,",
      "hero.title2": "straight from the farm",
      "hero.lead": "Black Mukda Wagyu from the Nong Sung Agricultural Cooperative, Mukdahan — order any time, day or night.",
      "hero.cta": "Shop now",
      "trust.1": "Traceable animal by animal",
      "trust.2": "Full cold chain",
      "trust.3": "MIND STAR programme",
      "trust.4": "From the Nong Sung cooperative",
      "shop.eyebrow": "Our products",
      "shop.title": "From the farm to the table",
      "badge.best": "Best seller",
      "badge.bulk": "Wholesale",
      "badge.chef": "Chef's pick",
      "example": "example price",
      "add": "Add to cart",
      "added": "Added to cart ✓",
      "soon.eyebrow": "Coming soon",
      "soon.title": "Merchandise & café",
      "soon.lead": "The space is ready — only the farm's details are missing",
      "soon.badge": "Soon",
      "fab": "Cart",
      "cart.title": "Your cart",
      "cart.empty": "Your cart is empty",
      "cart.emptyCta": "Shop now",
      "cart.sub": "Subtotal",
      "cart.ship": "Delivery",
      "cart.total": "Total",
      "free": "free",
      "ship.title": "Delivery",
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
      "send.mail": "Send by email",
      "send.copy": "Copy order",
      "copied": "Order copied ✓",
      "err.fill": "Please fill in your name, phone and address.",
      "err.empty": "Please choose a product first.",
      "order.head": "New order — NONGSUNG BEEF",
      "order.items": "Items",
      "order.cust": "Customer",
      "order.note": "(Shop prices are still examples.)",
      "close": "Close",
      "foot": "Nong Sung Agricultural Cooperative Ltd. · Nong Sung, Mukdahan 49160"
    }
  };

  var LANGS = [
    { code: "th", label: "ไทย",    short: "ไทย" },
    { code: "en", label: "English", short: "EN" }
  ];

  /* ---------------- ÁLLAPOT ---------------- */

  var lang = "th";
  var cart = {};
  var ship = SHIPPING[0].id;
  var filter = "all";

  function t(k) { return (UI[lang] && UI[lang][k]) || UI.th[k] || k; }
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
  function subtotal() {
    return cartIds().reduce(function (s, id) { return s + product(id).price * cart[id]; }, 0);
  }
  function count() { return cartIds().reduce(function (s, id) { return s + cart[id]; }, 0); }
  function shipFee() { var s = SHIPPING.filter(function (x) { return x.id === ship; })[0]; return s ? s.fee : 0; }

  /* ---------------- KATEGÓRIÁK ---------------- */

  function renderChips() {
    var host = $("chips");
    host.innerHTML = "";
    CATS.forEach(function (c) {
      var b = el("button", "chip" + (c.id === filter ? " is-on" : ""), c[lang]);
      b.type = "button";
      b.onclick = function () { filter = c.id; renderChips(); renderProducts(); };
      host.appendChild(b);
    });
  }

  /* ---------------- TERMÉKEK ---------------- */

  function renderProducts() {
    var host = $("grid");
    host.innerHTML = "";
    PRODUCTS.filter(function (p) { return filter === "all" || p.cat === filter; })
      .forEach(function (p, i) {
        var L = p[lang] || p.th;
        var c = el("article", "card2");
        c.style.setProperty("--i", i);
        c.innerHTML =
          '<div class="card2__media">' +
            '<img src="' + p.img + '" alt="" loading="lazy">' +
            (p.badge ? '<span class="card2__badge card2__badge--' + p.badge + '">' + t("badge." + p.badge) + "</span>" : "") +
          "</div>" +
          '<div class="card2__body">' +
            '<p class="card2__size">' + L.size + "</p>" +
            "<h3>" + L.name + "</h3>" +
            '<p class="card2__desc">' + L.desc + "</p>" +
            '<div class="card2__foot">' +
              '<div class="card2__price"><b>' + money(p.price) + "</b><span>/ " + L.unit + "</span>" +
                (CONFIG.pricesArePlaceholders ? '<em>' + t("example") + "</em>" : "") +
              "</div>" +
              '<div class="stepper"><button type="button" aria-label="−">−</button>' +
                "<output>1</output>" +
                '<button type="button" aria-label="+">+</button></div>' +
            "</div>" +
            '<button type="button" class="card2__add"><span>' + t("add") + "</span>" +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>' +
            "</button>" +
          "</div>";

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
      var L = s[lang] || s.th;
      host.appendChild(el("div", "soon2",
        '<span class="soon2__icon">' + s.icon + "</span>" +
        '<span class="soon2__badge">' + t("soon.badge") + "</span>" +
        "<b>" + L.name + "</b><small>" + L.note + "</small>"));
    });
  }

  /* ---------------- KOSÁR ---------------- */

  function updateCart() {
    var n = count();
    var fab = $("fab");
    fab.hidden = n === 0;
    $("fabCount").textContent = n;
    $("fabTotal").textContent = money(subtotal());
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
      var p = product(id), L = p[lang] || p.th;
      var r = el("div", "line");
      r.innerHTML =
        '<img src="' + p.img + '" alt="">' +
        '<div class="line__txt"><b>' + L.name + "</b><small>" + L.size + " · " + money(p.price) + " / " + L.unit + "</small></div>" +
        '<div class="stepper stepper--sm"><button type="button">−</button><output>' + cart[id] + "</output><button type=\"button\">+</button></div>" +
        '<b class="line__sum">' + money(p.price * cart[id]) + "</b>";
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
      var row = el("label", "shipopt2" + (s.id === ship ? " is-on" : ""));
      row.innerHTML =
        '<input type="radio" name="ship" value="' + s.id + '"' + (s.id === ship ? " checked" : "") + ">" +
        '<span class="shipopt2__txt"><b>' + s[lang] + "</b><small>" + s.sub[lang] + "</small></span>" +
        '<span class="shipopt2__fee">' + (s.fee ? money(s.fee) : t("free")) + "</span>";
      row.querySelector("input").onchange = function () { ship = s.id; renderShipping(); renderDrawer(); };
      host.appendChild(row);
    });
  }

  function openDrawer() {
    document.body.classList.add("is-drawer");
    $("drawer").setAttribute("aria-hidden", "false");
  }
  function closeDrawer() {
    document.body.classList.remove("is-drawer");
    $("drawer").setAttribute("aria-hidden", "true");
  }

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

  function orderText() {
    var lines = [t("order.head"), "", t("order.items") + ":"];
    cartIds().forEach(function (id) {
      var p = product(id), L = p[lang] || p.th;
      lines.push("• " + L.name + " (" + L.size + ") × " + cart[id] + " = " + money(p.price * cart[id]));
    });
    var s = SHIPPING.filter(function (x) { return x.id === ship; })[0];
    lines.push("", t("cart.sub") + ": " + money(subtotal()));
    lines.push(t("ship.title") + ": " + s[lang] + " — " + (shipFee() ? money(shipFee()) : t("free")));
    lines.push(t("cart.total") + ": " + money(subtotal() + shipFee()));
    lines.push("", t("order.cust") + ":");
    lines.push(t("form.name") + ": " + val("fName"));
    lines.push(t("form.phone") + ": " + val("fPhone"));
    lines.push(t("form.addr") + ": " + val("fAddr"));
    if (val("fNote")) lines.push(t("form.note") + ": " + val("fNote"));
    if (CONFIG.pricesArePlaceholders) lines.push("", t("order.note"));
    return lines.join("\n");
  }

  function validate() {
    if (!cartIds().length) { toast(t("err.empty")); return false; }
    var bad = ["fName", "fPhone", "fAddr"].filter(function (id) { return !val(id); });
    ["fName", "fPhone", "fAddr"].forEach(function (id) { $(id).classList.toggle("is-bad", bad.indexOf(id) > -1); });
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
      location.href = "mailto:" + CONFIG.orderEmail + "?subject=" + encodeURIComponent(t("order.head")) +
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

  /* ---------------- NYELV ---------------- */

  function applyLang(code) {
    lang = code;
    document.documentElement.lang = t("html.lang");
    document.title = t("title");
    document.querySelectorAll("[data-t]").forEach(function (e) { e.textContent = t(e.getAttribute("data-t")); });

    $("payMissing").hidden = !!CONFIG.promptPayId;
    $("ribbon").hidden = !CONFIG.pricesArePlaceholders;

    document.querySelectorAll(".lang__opt").forEach(function (b) { b.classList.toggle("is-on", b.dataset.lang === code); });
    var m = LANGS.filter(function (l) { return l.code === code; })[0];
    $("langCur").textContent = m.short;
    $("langAlt").textContent = code === "en" ? "ไทย" : "EN";

    renderChips(); renderProducts(); renderSoon(); renderShipping(); updateCart();
  }

  function buildLangSwitch() {
    var host = $("lang");
    var btn = el("button", "lang__btn");
    btn.type = "button";
    btn.innerHTML =
      '<svg class="lang__globe" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.2"/>' +
      '<path d="M1.6 8h12.8M8 1.6c1.7 1.8 2.6 4 2.6 6.4S9.7 12.6 8 14.4C6.3 12.6 5.4 10.4 5.4 8S6.3 3.4 8 1.6z" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' +
      '<span id="langCur"></span><i class="lang__sep"></i><span id="langAlt" class="lang__alt"></span>' +
      '<svg class="lang__chev" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
    var menu = el("div", "lang__menu");
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

    applyLang("th");
  });
})();
