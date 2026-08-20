// Seema Medical Store - admin medicine editor
(function(){
  'use strict';
  let busy=false;
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const money=v=>'₹'+Number(v||0).toFixed(2);
  const ready=()=>document.getElementById('medicinesBody')&&window.supabase&&window.SUPABASE_URL&&window.SUPABASE_ANON_KEY;
  const client=()=>window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
  function show(t,ok=true){if(typeof msg==='function')msg(t,ok);}
  function notice(){
    const body=document.getElementById('medicinesBody'),section=document.getElementById('medicines');
    if(!body||!section||document.getElementById('productControlNotice'))return;
    const table=body.closest('.table-wrap');if(!table)return;
    const n=document.createElement('div');n.id='productControlNotice';n.className='card';
    n.style.cssText='background:#eef8f3;border:1px solid #b7dfca;color:#174b35;padding:14px 16px;margin:12px 0;';
    n.innerHTML='<b>🌐 Website Product Control</b><br><span style="font-size:13px">Admin can edit <b>price, stock, manufacturer and expiry date</b>. Changes are saved to the same medicine database used by the customer website.</span> <button id="refreshProductsBtn" class="btn" type="button">↻ Refresh</button>';
    section.insertBefore(n,table);document.getElementById('refreshProductsBtn').onclick=()=>loadProducts(true);
  }
  function render(list){
    const body=document.getElementById('medicinesBody');if(!body)return;
    body.innerHTML=list.length?list.map(m=>`<tr>
      <td>${esc(m.name)}</td><td>${esc(m.category||'')}</td>
      <td><input class="input product-price-input" data-product-id="${esc(m.id)}" type="number" min="0" step="0.01" value="${Number(m.price||0)}" style="min-width:110px"></td>
      <td><input class="input product-stock-input" data-product-id="${esc(m.id)}" type="number" min="0" step="1" value="${Number(m.stock||0)}" style="min-width:90px"></td>
      <td><input class="input product-manufacturer-input" data-product-id="${esc(m.id)}" type="text" value="${esc(m.manufacturer||'')}" style="min-width:150px"></td>
      <td><input class="input product-expiry-input" data-product-id="${esc(m.id)}" type="date" value="${esc(m.expiry_date||'')}" style="min-width:145px"></td>
      <td><button class="btn primary product-save-btn" data-id="${esc(m.id)}" type="button">💾 Save</button> <button class="btn danger med-delete" data-id="${esc(m.id)}" type="button">Delete</button></td>
    </tr>`).join(''):'<tr><td colspan="7"><b>No medicines found.</b></td></tr>';
    if(Array.isArray(window.medicines))window.medicines=list;
    body.querySelectorAll('.med-delete').forEach(b=>b.onclick=async()=>{if(!confirm('Delete this medicine?'))return;const r=await client().from('medicines').delete().eq('id',b.dataset.id);if(r.error){show('Medicine delete failed: '+r.error.message,false);return;}show('Medicine deleted');loadProducts(true);});
    body.querySelectorAll('.product-save-btn').forEach(b=>b.onclick=()=>saveProduct(b.dataset.id,b));
  }
  async function loadProducts(force){
    if(!ready()||busy)return;const app=document.getElementById('app');if(app&&app.classList.contains('hidden'))return;
    busy=true;notice();
    try{const r=await client().from('medicines').select('id,name,category,price,stock,manufacturer,expiry_date').order('name');if(r.error)throw r.error;render(r.data||[]);}
    catch(e){const b=document.getElementById('medicinesBody');if(b)b.innerHTML='<tr><td colspan="7"><b>Unable to load medicines.</b><br><small>'+esc(e.message||e)+'</small><br><button class="btn primary" type="button" onclick="window.loadAdminProducts(true)">Retry</button></td></tr>';}
    finally{busy=false;}
  }
  async function saveProduct(id,button){
    const q=s=>document.querySelector(`${s}[data-product-id="${CSS.escape(String(id))}"]`);
    const p=q('.product-price-input'),s=q('.product-stock-input'),m=q('.product-manufacturer-input'),e=q('.product-expiry-input');if(!p||!s||!m||!e)return;
    const price=Number(p.value),stock=Number(s.value),manufacturer=m.value.trim(),expiry=e.value||null;
    if(!Number.isFinite(price)||price<0){show('Enter a valid price.',false);return;}
    if(!Number.isInteger(stock)||stock<0){show('Stock must be a whole number of 0 or more.',false);return;}
    button.disabled=true;button.textContent='Saving...';
    try{const r=await client().from('medicines').update({price,stock,manufacturer,expiry_date:expiry}).eq('id',id);if(r.error)throw r.error;show('Medicine updated successfully. Price, stock, manufacturer and expiry date are saved.');await loadProducts(true);}
    catch(e){show('Medicine update failed: '+(e.message||e),false);button.disabled=false;button.textContent='💾 Save';}
  }
  function start(){if(!document.getElementById('medicinesBody')){setTimeout(start,500);return;}notice();const app=document.getElementById('app');if(app&&!app.classList.contains('hidden'))loadProducts(false);}
  window.loadAdminProducts=loadProducts;window.addEventListener('load',start);document.addEventListener('DOMContentLoaded',start);
})();