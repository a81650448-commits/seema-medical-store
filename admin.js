const ADMIN_EMAIL = "a81650448@gmail.com";
const db = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

const loginCard = document.getElementById("loginCard");
const dashboard = document.getElementById("dashboard");
const loginError = document.getElementById("loginError");
const dashboardError = document.getElementById("dashboardError");
const dashboardSuccess = document.getElementById("dashboardSuccess");
const logoutBtn = document.getElementById("logoutBtn");

function showError(el, msg){ el.textContent = msg; el.classList.remove("hidden"); }
function hide(el){ el.classList.add("hidden"); }

async function loadOrders(){
  hide(dashboardError);
  const { data, error } = await db.from("orders").select("*").order("created_at", {ascending:false});
  if(error){ showError(dashboardError, "Unable to load orders: " + error.message); return; }

  const orders = data || [];
  document.getElementById("totalOrders").textContent = orders.length;
  document.getElementById("pendingOrders").textContent = orders.filter(o => o.status === "Pending").length;
  document.getElementById("confirmedOrders").textContent = orders.filter(o => ["Confirmed","Delivered"].includes(o.status)).length;
  document.getElementById("totalValue").textContent = "₹" + orders.reduce((s,o)=>s+Number(o.total||0),0).toFixed(2);

  document.getElementById("ordersBody").innerHTML = orders.length ? orders.map(o => {
    const items = Array.isArray(o.items) ? o.items : [];
    const itemHtml = items.map(i => `<li>${escapeHtml(i.name)} × ${Number(i.qty||0)}</li>`).join("");
    const customer = `<strong>${escapeHtml(o.customer_name)}</strong><br><a href="tel:${escapeHtml(o.phone)}">${escapeHtml(o.phone)}</a><br><span class="muted">${escapeHtml(o.address)}</span>`;
    const payment = `${escapeHtml(o.payment_method)}${o.transaction_id ? `<br><small>UTR: ${escapeHtml(o.transaction_id)}</small>` : ""}`;
    const status = `<select class="status" data-id="${o.id}"><option value="Pending" ${o.status==='Pending'?'selected':''}>Pending</option><option value="Confirmed" ${o.status==='Confirmed'?'selected':''}>Confirmed</option><option value="Packed" ${o.status==='Packed'?'selected':''}>Packed</option><option value="Out for Delivery" ${o.status==='Out for Delivery'?'selected':''}>Out for delivery</option><option value="Delivered" ${o.status==='Delivered'?'selected':''}>Delivered</option><option value="Cancelled" ${o.status==='Cancelled'?'selected':''}>Cancelled</option></select>`;
    return `<tr><td><strong>${escapeHtml(o.order_id)}</strong></td><td>${customer}</td><td><ul class="items">${itemHtml || '<li>No items</li>'}</ul></td><td><strong>₹${Number(o.total||0).toFixed(2)}</strong></td><td>${payment}</td><td>${status}</td><td>${new Date(o.created_at).toLocaleString('en-IN')}</td></tr>`;
  }).join("") : `<tr><td colspan="7" class="muted">No orders yet.</td></tr>`;

  document.querySelectorAll("select.status").forEach(select => {
    select.addEventListener("change", () => updateStatus(select.dataset.id, select.value));
  });
}

async function updateStatus(id, status){
  hide(dashboardError); hide(dashboardSuccess);
  const { error } = await db.from("orders").update({status}).eq("id", id);
  if(error){ showError(dashboardError, "Status update failed: " + error.message); return; }
  dashboardSuccess.textContent = "Order status updated successfully.";
  dashboardSuccess.classList.remove("hidden");
  setTimeout(()=>hide(dashboardSuccess), 2500);
}

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
}

async function showSession(){
  const { data:{session} } = await db.auth.getSession();
  if(!session){ loginCard.classList.remove("hidden"); dashboard.classList.add("hidden"); logoutBtn.style.display="none"; return; }
  if(session.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()){
    await db.auth.signOut();
    showError(loginError, "This account is not authorized for the admin panel.");
    return;
  }
  hide(loginCard);
  dashboard.classList.remove("hidden");
  logoutBtn.style.display="block";
  document.getElementById("adminEmail").textContent = "Signed in as " + session.user.email;
  await loadOrders();
}

document.getElementById("loginForm").addEventListener("submit", async (e)=>{
  e.preventDefault(); hide(loginError);
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if(email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()){
    showError(loginError, "Use the authorized admin email."); return;
  }
  const { error } = await db.auth.signInWithPassword({email,password});
  if(error){ showError(loginError, error.message); return; }
  await showSession();
});

logoutBtn.addEventListener("click", async ()=>{ await db.auth.signOut(); await showSession(); });
document.getElementById("refreshBtn").addEventListener("click", loadOrders);
db.auth.onAuthStateChange(() => showSession());
showSession();
