/* ==============================
   CateringCare Shop
   ============================== */

const W = "https://cateringcare-info-site-01.andersmenyit.workers.dev"
let shopData = null
let cart = []
let activeCategory = "all"

loadShop()

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
    const imageHtml = item.imageUrl
      ? `<img class="product-image" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" onerror="this.outerHTML='<div class=\\'product-image-placeholder\\'>🍱</div>'">`
      : '<div class="product-image-placeholder">🍱</div>'
    const btnClass = inCart ? "add-btn in-cart" : "add-btn"
    const btnText = inCart ? `✓ ${inCart.quantity} st` : "+ Köp"
    const ing = item.ingredients || item.description || ""

    html += `
      <div class="product-card">
        ${imageHtml}
        ${item.discountActive ? `<div class="discount-badge">–${item.discountPercent}%</div>` : ""}
        <div class="stock-badge ${lowStock?"low":""}">${lowStock?"⚠️ "+item.stock+" kvar":item.stock+" st"}</div>
        <div class="product-body">
          <div class="product-category">${escapeHtml(item.category||"")}</div>
          <div class="product-name">${escapeHtml(item.name)}</div>
          ${ing ? `<div class="product-ingredients">${escapeHtml(ing)}</div>` : ""}
          <div class="product-footer">
            <div class="product-price">
              ${item.discountActive ? `<span class="original">${item.price} kr</span>` : ""}
              ${item.finalPrice} kr
            </div>
            <button class="${btnClass}" onclick="addToCart('${item.id}')">${btnText}</button>
          </div>
        </div>
      </div>`
  }
  html += '</div>'
  area.innerHTML = html
}

function filterProducts(){ renderProducts() }

/* KUNDVAGN */
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
  updateCartUI(); renderProducts()
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
  const sum = cart.reduce((s,c) => s+(c.price*c.quantity), 0)
  document.getElementById("cartCount").textContent = count
  document.getElementById("cartSum").textContent = sum
  document.getElementById("cartFloat").style.display = count > 0 ? "block" : "none"
}

function getCartTotal(){ return cart.reduce((s,c) => s+(c.price*c.quantity), 0) }

/* MODAL */
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
  el.innerHTML = html
  document.getElementById("cartTotal").textContent = getCartTotal()
  btn.disabled = false
}

/* HÄMTDAGAR & TIDER */
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

/* BESTÄLL */
async function placeOrder(){
  const name=document.getElementById("custName").value.trim()
  const phone=document.getElementById("custPhone").value.trim()
  const email=document.getElementById("custEmail").value.trim()
  const day=document.getElementById("custDay").value
  const time=document.getElementById("custTime").value
  if(!name){alert("Ange namn");return}
  if(!phone){alert("Ange telefon");return}
  if(!day){alert("Välj dag");return}
  if(!time){alert("Välj tid");return}
  if(!cart.length){alert("Tom kundvagn");return}

  const btn=document.getElementById("checkoutBtn")
  btn.disabled=true; btn.textContent="⏳ Beställer..."
  try{
    const r=await fetch(W+"/shop/order",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name,phone,email,pickupDay:day,pickupTime:time,items:cart.map(c=>({id:c.id,quantity:c.quantity}))})})
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
  if(email){
    const el=document.getElementById("receiptEmailMsg"); el.style.display="block"
    el.innerHTML=emailSent?'📧 Kvitto skickat till: <strong>'+escapeHtml(email)+'</strong> ✅':'📧 Kvitto till: <strong>'+escapeHtml(email)+'</strong>'
  }
}

function resetCart(){ cart=[];updateCartUI();loadShop() }

function escapeHtml(t){const d=document.createElement("div");d.textContent=t||"";return d.innerHTML}
function escapeAttr(t){return(t||"").replace(/'/g,"\\'").replace(/"/g,"&quot;")}
