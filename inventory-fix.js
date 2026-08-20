(function(){
  function refreshInventory(){
    if(typeof loadMedicines==='function') return loadMedicines();
    const body=document.getElementById('inventoryBody');
    if(body) body.innerHTML='<div class="card"><b>Inventory loader unavailable.</b><br><button class="btn primary" onclick="location.reload()">Reload Admin Panel</button></div>';
  }
  function setupInventorySearch(){
    const section=document.getElementById('inventory'),body=document.getElementById('inventoryBody');
    if(!section||!body)return;
    let input=document.getElementById('inventorySearch');
    if(!input){input=document.createElement('input');input.id='inventorySearch';input.className='input search';input.placeholder='Search inventory by medicine, category or status';input.setAttribute('autocomplete','off');const card=body.closest('.card');if(card)card.insertBefore(input,card.querySelector('p')?.nextSibling||body);else section.insertBefore(input,body);}
    const apply=()=>{const q=(input.value||'').trim().toLowerCase();Array.from(body.children).forEach(card=>{if(!card.classList.contains('card'))return;card.style.display=!q||card.textContent.toLowerCase().includes(q)?'':'none';});};
    if(!input.dataset.searchReady){input.addEventListener('input',apply);input.dataset.searchReady='1';}apply();
    if(!body.dataset.searchObserver){const observer=new MutationObserver(apply);observer.observe(body,{childList:true});body.dataset.searchObserver='1';}
  }
  function setupStockPurchase(){
    if(document.querySelector('[data-section="stock-purchase"]'))return;const side=document.querySelector('.side'),main=document.querySelector('.main');if(!side||!main)return;
    const btn=document.createElement('button');btn.type='button';btn.dataset.section='stock-purchase';btn.textContent='📥 Stock Purchase';side.appendChild(btn);
    const section=document.createElement('section');section.id='stock-purchase';section.className='section';
    section.innerHTML=`<h2>Stock Purchase</h2><div class="card"><h3>Add Stock Purchased from Supplier</h3><p class="muted">Use this module when new medicine stock arrives. It increases the existing stock; it does not change the selling price.</p><div class="formgrid"><label>Supplier Name<input id="purchaseSupplier" class="input" placeholder="Supplier name"></label><label>Supplier Invoice No.<input id="purchaseInvoice" class="input" placeholder="Invoice number"></label><label>Purchase Date<input id="purchaseDate" class="input" type="date"></label><label>Medicine<select id="purchaseMedicine" class="select"><option value="">Loading medicines...</option></select></label><label>Quantity Purchased<input id="purchaseQty" class="input" type="number" min="1" value="1"></label><label>Purchase Price / Unit<input id="purchasePrice" class="input" type="number" min="0" step="0.01" placeholder="Optional"></label></div><br><button id="saveStockPurchase" class="btn primary" type="button">Add Stock</button></div><div class="card"><h3>Recent Stock Purchases</h3><div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Supplier</th><th>Invoice</th><th>Medicine</th><th>Qty</th><th>Purchase Price</th><th>Total</th></tr></thead><tbody id="purchaseHistoryBody"></tbody></table></div></div>`;
    main.appendChild(section);const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());document.getElementById('purchaseDate').value=today.toISOString().slice(0,10);
    btn.onclick=()=>{document.querySelectorAll('.side button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.section').forEach(x=>x.classList.remove('active'));section.classList.add('active');fillPurchaseMedicine();renderPurchaseHistory();};
    document.getElementById('saveStockPurchase').onclick=saveStockPurchase;fillPurchaseMedicine();renderPurchaseHistory();
  }
  async function fillPurchaseMedicine(){
    const e=document.getElementById('purchaseMedicine');if(!e)return;let list=Array.isArray(window.medicines)?window.medicines:[];
    if(!list.length&&window.supabase&&window.SUPABASE_URL&&window.SUPABASE_ANON_KEY){try{const client=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);const r=await client.from('medicines').select('*').order('name');if(!r.error){list=r.data||[];window.medicines=list;}}catch(err){}}
    if(!list.length){e.innerHTML='<option value="">No medicines available — add medicine first</option>';return;}e.innerHTML='<option value="">Select medicine</option>'+list.map(m=>`<option value="${m.id}">${esc(m.name)} — Current Stock ${Number(m.stock||0)}</option>`).join('');
  }
  function purchaseHistory(){try{return JSON.parse(localStorage.getItem('seema_stock_purchases')||'[]')}catch(e){return[]}}
  function renderPurchaseHistory(){const body=document.getElementById('purchaseHistoryBody');if(!body)return;const rows=purchaseHistory();body.innerHTML=rows.length?rows.slice().reverse().slice(0,50).map(x=>`<tr><td>${esc(x.date)}</td><td>${esc(x.supplier)}</td><td>${esc(x.invoice||'—')}</td><td>${esc(x.medicine)}</td><td>${Number(x.qty)}</td><td>${x.price?money(x.price):'—'}</td><td>${x.price?money(Number(x.price)*Number(x.qty)):'—'}</td></tr>`).join(''):'<tr><td colspan="7">No stock purchases recorded yet.</td></tr>';}
  async function saveStockPurchase(){
    const id=document.getElementById('purchaseMedicine')?.value,qty=Math.max(0,Number(document.getElementById('purchaseQty')?.value||0));if(!id){msg('Select a medicine.',false);return}if(!qty){msg('Enter a valid purchase quantity.',false);return}
    const m=Array.isArray(window.medicines)?window.medicines.find(x=>String(x.id)===String(id)):null;if(!m){msg('Medicine not found. Reload inventory.',false);return}const next=Number(m.stock||0)+qty,r=await db.from('medicines').update({stock:next}).eq('id',id);if(r.error){msg('Stock purchase failed: '+r.error.message,false);return}
    const rec={date:document.getElementById('purchaseDate').value||new Date().toISOString().slice(0,10),supplier:document.getElementById('purchaseSupplier').value.trim()||'Not specified',invoice:document.getElementById('purchaseInvoice').value.trim(),medicine:m.name,medicine_id:m.id,qty,price:Number(document.getElementById('purchasePrice').value||0)||0};const rows=purchaseHistory();rows.push(rec);try{localStorage.setItem('seema_stock_purchases',JSON.stringify(rows));}catch(e){}
    msg(`${m.name}: ${qty} unit(s) added to stock`);document.getElementById('purchaseQty').value=1;document.getElementById('purchasePrice').value='';document.getElementById('purchaseInvoice').value='';if(typeof loadMedicines==='function')await loadMedicines();fillPurchaseMedicine();renderPurchaseHistory();
  }
  window.addEventListener('load',function(){setupInventorySearch();setupStockPurchase();document.querySelectorAll('.side button[data-section="inventory"]').forEach(function(btn){btn.addEventListener('click',function(){refreshInventory();setTimeout(setupInventorySearch,100);});});setTimeout(setupInventorySearch,300);setTimeout(fillPurchaseMedicine,800);setTimeout(fillPurchaseMedicine,2000);});
})();

