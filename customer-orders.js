// Seema Medical Store - Customer My Orders
(function(){
  let db=null;
  const $=id=>document.getElementById(id);
  function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function money(v){return '₹'+Number(v||0).toFixed(2);}
  function statusClass(s){return String(s||'').toLowerCase().replace(/\s+/g,'-');}
  function itemList(items){
    if(!Array.isArray(items)) return '<p class="small">Medicine details unavailable.</p>';
    return items.map(x=>`<div class="summary-line"><span>${esc(x.name)} × ${Number(x.qty||0)}</span><strong>${money((Number(x.price)||0)*(Number(x.qty)||0))}</strong></div>`).join('');
  }
  function track(id,phone){
    $('trackingOrderId').value=id||'';
    $('trackingPhone').value=phone||'';
    document.getElementById('track-order').scrollIntoView({behavior:'smooth'});
    setTimeout(()=>window.trackOrder&&window.trackOrder(),250);
  }
  window.openMyOrders=async function(){
    const section=$('my-orders');
    if(!section)return;
    section.scrollIntoView({behavior:'smooth'});
    const box=$('myOrdersList');
    box.innerHTML='<p>Loading your orders...</p>';
    if(!db){
      if(window.supabase&&window.SUPABASE_URL&&window.SUPABASE_ANON_KEY) db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
      else {box.innerHTML='<p>Supabase connection is unavailable. Please refresh.</p>';return;}
    }
    const {data:{user},error:userError}=await db.auth.getUser();
    if(userError||!user){box.innerHTML='<p>Please login to view your orders.</p>';return;}
    const {data,error}=await db.from('orders').select('order_id,customer_name,phone,address,items,total,payment_method,status,created_at').eq('user_id',user.id).order('created_at',{ascending:false});
    if(error){console.error('MY ORDERS ERROR',error);box.innerHTML='<p>My Orders is not connected yet. Please complete the Supabase database setup below.</p>';return;}
    if(!data||!data.length){box.innerHTML='<div class="success"><strong>No orders yet.</strong><br>Place your first medicine order and it will appear here automatically.</div>';return;}
    box.innerHTML=data.map(o=>`<article class="customer-order-card"><div class="customer-order-head"><div><strong>${esc(o.order_id)}</strong><div class="small">${o.created_at?new Date(o.created_at).toLocaleString('en-IN'):''}</div></div><span class="order-status-badge ${statusClass(o.status)}">${esc(o.status)}</span></div><div class="customer-order-items">${itemList(o.items)}</div><div class="customer-order-info"><span>Total <strong>${money(o.total)}</strong></span><span>Payment <strong>${esc(o.payment_method)}</strong></span></div><p class="small"><strong>Delivery:</strong> ${esc(o.address)}</p><button class="primary" type="button" onclick="openMyOrderTracking('${esc(o.order_id)}','${esc(o.phone)}')">📦 Track Order</button></article>`).join('');
  };
  window.openMyOrderTracking=function(id,phone){track(id,phone)};
  window.refreshMyOrders=window.openMyOrders;
  function setup(){
    if(!$('my-orders'))return;
    if(window.seemaCustomerAuth){
      window.seemaCustomerAuth.auth.onAuthStateChange((event)=>{if(event==='SIGNED_IN'||event==='SIGNED_OUT')setTimeout(()=>{if(event==='SIGNED_IN')window.openMyOrders();},150);});
    }
    if(!document.getElementById('customer-dashboard-loader')){
      const script=document.createElement('script');
      script.id='customer-dashboard-loader';
      script.src='customer-dashboard.js?v=20260820-01';
      document.body.appendChild(script);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
