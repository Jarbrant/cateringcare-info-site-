/* ==============================
   CateringCare Admin JS
   ============================== */

const W = "https://cateringcare-info-site-01.andersmenyit.workers.dev"
let T = sessionStorage.getItem("adminToken") || ""
let shopItems = []
let allCategories = []
let selectedCategories = new Set()
let publicMenus = []
let notifInterval = null

if (T) showAdmin()


/* ==============================
   AUTH
   ============================== */

async function login() {
  const pw = document.getElementById("password").value
  try {
    const r = await fetch(W + "/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw })
    })
    const d = await r.json()
    if (d.success) {
      T = d.token
      sessionStorage.setItem("adminToken", T)
      document.getElementById("loginError").style.display = "none"
      showAdmin()
    } else {
      document.getElementById("loginError").style.display = "block"
    }
  } catch (e) {
    document.getElementById("loginError").textContent = "❌ Kunde inte ansluta"
    document.getElementById("loginError").style.display = "block"
  }
}

function showAdmin() {
  document.getElementById("loginPage").style.display = "none"
  document.getElementById("adminPanel").style.display = "block"
  buildDatePicker()
  loadShopItems()
  loadPublicMenus()
  checkNotifications()
  notifInterval = setInterval(checkNotifications, 30000)
}

function logout() {
  T = ""
  sessionStorage.removeItem("adminToken")
  document.getElementById("loginPage").style.display = "block"
  document.getElementById("adminPanel").style.display = "none"
  document.getElementById("password").value = ""
  if (notifInterval) clearInterval(notifInterval)
}

function headers() {
  return { "Content-Type": "application/json", "Authorization": "Bearer " + T }
}


/* ==============================
   NAVIGATION
   ============================== */

function showSection(name) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"))
  document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"))
  document.getElementById("section-" + name).classList.add("active")
  event.target.classList.add("active")

  if (name === "orders") loadOrders()
  if (name === "stats") loadStats()
  if (name === "settings") loadSettings()
  if (name === "faq") loadFaq()
  if (name === "notifications") loadNotifications()
  if (name === "customers") loadCustomers()
}

function showStatus(msg, type) {
  const el = document.getElementById("status")
  el.textContent = msg
  el.className = type
  el.style.display = "block"
  setTimeout(() => { el.style.display = "none" }, 4000)
}


/* ==============================
   DATUMVÄLJARE
   ============================== */

function buildDatePicker() {
  const sel = document.getElementById("menuDaySelect")
  sel.innerHTML = ""
  const days = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]
  for (let i = 0; i < 8; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const ds = d.toISOString().split("T")[0]
    const opt = document.createElement("option")
    opt.value = ds
    opt.textContent = (i === 0 ? "Idag – " : "") + days[d.getDay()] + " " + ds
    sel.appendChild(opt)
  }
}


/* ==============================
   HÄMTA MENY FRÅN API
   ============================== */

async function loadMenuFromAPI() {
  const btn = document.getElementById("loadMenuBtn")
  const selectedDate = document.getElementById("menuDaySelect").value
  btn.disabled = true
  btn.textContent = "⏳ Hämtar..."

  try {
    const r = await fetch(W + "/shop/admin/load-menu", {
      method: "POST", headers: headers(),
      body: JSON.stringify({ date: selectedDate })
    })
    const d = await r.json()
    if (d.error === "unauthorized") { logout(); return }
    if (d.error) { showStatus("❌ " + d.error, "error"); return }

    shopItems = d.dishes || []

    // Merge med sparade
    try {
      const r2 = await fetch(W + "/shop/admin/get-items", { headers: headers() })
      const d2 = await r2.json()
      if (d2.items && d2.items.length > 0) {
        for (const saved of d2.items) {
          const m = shopItems.find(s => s.name.toLowerCase() === saved.name.toLowerCase())
          if (m) { m.stock = saved.stock; m.price = saved.price; m.enabled = saved.enabled; m.id = saved.id }
        }
      }
    } catch (e) {}

    buildCategoryFilters()
    renderShopItems()
    renderPublicMenuTags()
    showStatus("✅ " + shopItems.length + " rätter hämtade för " + selectedDate, "success")
  } catch (e) {
    showStatus("❌ " + e.message, "error")
  } finally {
    btn.disabled = false
    btn.textContent = "📥 Hämta meny"
  }
}