(function(){
  const style=document.createElement('style');style.textContent='.notification-item{padding:13px 15px;border-radius:9px;background:#fff7ed;margin-bottom:12px;cursor:pointer;transition:.15s}.notification-item:hover{transform:translateY(-1px)}.notification-details{display:none;background:#fff;border:1px solid #e4e7ec;border-radius:9px;padding:14px;margin:-4px 0 12px}.notification-details.open{display:block}.notification-details table{width:100%;border-collapse:collapse}.notification-details th,.notification-details td{padding:9px;border-bottom:1px solid #eee;text-align:left}.notification-details th{background:#f8fafc}.notification-empty{color:#667085;padding:6px 0}';document.head.appendChild(style);
  function row(title,count,icon,id,html){return `<div class="notification-item" data-notification="${id}">${icon} <b>${count}</b> ${title}<span style="float:right">▼</span></div><div id="notification-${id}" class="notification-details">${html}</div>`}
  function table(headers,rows){if(!rows.length)return '<div class="notification-empty">No matching records.</div>';return `<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`}
  function renderNotificationDetails(){
    const body=document.getElementById('notificationsBody');if(!body)return;
    const low=medicines.filter(m=>Number(m.stock||0)<10),ex=medicines.filter(m=>expiry(m.expiry_date||m.expiry)[1]==='expired'),soon=medicines.filter(m=>expiry(m.expiry_date||m.expiry)[1]==='low'),pending=orders.filter(o=>o.status==='Pending');
    const pendingRows=pending.map(o=>`<tr><td><b>${esc(o.order_id)}</b></td><td>${esc(o.customer_name)}</td><td>${esc(o.phone)}</td><td>${money(o.total)}</td><td>${esc(o.created_at?new Date(o.created_at).toLocaleString('en-IN'):'—')}</td></tr>`);
    const lowRows=low.map(m=>`<tr><td><b>${esc(m.name)}</b></td><td>${esc(m.category||'—')}</td><td>${Number(m.stock||0)}</td><td>${esc(m.manufacturer||'—')}</td></tr>`);
    const exRows=ex.map(m=>{const e=expiry(m.expiry_date||m.expiry);return `<tr><td><b>${esc(m.name)}</b></td><td>${esc(m.category||'—')}</td><td>${esc(m.expiry_date||m.expiry||'—')}</td><td>${esc(e[0])}</td><td>${Number(m.stock||0)}</td></tr>`});
    const soonRows=soon.map(m=>{const e=expiry(m.expiry_date||m.expiry);return `<tr><td><b>${esc(m.name)}</b></td><td>${esc(m.category||'—')}</td><td>${esc(m.expiry_date||m.expiry||'—')}</td><td>${esc(e[0])}</td><td>${Number(m.stock||0)}</td></tr>`});
    body.innerHTML=[row('pending order(s)',pending.length,'🔴','pending',table(['Order','Customer','Phone','Amount','Date'],pendingRows)),row('low/out-of-stock medicine(s)',low.length,'🟡','low',table(['Medicine','Category','Stock','Manufacturer'],lowRows)),row('expired medicine(s)',ex.length,'⚠️','expired',table(['Medicine','Category','Expiry','Status','Stock'],exRows)),row('medicine(s) expire within 30 days',soon.length,'📅','soon',table(['Medicine','Category','Expiry','Status','Stock'],soonRows))].join('');
    body.querySelectorAll('.notification-item').forEach(item=>item.onclick=()=>{const target=document.getElementById('notification-'+item.dataset.notification);if(target)target.classList.toggle('open');});
  }
  window.renderNotifications=renderNotificationDetails;window.addEventListener('load',()=>setTimeout(renderNotificationDetails,500));
})();
