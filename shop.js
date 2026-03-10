/* ==============================
   CateringCare Shop v2
   ============================== */

const W = "https://cateringcare-info-site-01.andersmenyit.workers.dev"
let shopData = null
let cart = []
let activeCategory = "all"
let appliedCoupon = null

// Allergen-mappning
const ALLERGEN_MAP = {
  "mjölk":    { emoji:"🥛", label:"Mjölk", css:"dairy" },
  "milk":     { emoji:"🥛", label:"Mjölk", css:"dairy" },
  "laktos":   { emoji:"🥛", label:"Laktos", css:"dairy" },
  "grädde":   { emoji:"🥛", label:"Grädde", css:"dairy" },
  "vispgrädde":{ emoji:"🥛", label:"Grädde", css:"dairy" },
  "ost":      { emoji:"🧀", label:"Ost", css:"dairy" },
  "smör":     { emoji:"🧈", label:"Smör", css:"dairy" },
  "gluten":   { emoji:"🌾", label:"Gluten", css:"gluten" },
  "vete":     { emoji:"🌾", label:"Vete", css:"gluten" },
  "vetemjöl": { emoji:"🌾", label:"Vete", css:"gluten" },
  "råg":      { emoji:"🌾", label:"Råg", css:"gluten" },
  "korn":     { emoji:"🌾", label:"Korn", css:"gluten" },
  "nötter":   { emoji:"🥜", label:"Nötter", css:"nuts" },
  "mandel":   { emoji:"🥜", label:"Mandel", css:"nuts" },
  "jordnöt":  { emoji:"🥜", label:"Jordnöt", css:"nuts" },
  "fisk":     { emoji:"🐟", label:"Fisk", css:"fish" },
  "räkor":    { emoji:"🦐", label:"Räkor", css:"fish" },
  "skaldjur": { emoji:"🦐", label:"Skaldjur", css:"fish" },
  "ägg":      { emoji:"🥚", label:"Ägg", css:"egg" },
  "soja":     { emoji:"🫘", label:"Soja", css:"soy" },
  "selleri":  { emoji:"🥬", label:"Selleri", css:"" },
  "senap":    { emoji:"🟡", label:"Senap", css:"" }
}

// Kategori-ikoner
const CATEGORY_ICONS = {
  "sallad": "🥗", "sallads": "🥗",
  "soppa": "🍲", "sopp": "🍲",
  "meny": "🍽️", "lunch": "🍽️",
  "middag": "🥩", "kött": "🥩",
  "fisk": "🐟", "vegetarisk": "🥬", "vegan": "🌱",
  "önskemål": "⭐", "special": "⭐",
  "dessert": "🍰", "frukost": "🥐"
}

loadShop()


/* ==============================
   LADDA BUTIK
   ============================== */

async function loadShop(){
  try {
    const r = await fetch(W + "/shop/items")
    shopData = await r.json()
    renderShop()
  } catch(e){
    document.getElementById("productsArea").innerHTML =
      '<div class="empty-state"><div class="icon">😕</div><h2>Kunde inte ladda</h2><p>Försök igen om en stund.</p></div>'
  }
}

function renderShop(){
  document.getElementById("infoAddress").textContent = shopData.pickupAddress || "–"
  document.getElementById("infoHours").textContent =
    (shopData.pickupHoursStart||"11:00") + "–" + (shopData.pickupHoursEnd||"15:00") + " (ons–fre)"

  buildPickupTimes()
  buildPickupDays()

  if(shopData.discountActive){
    const db = document.getElementById("discountBanner")
    db.textContent = "🔥 RABATT! –" + shopData.discountPercent + "% på alla matlådor just nu!"
    db.style.display = "block"
  }

  if(!shopData.items || shopData.items.length === 0){
    document.getElementById("productsArea").innerHTML = `
      <div class="empty-state"><div class="icon">🍱</div>
      <h2>Inga matlådor just nu</h2>
      <p>Vi uppdaterar sortimentet varje vecka. Kom tillbaka snart!</p></div>`
    document.getElementById("categoryTabs").innerHTML = ""
    document.getElementById("itemsInfo").innerHTML = ""
    return
  }

  buildCategoryTabs()
  renderProducts()
}


/* ==============================
   KATEGORI-TABS
   ============================== */