/* ==============================
   KATEGORI-FILTER
   ============================== */

function buildCategoryFilters() {
  const cats = new Set()
  for (const item of shopItems) if (item.category) cats.add(item.category)
  allCategories = [...cats]
  selectedCategories = new Set(allCategories)
  renderCategoryCheckboxes()
}

function renderCategoryCheckboxes() {
  const c = document.getElementById("menuFilterCheckboxes")
  if (!allCategories.length) {
    c.innerHTML = '<p class="muted">Hämta menyn först.</p>'
    return
  }
  let h = ""
  for (const cat of allCategories) {
    const checked = selectedCategories.has(cat)
    const count = shopItems.filter(i => i.category === cat).length
    h += `<label class="checkbox-label ${checked ? "checked" : ""}" onclick="toggleCat(this,'${escapeAttr(cat)}')">
      <span class="checkbox-mark">${checked ? "✓" : ""}</span>${escapeHtml(cat)} (${count})</label>`
  }
  h += `<button class="btn btn-sm btn-outline" onclick="selAllCats()">Alla</button>`
  h += `<button class="btn btn-sm btn-outline" onclick="deselAllCats()">Inga</button>`
  c.innerHTML = h
}

function toggleCat(el, cat) {
  if (selectedCategories.has(cat)) selectedCategories.delete(cat)
  else selectedCategories.add(cat)
  renderCategoryCheckboxes()
  renderShopItems()
}

function selAllCats() {
  selectedCategories = new Set(allCategories)
  renderCategoryCheckboxes()
  renderShopItems()
}

function deselAllCats() {
  selectedCategories.clear()
  renderCategoryCheckboxes()
  renderShopItems()
}


/* ==============================
   LADDA SPARADE ITEMS
   ============================== */

async function loadShopItems() {
  try {
    const r = await fetch(W + "/shop/admin/get-items", { headers: headers() })
    const d = await r.json()
    if (d.error === "unauthorized") { logout(); return }
    shopItems = d.items || []
    if (shopItems.length > 0) {
      buildCategoryFilters()
      renderShopItems()
    }
  } catch (e) {}
}


/* ==============================
   RENDERA MATLÅDOR
   ============================== */

function renderShopItems() {
  const el = document.getElementById("shopItemsList")
  const countEl = document.getElementById("shopItemsCount")

  if (!shopItems.length) {
    el.innerHTML = '<p class="muted center">Klicka "Hämta meny" för att börja.</p>'
    countEl.innerHTML = ""
    document.getElementById("shopSaveBar").style.display = "none"
    return
  }

  const filtered = shopItems.filter(i => selectedCategories.has(i.category))
  const activeCount = filtered.filter(i => i.enabled).length
  const stockCount = filtered.filter(i => i.enabled && i.stock > 0).length

  countEl.innerHTML = `<span class="items-count">
    Visar ${filtered.length} av ${shopItems.length} rätter · 
    ${activeCount} aktiverade · ${stockCount} live i shop
  </span>`

  if (!filtered.length) {
    el.innerHTML = '<p class="muted center">Inga rätter i valda menyer.</p>'
    document.getElementById("shopSaveBar").style.display = "block"
    return
  }

  let h = `<div class="shop-item-row header">
    <div>Rätt</div><div style="text-align:center">Pris</div>
    <div style="text-align:center">Antal</div><div style="text-align:center">Aktiv</div>
  </div>`

  for (const item of filtered) {
    const idx = shopItems.indexOf(item)
    const isActive = item.enabled && item.stock > 0
    h += `<div class="shop-item-row ${isActive ? "active-row" : ""}">
      <div class="shop-item-name">
        ${escapeHtml(item.name)}
        <small>${escapeHtml(item.category || "")}</small>
      </div>
      <div><input class="shop-input" type="number" value="${item.price || ""}" 
        placeholder="79" onchange="shopItems[${idx}].price=parseFloat(this.value)||null"></div>
      <div><input class="shop-input" type="number" value="${item.stock || 0}" 
        min="0" onchange="shopItems[${idx}].stock=parseInt(this.value)||0"></div>
      <div style="text-align:center;">
        <label class="toggle-switch">
          <input type="checkbox" ${item.enabled ? "checked" : ""} 
            onchange="shopItems[${idx}].enabled=this.checked;renderShopItems()">
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>`
  }

  el.innerHTML = h
  document.getElementById("shopSaveBar").style.display = "flex"
}


