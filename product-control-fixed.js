// Seema Medical Store - stable admin product price/stock controls
(function(){
  'use strict';
  let busy=false;
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const money=v=>'₹'+Number(v||0).toFixed(2);
  const ready=()=>document.getElementById('medicinesBody')&&window.supabase&&window.SUPABASE_URL&&window.SUPABASE_ANON_KEY;
  const notice=()=>{
    const body=document.getElementById('medicinesBody'),section=document.getElementById('medicines');
    if(!body||!section||document.getElementById('productControlNotice'))return;
    const table=body.closest('.table-wrap'); if(!table)return;
    const n=document.createElement('div'); n.id='productControlNotice'; n.className='card';
    n.style.cssText='background:#eef8f3;border:1px solid #b7dfca;color:#174b35;padding:14px 16px;margin:12px 0;';
    n.innerHTML='<b>🌐 Website Product Control</b><br><span style="font-size:13px">Change the selling price or available stock below and press <b>Save</b>. The customer website uses the same medicine database.</span> <button id="refreshProductsBtn" class="btn" type="button">↻ Refresh Products</button>';
    section.insertBefore(n,table); document.getElementById('refreshProductsBtn').onclick=()=>loadProducts(true);
  };
  function render(list){
    const body=document.getElementById('medicinesBody'); if(!body)return;
    body.innerHTML=list.length?list.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.category||'')}</td><td>${money(m.price)}</td><td><b>${Number(m.stock||0)}</b></td><td>${esc(m.manufacturer||'')}</td><td>${esc(m.expiry_date||'Not set')}</td><td><button class="btn danger med-delete" data-id="${esc(m.id)}" type="button">Delete</button></td></tr>`).join(''):'<tr><td colspan="7"><b>No medicines found.</b></td></tr>';
    if(Array.isArray(window.medicines))window.medicines=list;
    body.querySelectorAll('.med-delete').forEach(b=>b.onclick=async()=>{if(!confirm('Delete this medicine?'))return;const r=await window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY).from('medicines').delete().eq('id',b.dataset.id);if(r.error){if(typeof msg==='function')msg('Medicine delete failed: '+r.error.message,false);return;}loadProducts(true);});
    body.querySelectorAll('tr').forEach(row=>{
      const del=row.querySelector('.med-delete'); if(!del)return; const id=del.dataset.id, c=row.querySelectorAll('td'); if(c.length<7)return;
      const p=(c[2].textContent||'').replace(/[^0-9.]/g,'')||0,s=(c[3].textContent||'').replace(/[^0-9]/g,'')||0;
      c[2].innerHTML=`<input class="input product-price-input" data-product-id="${esc(id)}" type="number" min="0" step="0.01" value="${p}" style="min-width:110px">`;
      c[3].innerHTML=`<input class="input product-stock-input" data-product-id="${esc(id)}" type="number" min="0" step="1" value="${s}" style="min-width:90px">`;
      const save=document.createElement('button'); save.type='button';save.className='btn primary';save.textContent='💾 Save';save.style.marginRight='6px';save.onclick=()=>saveProduct(id,save);c[6].insertBefore(save,c[6].firstChild);
    });
  }
  async function loadProducts(force){
    if(!ready()||busy)return; const app=document.getElementById('app'); if(app&&app.classList.contains('hidden'))return; busy=true; notice();
    try{
      const client=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
      const r=await client.from('medicines').select('id,name,category,price,stock,manufacturer,expiry_date').order('name');
      if(r.error)throw r.error; render(r.data||[]);
    }catch(e){const b=document.getElementById('medicinesBody');if(b)b.innerHTML='<tr><td colspan="7"><b>Unable to load medicines.</b><br><small>'+esc(e.message||e)+'</small><br><button class="btn primary" type="button" onclick="window.loadAdminProducts(true)">Retry</button></td></tr>';}finally{busy=false;}
  }
  async function saveProduct(id,button){
    const p=document.querySelector(`.product-price-input[data-product-id="${CSS.escape(String(id))}"]`),s=document.querySelector(`.product-stock-input[data-product-id="${CSS.escape(String(id))}"]`);if(!p||!s)return;
    const price=Number(p.value),stock=Number(s.value);if(!Number.isFinite(price)||price<0){if(typeof msg==='function')msg('Enter a valid price.',false);return;}if(!Number.isInteger(stock)||stock<0){if(typeof msg==='function')msg('Stock must be a whole number of 0 or more.',false);return;}
    button.disabled=true;button.textContent='Saving...';try{const r=await window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY).from('medicines').update({price,stock}).eq('id',id);if(r.error)throw r.error;if(typeof msg==='function')msg('Product updated successfully.');await loadProducts(true);}catch(e){if(typeof msg==='function')msg('Product update failed: '+(e.message||e),false);button.disabled=false;button.textContent='💾 Save';}
  }
  function start(){if(!document.getElementById('medicinesBody')){setTimeout(start,500);return;}notice();const app=document.getElementById('app');if(app&&!app.classList.contains('hidden'))loadProducts(false);}
  window.loadAdminProducts=loadProducts;window.addEventListener('load',start);document.addEventListener('DOMContentLoaded',start);
})();