function buildCategoryTabs(){
  const cats = [...new Set(shopData.items.map(i => i.category || "Matlåda"))]
  const el = document.getElementById("categoryTabs")
  if(cats.length <= 1){ el.innerHTML = ""; return }
  let h = `<div class="cat-tab active" onclick="setCat('all',this)">Alla</div>`
  for(const cat of cats){
    h += `<div class="cat-tab" onclick="setCat('${escapeAttr(cat)}',this)">${escapeHtml(cat)}</div>`
  }
  el.innerHTML = h
}

function setCat(cat, el){
  activeCategory = cat
  document.querySelectorAll(".cat-tab").forEach(t => t.classList.remove("active"))
  if(el) el.classList.add("active")
  renderProducts()
}


/* ==============================
   RENDERA PRODUKTER
   ============================== */

function renderProducts(){
  const area = document.getElementById("productsArea")
  const search = (document.getElementById("searchInput").value || "").toLowerCase().trim()
  let items = shopData.items

  if(activeCategory !== "all") items = items.filter(i => (i.category||"Matlåda") === activeCategory)
  if(search) items = items.filter(i =>
    i.name.toLowerCase().includes(search) ||
    (i.ingredients||"").toLowerCase().includes(search) ||
    (i.description||"").toLowerCase().includes(search) ||
    (i.category||"").toLowerCase().includes(search))

  document.getElementById("itemsInfo").textContent = items.length > 0 ? items.length + " matlådor tillgängliga" : ""

  if(items.length === 0){
    area.innerHTML = `<div class="empty-state"><div class="icon">🔍</div><h2>Inga träffar</h2><p>Prova ett annat sökord.</p></div>`
    return
  }

  let html = '<div class="products-grid">'
  for(const item of items){
    const lowStock = item.stock <= 3
    const inCart = cart.find(c => c.id === item.id)
    const catKey = getCatKey(item.category)
    const catIcon = getCategoryIcon(item.category, item.name)
    const allergens = detectAllergens(item.ingredients || "")
    const ing = item.ingredients || item.description || ""

    // Image or placeholder
    const imageHtml = item.imageUrl
      ? `<img class="product-image" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}"
          onerror="this.outerHTML='<div class=\\'product-image-placeholder cat-${catKey}\\'>${catIcon}</div>'">`
      : `<div class="product-image-placeholder cat-${catKey}">${catIcon}</div>`

    const btnClass = inCart ? "add-btn in-cart" : "add-btn"
    const btnText = inCart ? `✓ ${inCart.quantity} st` : "+ Köp"

    // Allergen tags (max 4)
    let allergenHtml = ""
    if(allergens.length > 0){
      allergenHtml = '<div class="allergen-tags">'
      for(const a of allergens.slice(0,4)){
        allergenHtml += `<span class="allergen-tag ${a.css}">${a.emoji} ${a.label}</span>`
      }
      if(allergens.length > 4) allergenHtml += `<span class="allergen-tag">+${allergens.length-4}</span>`
      allergenHtml += '</div>'
    }

    html += `
      <div class="product-card" data-cat="${catKey}" onclick="openDetail('${item.id}')" style="animation-delay:${Math.random()*0.3}s;">
        ${imageHtml}
        ${item.discountActive ? `<div class="discount-badge">–${item.discountPercent}%</div>` : ""}
        <div class="stock-badge ${lowStock?"low":""}">${lowStock?"⚠️ "+item.stock+" kvar":item.stock+" st"}</div>
        <div class="product-body">
          <div class="product-category">${escapeHtml(item.category||"")}</div>
          <div class="product-name">${escapeHtml(item.name)}</div>
          ${ing ? `<div class="product-ingredients-preview">${escapeHtml(ing)}</div>
            <div class="product-show-more" onclick="event.stopPropagation();openDetail('${item.id}')">Visa mer ▸</div>` : ""}
          ${allergenHtml}
          <div class="product-footer">
            <div class="product-price">
              ${item.discountActive ? `<span class="original">${item.price} kr</span>` : ""}
              ${item.finalPrice} kr
            </div>
            <button class="${btnClass}" onclick="event.stopPropagation();addToCart('${item.id}')">${btnText}</button>
          </div>
        </div>
      </div>`
  }
  html += '</div>'
  area.innerHTML = html
}

function filterProducts(){ renderProducts() }


/* ==============================
   ALLERGEN DETECTION
   ============================== */