/* ==============================
   SNABBKNAPPAR
   ============================== */

function enableAllWithStock() {
  let count = 0
  for (const item of shopItems) {
    if ((item.stock || 0) > 0) { item.enabled = true; count++ }
  }
  renderShopItems()
  showStatus("✅ " + count + " rätter aktiverade!", "success")
}

function disableAll() {
  for (const item of shopItems) item.enabled = false
  renderShopItems()
  showStatus("⬜ Alla avaktiverade", "success")
}

function setAllPrice() {
  const p = prompt("Sätt pris på alla (kr):", "79")
  if (!p) return
  const price = parseFloat(p)
  if (isNaN(price)) return
  for (const item of shopItems) item.price = price
  renderShopItems()
  showStatus("💰 Pris: " + price + " kr på alla", "success")
}

function setAllStock() {
  const s = prompt("Sätt antal på alla:", "5")
  if (!s) return
  const stock = parseInt(s)
  if (isNaN(stock)) return
  for (const item of shopItems) item.stock = stock
  renderShopItems()
  showStatus("📦 Antal: " + stock + " st på alla", "success")
}


/* ==============================
   SPARA / PUBLICERA
   ============================== */

async function saveShopItems() {
  try {
    const r = await fetch(W + "/shop/admin/save-items", {
      method: "POST", headers: headers(),
      body: JSON.stringify({ items: shopItems })
    })
    const d = await r.json()
    if (d.error === "unauthorized") { logout(); return }
    if (d.error) { showStatus("❌ " + d.error, "error"); return }

    const active = shopItems.filter(i => i.enabled && i.stock > 0).length
    showStatus("🚀 Publicerat! " + active + " matlådor live i shopen", "success")
    document.getElementById("shopSaveStatus").textContent =
      "Publicerad " + new Date().toLocaleTimeString("sv-SE")
  } catch (e) {
    showStatus("❌ " + e.message, "error")
  }
}

async function clearWeek() {
  if (!confirm("Rensa alla matlådor och beställningar denna vecka?")) return
  try {
    await fetch(W + "/shop/admin/clear-week", { method: "POST", headers: headers() })
    shopItems = []
    allCategories = []
    selectedCategories.clear()
    renderCategoryCheckboxes()
    renderShopItems()
    showStatus("✅ Veckan rensad", "success")
  } catch (e) {
    showStatus("❌ " + e.message, "error")
  }
}


/* ==============================
   PUBLIKA MENYER
   ============================== */

async function loadPublicMenus() {
  try {
    const r = await fetch(W + "/shop/admin/public-menus", { headers: headers() })
    const d = await r.json()
    if (d.error === "unauthorized") return
    publicMenus = d.publicMenus || []
    renderPublicMenuTags()
  } catch (e) {}
}

function renderPublicMenuTags() {
  const el = document.getElementById("publicMenuTags")
  if (!allCategories.length) {
    el.innerHTML = '<p class="muted">Hämta menyn först under "Matlådor".</p>'
    return
  }
  let h = ""
  for (const cat of allCategories) {
    const isPublic = publicMenus.includes(cat)
    h += `<div class="public-tag ${isPublic ? "active" : ""}" 
      onclick="togglePublicMenu('${escapeAttr(cat)}')">
      ${isPublic ? "👁️" : "🔒"} ${escapeHtml(cat)}</div>`
  }
  if (!publicMenus.length) {
    h += `<p style="font-size:12px;color:#999;margin-left:8px;">⚠️ Inga valda = alla visas</p>`
  }
  el.innerHTML = h
}

function togglePublicMenu(cat) {
  const idx = publicMenus.indexOf(cat)
  if (idx >= 0) publicMenus.splice(idx, 1)
  else publicMenus.push(cat)
  renderPublicMenuTags()
}


