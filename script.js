const products = [
["Painkillers & Fever","Paracetamol 500 mg","10 Tablets",15],["Painkillers & Fever","Paracetamol 650 mg","10 Tablets",25],["Painkillers & Fever","Ibuprofen 400 mg","10 Tablets",25],["Painkillers & Fever","Diclofenac 50 mg","10 Tablets",30],
["Anti-Allergic","Cetirizine 10 mg","10 Tablets",20],["Anti-Allergic","Levocetirizine 5 mg","10 Tablets",25],
["Anti-Emetic","Ondansetron 4 mg","10 Tablets",30],
["ORS & Rehydration","ORS","1 Sachet",20],
["Gastrointestinal","Pantoprazole 40 mg","10 Tablets",35],["Gastrointestinal","Omeprazole 20 mg","10 Capsules",25],["Gastrointestinal","Antacid Suspension","170 ml",110],
["Antibiotics","Azithromycin 500 mg","3 Tablets",30],["Antibiotics","Amoxicillin 500 mg","10 Capsules",50],["Antibiotics","Amoxicillin + Clavulanic Acid","6 Tablets",120],
["Chronic Disease Management","Metformin 500 mg","10 Tablets",20],["Chronic Disease Management","Glimepiride 1 mg","10 Tablets",25],["Chronic Disease Management","Amlodipine 5 mg","10 Tablets",20],["Chronic Disease Management","Telmisartan 40 mg","10 Tablets",40],["Chronic Disease Management","Atorvastatin 10 mg","10 Tablets",30],
["Nutritional Supplements","Multivitamin Tablets","10 Tablets",50],["Nutritional Supplements","Vitamin B-Complex","10 Tablets",40],["Nutritional Supplements","Calcium + Vitamin D3","10 Tablets",60],["Nutritional Supplements","Iron + Folic Acid","10 Tablets",50],
["Respiratory Care","Cough Syrup","100 ml",100],["Respiratory Care","Saline Nasal Drops","10 ml",50],
["Dermatological Care","Clotrimazole 1% Cream","20 g",60],["Dermatological Care","Luliconazole 1% Cream","10 g",120],
["Antiseptics & Disinfectants","Povidone-Iodine Solution","100 ml",100],["Antiseptics & Disinfectants","Hydrogen Peroxide Solution","100 ml",40],
["First-Aid & Healthcare Essentials","Cotton","100 g",0],["First-Aid & Healthcare Essentials","Gauze","1 Roll",0],["First-Aid & Healthcare Essentials","Adhesive Bandages","20 Strips",0],["First-Aid & Healthcare Essentials","Surgical Tape","1 Roll",0],["First-Aid & Healthcare Essentials","Disposable Gloves","1 Pair",0],["First-Aid & Healthcare Essentials","Digital Thermometer","1 Pc",0],["First-Aid & Healthcare Essentials","Face Mask","5 Pcs",0],["First-Aid & Healthcare Essentials","Hand Sanitizer","100 ml",0]
];
let cart = [], activeCategory = "All";

const cats = ["All", ...new Set(products.map(p=>p[0]))];
document.getElementById("categoryTabs").innerHTML = cats.map(c=>`<button class="tab ${c==="All"?"active":""}" onclick="setCategory('${c.replace(/'/g,"\\'")}')">${c}</button>`).join("");

function setCategory(c){
  activeCategory=c;
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.textContent===c));
  renderProducts();
}
function renderProducts(){
  const q=(document.getElementById("search").value||"").toLowerCase();
  const filtered=products.filter(p=>(activeCategory==="All"||p[0]===activeCategory)&&(p[1]+" "+p[0]).toLowerCase().includes(q));
  document.getElementById("productGrid").innerHTML=filtered.map((p,i)=>{
    const realIndex=products.indexOf(p);
    return `<article class="product"><div class="category">${p[0]}</div><h3>${p[1]}</h3><p>${p[2]}${p[3]?"":" · Price to be confirmed"}</p><div class="product-bottom"><span class="price">${p[3]?"₹"+p[3]:"Check price"}</span><button class="add" onclick="addToCart(${realIndex})">Add</button></div></article>`
  }).join("") || "<p>No medicine found.</p>";
}
function addToCart(i){
  const found=cart.find(x=>x.i===i);
  if(found) found.q++; else cart.push({i,q:1});
  updateCart();
}
function changeQty(i,d){
  const x=cart.find(x=>x.i===i); if(!x)return;
  x.q+=d; if(x.q<=0)cart=cart.filter(y=>y.i!==i); updateCart();
}
function total(){return cart.reduce((s,x)=>s+(products[x.i][3]||0)*x.q,0)}
function updateCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.q,0);
  document.getElementById("cartTotal").textContent="₹"+total();
  document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div><strong>${products[x.i][1]}</strong><div class="small">${products[x.i][2]}</div></div><div class="qty"><button onclick="changeQty(${x.i},-1)">−</button> ${x.q} <button onclick="changeQty(${x.i},1)">+</button></div><strong>₹${(products[x.i][3]||0)*x.q}</strong></div>`).join(""):"<p class='muted'>Your cart is empty.</p>";
}
function openCart(){document.getElementById("cartOverlay").classList.add("open");}
function closeCart(e){if(!e||e.target===document.getElementById("cartOverlay"))document.getElementById("cartOverlay").classList.remove("open");}
function openCheckout(){
  if(!cart.length){alert("Please add at least one product.");return;}
  document.getElementById("cartOverlay").classList.remove("open");
  document.getElementById("checkoutItems").innerHTML=cart.map(x=>`<div class="summary-line"><span>${products[x.i][1]} × ${x.q}</span><span>₹${(products[x.i][3]||0)*x.q}</span></div>`).join("");
  document.getElementById("checkoutTotal").textContent="₹"+total();
  document.getElementById("checkoutOverlay").classList.add("open");
}
function closeCheckout(e){if(!e||e.target===document.getElementById("checkoutOverlay"))document.getElementById("checkoutOverlay").classList.remove("open");}

function submitOrder(e){
  e.preventDefault();
  const items=cart.map(x=>({name:products[x.i][1],pack:products[x.i][2],qty:x.q,price:products[x.i][3]}));
  const order={
    orderId:"SMS-"+Date.now().toString().slice(-8),
    customer:document.getElementById("customerName").value,
    phone:document.getElementById("customerPhone").value,
    address:document.getElementById("address").value,
    payment:document.getElementById("paymentMethod").value,
    transactionId:document.getElementById("txn").value,
    items,total:total(),
    createdAt:new Date().toISOString()
  };
  localStorage.setItem("lastSeemaOrder",JSON.stringify(order));
  document.getElementById("orderForm").hidden=true;
  document.getElementById("orderSuccess").hidden=false;
  document.getElementById("orderSuccess").innerHTML=`<strong>Order request created: ${order.orderId}</strong><br><br>Total: ₹${order.total}<br>UPI: <strong>7007596728@pt</strong><br><br>Your website frontend is ready. For real online order storage and an admin panel, connect this form to a database such as Supabase/Firebase.`;
}
renderProducts(); updateCart();