function detectAllergens(text){
  if(!text) return []
  const lower = text.toLowerCase()
  const found = new Map()
  for(const [keyword, info] of Object.entries(ALLERGEN_MAP)){
    if(lower.includes(keyword) && !found.has(info.label)){
      found.set(info.label, info)
    }
  }
  return [...found.values()]
}


/* ==============================
   CATEGORY HELPERS
   ============================== */

function getCatKey(category){
  if(!category) return "default"
  const c = category.toLowerCase()
  if(c.includes("sallad")) return "sallad"
  if(c.includes("sopp")) return "soppa"
  if(c.includes("middag")) return "middag"
  if(c.includes("fisk")) return "fisk"
  if(c.includes("veget")) return "vegetarisk"
  if(c.includes("meny") || c.includes("lunch")) return "meny"
  if(c.includes("önske")) return "meny"
  return "default"
}

function getCategoryIcon(category, name){
  if(!category && !name) return "🍱"
  const text = ((category||"") + " " + (name||"")).toLowerCase()
  for(const [key, icon] of Object.entries(CATEGORY_ICONS)){
    if(text.includes(key)) return icon
  }
  return "🍱"
}


/* ==============================
   DETAIL MODAL (EXPANDED CARD)
   ============================== */

function openDetail(id){
  const item = shopData.items.find(i => i.id === id)
  if(!item) return

  const catKey = getCatKey(item.category)
  const catIcon = getCategoryIcon(item.category, item.name)
  const allergens = detectAllergens(item.ingredients || "")
  const inCart = cart.find(c => c.id === id)

  const headerBg = item.imageUrl
    ? `background-image:url('${item.imageUrl}');background-size:cover;background-position:center;`
    : ""
  const headerClass = item.imageUrl ? "" : `cat-${catKey}`

  let allergenHtml = ""
  if(allergens.length > 0){
    allergenHtml = '<div class="detail-allergens">'
    for(const a of allergens){
      allergenHtml += `<span class="allergen-tag ${a.css}" style="font-size:12px;padding:4px 10px;">${a.emoji} ${a.label}</span>`
    }
    allergenHtml += '</div>'
  }

  const el = document.getElementById("detailModal")
  el.innerHTML = `
    <div class="detail-header product-image-placeholder ${headerClass}" style="${headerBg}">
      ${!item.imageUrl ? catIcon : ""}
      <button class="detail-close" onclick="closeDetail()">✕</button>
      ${item.discountActive ? `<div class="discount-badge" style="position:absolute;top:12px;left:12px;">–${item.discountPercent}%</div>` : ""}
    </div>
    <div class="detail-body">
      <div class="detail-category">${escapeHtml(item.category||"Matlåda")}</div>
      <div class="detail-name">${escapeHtml(item.name)}</div>

      ${item.description ? `<div class="detail-section"><h4>📝 Beskrivning</h4><p>${escapeHtml(item.description)}</p></div>` : ""}

      ${item.ingredients ? `<div class="detail-section"><h4>🥕 Innehåll</h4><p>${escapeHtml(item.ingredients)}</p></div>` : ""}

      ${allergens.length > 0 ? `<div class="detail-section"><h4>⚠️ Allergener</h4>${allergenHtml}</div>` : ""}

      <div class="detail-section">
        <h4>📦 Tillgänglighet</h4>
        <p>${item.stock} st kvar ${item.stock <= 3 ? "⚠️ Få kvar!" : ""}</p>
      </div>

      <div class="detail-price-row">
        <div class="detail-price">
          ${item.discountActive ? `<span class="original">${item.price} kr</span>` : ""}
          ${item.finalPrice} kr
        </div>
        <button class="detail-add-btn" onclick="addToCart('${item.id}');closeDetail();">
          ${inCart ? "✓ Lägg till fler" : "🛒 Lägg i kundvagn"}
        </button>
      </div>
    </div>
  `

  document.getElementById("detailOverlay").classList.add("active")
}

function closeDetail(){
  document.getElementById("detailOverlay").classList.remove("active")
}


/* ==============================
   KUNDVAGN
   ============================== */

function addToCart(id){
  const item = shopData.items.find(i => i.id === id)
  if(!item) return
  const existing = cart.find(c => c.id === id)
  if(existing){
    if(existing.quantity >= item.stock){ alert("Max "+item.stock+" st!"); return }
    existing.quantity++
  } else {
    cart.push({ id:item.id, name:item.name, price:item.finalPrice, quantity:1 })
  }
  updateCartUI()
  renderProducts()

  // Pop animation
  const floatEl = document.getElementById("cartFloat")
  floatEl.classList.remove("cart-pop")
  void floatEl.offsetWidth
  floatEl.classList.add("cart-pop")
}