/* ==============================
   INSTÄLLNINGAR
   ============================== */

async function loadSettings() {
  try {
    const r = await fetch(W + "/shop/admin/settings", { headers: headers() })
    const d = await r.json()
    if (d.error === "unauthorized") { logout(); return }
    const s = d.settings || {}
    document.getElementById("setDefaultPrice").value = s.defaultPrice || 79
    document.getElementById("setSwishNumber").value = s.swishNumber || ""
    document.getElementById("setSwishMessage").value = s.swishMessage || "CateringCare Matlåda"
    document.getElementById("setAddress").value = s.pickupAddress || "Ekelundsvägen 18, 171 73 Solna"
    document.getElementById("setPickupStart").value = s.pickupHoursStart || "11:00"
    document.getElementById("setPickupEnd").value = s.pickupHoursEnd || "15:00"
    document.getElementById("setDiscountPercent").value = s.discountPercent || 30
    document.getElementById("setDiscountDay").value = s.discountDay || 5
    document.getElementById("setDiscountHour").value = s.discountStartHour || 13
    document.getElementById("setDiscountMinute").value = s.discountStartMinute || 0
  } catch (e) {}
}

async function saveAllSettings() {
  try {
    const body = {
      defaultPrice: parseFloat(document.getElementById("setDefaultPrice").value) || 79,
      swishNumber: document.getElementById("setSwishNumber").value.trim(),
      swishMessage: document.getElementById("setSwishMessage").value.trim(),
      pickupAddress: document.getElementById("setAddress").value.trim(),
      pickupHoursStart: document.getElementById("setPickupStart").value,
      pickupHoursEnd: document.getElementById("setPickupEnd").value,
      discountPercent: parseInt(document.getElementById("setDiscountPercent").value) || 30,
      discountDay: parseInt(document.getElementById("setDiscountDay").value) || 5,
      discountStartHour: parseInt(document.getElementById("setDiscountHour").value) || 13,
      discountStartMinute: parseInt(document.getElementById("setDiscountMinute").value) || 0,
      openDays: [3, 4, 5]
    }
    await fetch(W + "/shop/admin/settings", {
      method: "POST", headers: headers(), body: JSON.stringify(body)
    })
    await fetch(W + "/shop/admin/public-menus", {
      method: "POST", headers: headers(), body: JSON.stringify({ publicMenus })
    })
    showStatus("✅ Alla inställningar sparade!", "success")
  } catch (e) {
    showStatus("❌ " + e.message, "error")
  }
}


/* ==============================
   BESTÄLLNINGAR
   ============================== */

async function loadOrders() {
  try {
    const r = await fetch(W + "/shop/admin/orders", { headers: headers() })
    const d = await r.json()
    if (d.error === "unauthorized") { logout(); return }

    const orders = d.orders || []
    const el = document.getElementById("ordersList")

    document.getElementById("orderCountTotal").textContent = orders.length
    document.getElementById("orderCountPending").textContent =
      orders.filter(o => o.status === "pending").length
    document.getElementById("orderRevenue").textContent =
      orders.filter(o => o.status === "paid" || o.status === "picked_up")
        .reduce((s, o) => s + o.totalPrice, 0) + " kr"

    if (!orders.length) {
      el.innerHTML = '<p class="muted center">Inga beställningar</p>'
      return
    }

    const priority = { pending: 0, paid: 1, picked_up: 2, cancelled: 3 }
    const sorted = [...orders].sort((a, b) => (priority[a.status] || 9) - (priority[b.status] || 9))

    const statusText = {
      pending: "⏳ Inväntar", paid: "✅ Betalad",
      picked_up: "📦 Hämtad", cancelled: "❌ Avbruten"
    }

    let h = ""
    for (const o of sorted) {
      const items = o.items.map(i => i.quantity + "× " + escapeHtml(i.name)).join(", ")
      h += `<div class="order-card ${o.status}">
        <div class="order-header">
          <span class="order-id">${o.id}</span>
          <span class="order-status ${o.status}">${statusText[o.status] || o.status}</span>
        </div>
        <div class="order-customer">
          👤 ${escapeHtml(o.customerName)} · 📱 ${escapeHtml(o.customerPhone)}
          ${o.customerEmail ? " · 📧 " + escapeHtml(o.customerEmail) : ""}
          · 📅 ${o.pickupDay} kl ${o.pickupTime}
        </div>
        <div class="order-items">📦 ${items}</div>
        <div class="order-total">
          ${o.totalPrice} kr
          ${o.emailSent ? " · 📧 Kvitto skickat" : ""}
          ${o.discountActive ? " (–" + o.discountPercent + "%)" : ""}
        </div>
        <div class="order-actions">
          ${o.status === "pending" ? `
            <button class="btn btn-sm" onclick="markOrder('${o.id}','paid')">✅ Betalad</button>
            <button class="btn btn-sm btn-red" onclick="markOrder('${o.id}','cancelled')">❌ Avbryt</button>
          ` : ""}
          ${o.status === "paid" ? `
            <button class="btn btn-sm btn-blue" onclick="markOrder('${o.id}','picked_up')">📦 Hämtad</button>
          ` : ""}
        </div>
        <div style="font-size:12px;color:#999;margin-top:6px;">
          ${new Date(o.createdAt).toLocaleString("sv-SE")}
        </div>
      </div>`
    }
    el.innerHTML = h
  } catch (e) {
    showStatus("❌ " + e.message, "error")
  }
}

