const products = [];
let cart=[],activeCategory="All";
const ANAND_UPI_ID="7007596728@ptyes";
const ANAND_UPI_NAME="ANAND ENTERPRISES";
let medicineLoadError="";

async function loadMedicines(){
  const grid=document.getElementById("productGrid");
  try{
    if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY) throw new Error("Supabase connection is missing.");
    const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
    const {data,error}=await db.from("medicines").select("id,name,category,price,stock,manufacturer,expiry_date").order("name");
    if(error) throw error;
    products.length=0;
    (data||[]).forEach(m=>products.push([m.category||"Other",m.name,"Available stock: "+(m.stock??0),Number(m.price)||0,m]));
    buildCategories();
    renderProducts();
    // Tell the single cart system that product IDs are now available.
    // The listener restores the saved cart before processing any category deep-link.
    window.dispatchEvent(new Event("medicinesReady"));
    processMedicineDeepLink();
  }catch(error){
    medicineLoadError=error.message||"Unable to load medicines.";
    console.error("MEDICINE LOAD ERROR",error);
    buildCategories();
    grid.innerHTML='<p>Unable to load medicines. Please refresh the page.</p>';
  }
}
function buildCategories(){
  const cats=["All",...new Set(products.map(p=>p[0]))];
  document.getElementById("categoryTabs").innerHTML=cats.map(c=>c==="Diabetes"?`<a class="tab" href="diabetes.html">Diabetes</a>`:`<button class="tab ${c==="All"?"active":""}" onclick="setCategory('${c.replace(/'/g,"\\'")}')">${c}</button>`).join("");
}
function setCategory(c){activeCategory=c;document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.textContent===c));renderProducts()}
function renderProducts(){
  const q=(document.getElementById("search").value||"").toLowerCase();
  const f=products.filter(p=>(activeCategory==="All"||p[0]===activeCategory)&&(p[1]+" "+p[0]+" "+(p[4]?.manufacturer||"")).toLowerCase().includes(q));
  document.getElementById("productGrid").innerHTML=f.map(p=>{
    const i=products.indexOf(p), stock=Number(p[4]?.stock??0);
    return `<article class="product"><div class="category">${p[0]}</div><h3>${p[1]}</h3><p>${p[2]}</p>${p[4]?.manufacturer?`<p class="small">${p[4].manufacturer}</p>`:""}<div class="product-bottom"><span class="price">${p[3]?"₹"+p[3]:"Check price"}</span><button class="add" ${stock<=0?"disabled":""} onclick="addToCart(${i})">${stock<=0?"Out of Stock":"Add"}</button></div></article>`
  }).join("")||"<p>No medicine found.</p>";
}
function processMedicineDeepLink(){
  const params=new URLSearchParams(window.location.search),id=params.get("addMedicineId");
  if(!id)return;
  const i=products.findIndex(p=>String(p[4]?.id)===String(id));
  if(i<0){alert("Medicine is not available.");history.replaceState({},document.title,"index.html#products");return}
  const stock=Number(products[i][4]?.stock??0),price=Number(products[i][3]||0);
  if(stock<=0||price<=0){alert("This medicine is currently unavailable or its store price has not been set.");history.replaceState({},document.title,"index.html#products");return}
  addToCart(i);
  history.replaceState({},document.title,"index.html#products");
  setTimeout(openCart,150);
}
function addToCart(i){const stock=Number(products[i][4]?.stock??0),f=cart.find(x=>x.i===i);if(stock<=0)return;if(f&&f.q>=stock){alert("Only "+stock+" unit(s) available.");return}if(f)f.q++;else cart.push({i,q:1});updateCart()}
function changeQty(i,d){const x=cart.find(x=>x.i===i);if(!x)return;const stock=Number(products[i][4]?.stock??0);if(d>0&&x.q>=stock){alert("Only "+stock+" unit(s) available.");return}x.q+=d;if(x.q<=0)cart=cart.filter(y=>y.i!==i);updateCart()}
function total(){return cart.reduce((s,x)=>s+(Number(products[x.i][3])||0)*x.q,0)}
function updateCart(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.q,0);document.getElementById("cartTotal").textContent="₹"+total();document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div><strong>${products[x.i][1]}</strong><div class="small">${products[x.i][2]}</div></div><div class="qty"><button onclick="changeQty(${x.i},-1)">−</button> ${x.q} <button onclick="changeQty(${x.i},1)">+</button></div><strong>₹${(Number(products[x.i][3])||0)*x.q}</strong></div>`).join(""):"<p class='muted'>Your cart is empty.</p>"}
function openCart(){document.getElementById("cartOverlay").classList.add("open")}
function closeCart(e){if(!e||e.target===document.getElementById("cartOverlay"))document.getElementById("cartOverlay").classList.remove("open")}
function resetCheckoutForm(){const form=document.getElementById("orderForm"),success=document.getElementById("orderSuccess");if(form){form.hidden=false;form.reset()}if(success){success.hidden=true;success.innerHTML=""}togglePaymentFields();updateUpiLink()}
function openCheckout(){if(!cart.length){alert("Please add at least one product.");return}document.getElementById("cartOverlay").classList.remove("open");resetCheckoutForm();document.getElementById("checkoutItems").innerHTML=cart.map(x=>`<div class="summary-line"><span>${products[x.i][1]} × ${x.q}</span><span>₹${(Number(products[x.i][3])||0)*x.q}</span></div>`).join("");document.getElementById("checkoutTotal").textContent="₹"+total();togglePaymentFields();updateUpiLink();document.getElementById("checkoutOverlay").classList.add("open")}
function closeCheckout(e){if(!e||e.target===document.getElementById("checkoutOverlay"))document.getElementById("checkoutOverlay").classList.remove("open")}
function updateUpiLink(){const button=document.getElementById("upiPayButton");if(!button)return;const amount=total();button.href="upi://pay?pa="+encodeURIComponent(ANAND_UPI_ID)+"&pn="+encodeURIComponent(ANAND_UPI_NAME)+"&am="+amount.toFixed(2)+"&cu=INR"}
function togglePaymentFields(){const method=document.getElementById("paymentMethod")?.value;const upi=document.getElementById("upiPaymentFields"),cod=document.getElementById("codPaymentFields"),txn=document.getElementById("txn");if(!upi||!cod)return;if(method==="COD"){upi.hidden=true;cod.hidden=false;if(txn)txn.required=false}else{upi.hidden=false;cod.hidden=true;if(txn)txn.required=true;updateUpiLink()}}

async function reserveOnlineStock(db){
  const required=new Map();
  cart.forEach(x=>required.set(x.i,(required.get(x.i)||0)+x.q));
  const reservations=[];
  for(const [index,qty] of required){
    const medicine=products[index]?.[4];
    if(!medicine) throw new Error("A medicine in your cart is no longer available. Please refresh and try again.");
    const id=medicine.id;
    const {data,error}=await db.rpc("reserve_medicine_stock",{p_medicine_id:id,p_quantity:qty});
    if(error) throw error;
    if(!data||!data.length){
      const current=await db.from("medicines").select("id,name,stock").eq("id",id).maybeSingle();
      if(current.error) throw current.error;
      const available=Number(current.data?.stock||0);
      throw new Error(`${current.data?.name||medicine.name} has only ${available} unit(s) available. Please update your cart.`);
    }
    const reserved=data[0];
    reservations.push({id:reserved.id,quantity:qty,name:reserved.name});
  }
  return reservations;
}
async function rollbackStock(db,reservations){
  for(const r of reservations){try{await db.rpc("restore_medicine_stock",{p_medicine_id:r.id,p_quantity:r.quantity});}catch(error){console.error("STOCK ROLLBACK ERROR",error)}}
}
async function submitOrder(e){
 e.preventDefault();if(!cart.length){alert("Please add at least one product.");return}
 const button=document.querySelector('#orderForm button[type="submit"]');if(button){button.disabled=true;button.textContent="Checking stock..."}let reservations=[];
 try{
  if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY)throw new Error("Supabase connection is missing. Refresh the page.");
  const payment=document.getElementById("paymentMethod").value,txn=document.getElementById("txn").value.trim();if(payment==="UPI"&&!txn)throw new Error("Please complete the UPI/QR payment and enter the UTR / transaction reference before placing the order.");
  const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY),name=document.getElementById("customerName").value.trim(),phone=document.getElementById("customerPhone").value.trim(),address=document.getElementById("address").value.trim();
  const items=cart.map(x=>({name:products[x.i][1],pack:products[x.i][2],qty:x.q,price:Number(products[x.i][3])||0,medicine_id:products[x.i][4]?.id||null})),orderId="SMS-"+Date.now().toString().slice(-8),orderTotal=total();
  if(button)button.textContent="Updating stock...";reservations=await reserveOnlineStock(db);
  const payload={order_id:orderId,customer_name:name,phone:phone,address:address,payment_method:payment,transaction_id:payment==="UPI"?txn:null,items:items,total:orderTotal,status:"Pending"};
  const customerResult=await db.from("customers").insert({name,phone,address});if(customerResult.error)console.warn("Customer save warning:",customerResult.error.message);
  if(button)button.textContent="Submitting order...";const orderResult=await db.from("orders").insert(payload);if(orderResult.error){await rollbackStock(db,reservations);reservations=[];throw new Error(orderResult.error.message+(orderResult.error.details?" — "+orderResult.error.details:""));}
  document.getElementById("orderForm").hidden=true;document.getElementById("orderSuccess").hidden=false;document.getElementById("orderSuccess").innerHTML=`<strong>Order submitted successfully!</strong><br><br>Order ID: <strong>${orderId}</strong><br>Total: <strong>₹${orderTotal}</strong><br>Payment: <strong>${payment==="UPI"?"UPI / QR — UTR recorded":"Cash on Delivery"}</strong><br><br>Stock has been updated automatically.<br><br>Keep this Order ID to track your order.<br><br><button type="button" class="primary" onclick="startAnotherOrder()">🛒 Place Another Order</button>`;cart=[];updateCart();await loadMedicines();
 }catch(error){console.error("ORDER SUBMISSION ERROR",error);if(reservations.length)await rollbackStock(window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY),reservations);alert(error.message||"Unable to submit the order")}finally{if(button){button.disabled=false;button.textContent="Confirm & Place Order"}}
}
function startAnotherOrder(){document.getElementById("checkoutOverlay").classList.remove("open");resetCheckoutForm();window.location.hash="products"}
async function trackOrder(){const orderId=document.getElementById("trackingOrderId").value.trim(),phone=document.getElementById("trackingPhone").value.trim(),result=document.getElementById("trackingResult");if(!orderId||!phone){result.innerHTML="<p>Please enter Order ID and mobile number.</p>";return}result.innerHTML="<p>Checking your order...</p>";try{const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);const {data,error}=await db.rpc("track_order",{p_order_id:orderId,p_phone:phone});if(error)throw error;if(!data||!data.length){result.innerHTML="<p><strong>Order not found.</strong><br>Check the Order ID and mobile number.</p>";return}const o=data[0],statuses=["Pending","Confirmed","Packed","Out for Delivery","Delivered"],idx=statuses.indexOf(o.status);result.innerHTML=`<div class="tracking-card"><h3>Order ${o.order_id}</h3><p><strong>Customer:</strong> ${o.customer_name}</p><p><strong>Total:</strong> ₹${o.total}</p><p><strong>Payment:</strong> ${o.payment_method}</p><div class="tracking-status">${statuses.map((s,i)=>`<div class="${i<=idx?"completed":""}"><span>${i<=idx?"✓":"○"}</span><strong>${s}</strong></div>`).join("")}</div><h3>Current Status: ${o.status}</h3></div>`}catch(error){result.innerHTML="<p>Tracking error: "+(error.message||"Unknown error")+"</p>"}}
loadMedicines();updateCart();togglePaymentFields();