function removeFromCart(id){
  cart = cart.filter(c => c.id !== id)
  updateCartUI(); renderCartItems(); renderProducts()
}

function changeQty(id, delta){
  const item = cart.find(c => c.id === id)
  if(!item) return
  const si = shopData.items.find(i => i.id === id)
  const nq = item.quantity + delta
  if(nq <= 0){ removeFromCart(id); return }
  if(si && nq > si.stock){ alert("Max "+si.stock+" st!"); return }
  item.quantity = nq
  updateCartUI(); renderCartItems(); renderProducts()
}

function updateCartUI(){
  const count = cart.reduce((s,c) => s+c.quantity, 0)
  const sum = getCartTotal()
  document.getElementById("cartCount").textContent = count
  document.getElementById("cartSum").textContent = sum
  document.getElementById("cartFloat").style.display = count > 0 ? "block" : "none"
}

function getCartTotal(){
  let total = cart.reduce((s,c) => s+(c.price*c.quantity), 0)
  if(appliedCoupon) total = Math.round(total * (1 - appliedCoupon.percent/100))
  return total
}


/* ==============================
   RABATTKOD
   ============================== */

function applyCoupon(){
  const code = document.getElementById("custCoupon").value.trim().toUpperCase()
  const statusEl = document.getElementById("couponStatus")

  // Simple coupon system (can be extended via API)
  const coupons = {
    "VÄLKOMMEN10": { percent:10, label:"10% rabatt" },
    "MATLÅDA20":   { percent:20, label:"20% rabatt" },
    "VIP30":       { percent:30, label:"30% VIP-rabatt" }
  }

  if(coupons[code]){
    appliedCoupon = coupons[code]
    statusEl.textContent = "✅ " + appliedCoupon.label + " tillagd!"
    statusEl.className = "valid"
    renderCartItems()
  } else if(!code) {
    appliedCoupon = null
    statusEl.textContent = ""
    renderCartItems()
  } else {
    appliedCoupon = null
    statusEl.textContent = "❌ Ogiltig kod"
    statusEl.className = "invalid"
    renderCartItems()
  }
}


/* ==============================
   MODAL
   ============================== */

function openCart(){
  document.getElementById("cartModal").classList.add("active")
  document.getElementById("cartStep1").style.display = "block"
  document.getElementById("cartStep2").style.display = "none"
  renderCartItems()
}
function closeCart(){ document.getElementById("cartModal").classList.remove("active") }

function renderCartItems(){
  const el = document.getElementById("cartItems")
  const btn = document.getElementById("checkoutBtn")
  if(!cart.length){
    el.innerHTML = '<p style="color:#999;text-align:center;padding:16px;">Kundvagnen är tom</p>'
    document.getElementById("cartTotal").textContent = "0"
    btn.disabled = true; return
  }
  let html = ""
  for(const c of cart){
    html += `<div class="cart-item">
      <div class="cart-item-info"><div class="cart-item-name">${escapeHtml(c.name)}</div>
      <div class="cart-item-detail">${c.price} kr × ${c.quantity} = ${c.price*c.quantity} kr</div></div>
      <div style="display:flex;align-items:center;gap:6px;">
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty('${c.id}',-1)">−</button>
          <span class="qty-value">${c.quantity}</span>
          <button class="qty-btn" onclick="changeQty('${c.id}',1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${c.id}')">🗑️</button>
      </div></div>`
  }
  if(appliedCoupon){
    const subtotal = cart.reduce((s,c) => s+(c.price*c.quantity), 0)
    const discount = Math.round(subtotal * appliedCoupon.percent / 100)
    html += `<div style="padding:8px 0;color:#27ae60;font-weight:bold;font-size:14px;">
      🎟️ ${appliedCoupon.label}: –${discount} kr</div>`
  }
  el.innerHTML = html
  document.getElementById("cartTotal").textContent = getCartTotal()
  btn.disabled = false
}


/* ==============================
   HÄMTDAGAR & TIDER
   ============================== */