async function markOrder(id, status) {
  const labels = { paid: "betalad", picked_up: "hämtad", cancelled: "avbruten" }
  if (!confirm("Markera som " + labels[status] + "?")) return
  try {
    await fetch(W + "/shop/admin/mark-paid", {
      method: "POST", headers: headers(),
      body: JSON.stringify({ orderId: id, status })
    })
    showStatus("✅ Uppdaterad", "success")
    loadOrders()
    loadShopItems()
  } catch (e) {
    showStatus("❌ " + e.message, "error")
  }
}


/* ==============================
   KUNDER
   ============================== */

async function loadCustomers() {
  try {
    const r = await fetch(W + "/shop/admin/customers", { headers: headers() })
    const d = await r.json()
    if (d.error === "unauthorized") { logout(); return }

    const customers = d.customers || []
    document.getElementById("customerCount").innerHTML =
      `<span class="items-count">👥 ${customers.length} kunder</span>`

    if (!customers.length) {
      document.getElementById("customerList").innerHTML = '<p class="muted">Inga kunder ännu.</p>'
      return
    }

    let h = `<div class="customer-row header">
      <div>E-post</div><div>Namn</div><div>Beställn.</div><div>Totalt</div><div>Senast</div>
    </div>`
    for (const c of customers) {
      h += `<div class="customer-row">
        <div>${escapeHtml(c.email)}</div>
        <div>${escapeHtml(c.name)}</div>
        <div>${c.orderCount}</div>
        <div>${c.totalSpent} kr</div>
        <div style="font-size:12px;color:#999;">
          ${new Date(c.lastOrder).toLocaleDateString("sv-SE")}
        </div>
      </div>`
    }
    document.getElementById("customerList").innerHTML = h
  } catch (e) {
    showStatus("❌ " + e.message, "error")
  }
}

function exportCustomers() {
  window.open(W + "/shop/admin/customers/export?token=" + T, "_blank")
}


/* ==============================
   NOTISER
   ============================== */

async function checkNotifications() {
  try {
    const r = await fetch(W + "/shop/admin/notifications", { headers: headers() })
    const d = await r.json()
    if (d.error === "unauthorized") return

    const dot = document.getElementById("notifDot")
    if (d.unseen > 0) {
      dot.textContent = d.unseen
      dot.classList.add("active")
      document.title = "(" + d.unseen + ") Admin"
    } else {
      dot.classList.remove("active")
      document.title = "CateringCare Admin"
    }
  } catch (e) {}
}

async function loadNotifications() {
  try {
    const r = await fetch(W + "/shop/admin/notifications", { headers: headers() })
    const d = await r.json()
    if (d.error === "unauthorized") { logout(); return }

    const el = document.getElementById("notifList")
    const notifs = d.notifications || []

    if (!notifs.length) {
      el.innerHTML = '<p class="muted center">Inga notiser</p>'
      return
    }

    let h = ""
    for (const n of notifs.slice(0, 30)) {
      h += `<div class="notif-item ${n.seen ? "" : "unseen"}">
        <div class="notif-icon">🛒</div>
        <div class="notif-text">
          <strong>${escapeHtml(n.orderId || "")} – ${escapeHtml(n.customerName || "")}</strong>
          ${n.customerEmail ? " · " + escapeHtml(n.customerEmail) : ""}
          <br><small>${getTimeAgo(n.time)}</small>
        </div>
        <div class="notif-amount">${n.totalPrice || 0} kr</div>
      </div>`
    }
    el.innerHTML = h
    document.getElementById("notifDot").classList.remove("active")
    document.title = "CateringCare Admin"
  } catch (e) {}
}


/* ==============================
   FAQ
   ============================== */

async function loadFaq() {
  try {
    const r = await fetch(W + "/admin/get", { headers: headers() })
    const d = await r.json()
    if (d.error === "unauthorized") { logout(); return }
    document.getElementById("faq").value = d.faq || ""
    showStatus("✅ FAQ laddad", "success")
  } catch (e) {
    showStatus("❌ " + e.message, "error")
  }
}

async function saveFaq() {
  const text = document.getElementById("faq").value
  try {
    await fetch(W + "/admin/save", {
      method: "POST", headers: headers(),
      body: JSON.stringify({ text })
    })
    showStatus("✅ FAQ sparad!", "success")
  } catch (e) {
    showStatus("❌ " + e.message, "error")
  }
}


/* ==============================
   STATISTIK
   ============================== */

async function loadStats() {
  try {
    const r = await fetch(W + "/admin/stats", { headers: headers() })
    const d = await r.json()
    if (d.error === "unauthorized") { logout(); return }

    document.getElementById("statTotal").textContent = d.total || 0
    document.getElementById("statToday").textContent = d.today || 0

    const activeDays = d.daily ? d.daily.filter(x => x.count > 0).length || 1 : 1
    const totalPeriod = d.daily ? d.daily.reduce((s, x) => s + x.count, 0) : 0
    document.getElementById("statAvg").textContent =
      Math.round((totalPeriod / Math.max(activeDays, 1)) * 10) / 10

    // Chart
    const ch = document.getElementById("chartContainer")
    ch.innerHTML = ""
    if (d.daily && d.daily.length > 0) {
      const mx = Math.max(...d.daily.map(x => x.count), 1)
      ;[...d.daily].reverse().forEach(day => {
        const h = Math.max((day.count / mx) * 110, day.count > 0 ? 4 : 1)
        const b = document.createElement("div")
        b.className = "chart-bar"
        b.style.height = h + "px"
        b.style.background = day.count > 0 ? "#2f7d59" : "#e0e0e0"
        b.innerHTML = '<div class="chart-tooltip">' + day.date + ": " + day.count + "</div>"
        ch.appendChild(b)
      })
    }

    // Recent
    const tb = document.getElementById("recentBody")
    tb.innerHTML = ""
    if (d.recent && d.recent.length > 0) {
      d.recent.slice(0, 20).forEach(q => {
        const tr = document.createElement("tr")
        tr.innerHTML = "<td>" + escapeHtml(q.question) + "</td>" +
          "<td class='time-ago'>" + getTimeAgo(q.time) + "</td>"
        tb.appendChild(tr)
      })
    } else {
      tb.innerHTML = '<tr><td colspan="2" class="muted center">Inga frågor</td></tr>'
    }
  } catch (e) {
    console.error(e)
  }
}


/* ==============================
   HJÄLPFUNKTIONER
   ============================== */

function getTimeAgo(ds) {
  const now = new Date(), then = new Date(ds)
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return "Just nu"
  if (diff < 3600) return Math.floor(diff / 60) + " min sedan"
  if (diff < 86400) return Math.floor(diff / 3600) + " tim sedan"
  return Math.floor(diff / 86400) + " dagar sedan"
}

function escapeHtml(t) {
  const d = document.createElement("div")
  d.textContent = t || ""
  return d.innerHTML
}

function escapeAttr(t) {
  return (t || "").replace(/'/g, "\\'").replace(/"/g, "&quot;")
}