function buildPickupDays(){
  const sel = document.getElementById("custDay"); sel.innerHTML = ""
  const days = ["Söndag","Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag"]
  const openDays = [3,4,5]
  for(let i=0;i<14;i++){
    const d = new Date(); d.setDate(d.getDate()+i)
    if(!openDays.includes(d.getDay())) continue
    const ds = d.toISOString().split("T")[0]
    const label = days[d.getDay()]+" "+d.getDate()+"/"+(d.getMonth()+1)+(i===0?" (idag)":"")
    const opt = document.createElement("option"); opt.value=ds; opt.textContent=label; sel.appendChild(opt)
  }
}

function buildPickupTimes(){
  const sel = document.getElementById("custTime"); sel.innerHTML = ""
  const [sh,sm] = (shopData.pickupHoursStart||"11:00").split(":").map(Number)
  const [eh,em] = (shopData.pickupHoursEnd||"15:00").split(":").map(Number)
  let h=sh, m=sm
  while(h<eh||(h===eh&&m<=em)){
    const ts = String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")
    const opt = document.createElement("option"); opt.value=ts; opt.textContent=ts; sel.appendChild(opt)
    m+=30; if(m>=60){m=0;h++}
  }
}


/* ==============================
   BESTÄLL
   ============================== */

async function placeOrder(){
  const name=document.getElementById("custName").value.trim()
  const phone=document.getElementById("custPhone").value.trim()
  const email=document.getElementById("custEmail").value.trim()
  const day=document.getElementById("custDay").value
  const time=document.getElementById("custTime").value
  const coupon=document.getElementById("custCoupon").value.trim()

  if(!name){alert("Ange namn");return}
  if(!phone){alert("Ange telefon");return}
  if(!day){alert("Välj dag");return}
  if(!time){alert("Välj tid");return}
  if(!cart.length){alert("Tom kundvagn");return}

  const btn=document.getElementById("checkoutBtn")
  btn.disabled=true; btn.textContent="⏳ Beställer..."

  try{
    const r=await fetch(W+"/shop/order",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        name, phone, email, pickupDay:day, pickupTime:time, coupon,
        items:cart.map(c=>({id:c.id,quantity:c.quantity}))
      })})
    const d=await r.json()
    if(d.error){alert("❌ "+d.error);btn.disabled=false;btn.textContent="✅ Beställ & betala med Swish";return}
    showReceipt(d.order,email,d.emailSent)
  }catch(e){alert("❌ "+e.message);btn.disabled=false;btn.textContent="✅ Beställ & betala med Swish"}
}

function showReceipt(order,email,emailSent){
  document.getElementById("cartStep1").style.display="none"
  document.getElementById("cartStep2").style.display="block"
  document.getElementById("receiptOrderId").textContent=order.id
  document.getElementById("receiptItems").textContent=order.items.map(i=>i.quantity+"× "+i.name).join(", ")
  document.getElementById("receiptPickup").textContent=order.pickupDay+" kl "+order.pickupTime
  document.getElementById("receiptAddress").textContent=order.pickupAddress||""
  document.getElementById("receiptSwish").textContent=order.swishNumber||"–"
  document.getElementById("receiptSwishMsg").textContent=order.swishMessage||""
  document.getElementById("receiptTotal").textContent=order.totalPrice

  // Swish QR
  const swishNum = (order.swishNumber||"").replace(/[\s-]/g,"")
  if(swishNum){
    const qrData = encodeURIComponent(`C${swishNum};${order.totalPrice};${order.swishMessage||""}`)
    document.getElementById("swishQrArea").innerHTML =
      `<div class="swish-qr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrData}" alt="Swish QR"></div>
       <div style="font-size:12px;margin-top:4px;opacity:0.9;">Scanna med Swish-appen</div>`
  }

  // Email status
  if(email){
    const el=document.getElementById("receiptEmailMsg"); el.style.display="block"
    el.innerHTML=emailSent
      ? '📧 Kvitto skickat till: <strong>'+escapeHtml(email)+'</strong> ✅'
      : '📧 Kvitto till: <strong>'+escapeHtml(email)+'</strong>'
  }

  // Order status link
  document.getElementById("receiptStatusLink").innerHTML =
    `<div class="status-link">📋 <a href="shop.html?order=${order.id}">Följ din beställning →</a></div>`
}

function resetCart(){ cart=[];appliedCoupon=null;updateCartUI();loadShop() }


/* ==============================
   HJÄLP
   ============================== */

function escapeHtml(t){const d=document.createElement("div");d.textContent=t||"";return d.innerHTML}
function escapeAttr(t){return(t||"").replace(/'/g,"\\'").replace(/"/g,"&quot;")}
