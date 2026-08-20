// Seema Medical Store - Admin Product Controls
(function(){
  'use strict';
  let loading=false;

  const escLocal=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const moneyLocal=v=>'₹'+Number(v||0).toFixed(2);

  function ready(){
    return document.getElementById('medicinesBody') && window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY;
  }
  function show(text,ok=true){
    if(typeof msg==='function') msg(text,ok);
  }

  function injectNotice(){
    const body=document.getElementById('medicinesBody');
    if(!body||document.getElementById('productControlNotice')) return;
    const table=body.closest('.table-wrap');
    const section=document.getElementById('medicines');
    if(!table||!section) return;
    const note=document.createElement('div');
    note.id='productControlNotice';
    note.className='card';
    note.style.cssText='background:#eef8f3;border:1px solid #b7dfca;color:#174b35;padding:14px 16px;margin:12px 0;';
    note.innerHTML='<b>🌐 Website Product Control</b><br><span style="font-size:13px">Change the selling price or available stock below and press <b>Save</b>. The customer website uses the same medicine database.</span> <button id="refreshProductsBtn" class="btn" type="button" style="margin-left:8px">↻ Refresh Products</button>';
    section.insertBefore(note,table);
    document.getElementById('refreshProductsBtn').onclick=()=>loadProducts(true);
  }

  function renderFallback(list){
    const body=document.getElementById('medicinesBody');
    if(!body) return;
    if(!list.length){
      body.innerHTML='<tr><td colspan="7"><b>No medicines found.</b><br><small>If medicines are visible on the customer website, click “Refresh Products”.</small></td></tr>';
      return;
    }
    body.innerHTML=list.map(m=>{
      const exp=m.expiry_date||m.expiry||'';
      return `<tr><td>${escLocal(m.name)}</td><td>${escLocal(m.category||'')}</td><td>${moneyLocal(m.price)}</td><td><b>${Number(m.stock||0)}</b></td><td>${escLocal(m.manufacturer||'')}</td><td>${escLocal(exp||'Not set')}</td><td><button class="btn danger med-delete" data-id="${escLocal(m.id)}" type="button">Delete</button></td></tr>`;
    }).join('');
    if(Array.isArray(window.medicines)) window.medicines=list;
    document.querySelectorAll('.med-delete').forEach(b=>b.onclick=async()=>{
      if(!confirm('Delete this medicine?')) return;
      const r=await window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY).from('medicines').delete().eq('id',b.dataset.id);
      if(r.error){show('Medicine delete failed: '+r.error.message,false);return;}
      show('Medicine deleted');loadProducts(true);
    });
  }

  async function loadProducts(force=false){
    if(!ready()||loading) return;
    const body=document.getElementById('medicinesBody');
    const app=document.getElementById('app');
    if(app&&app.classList.contains('hidden')) return;
    loading=true;
    injectNotice();
    try{
      const client=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
      const r=await client.from('medicines').select('id,name,category,price,stock,manufacturer,expiry_date').order('name');
      if(r.error) throw r.error;
      const list=r.data||[];
      if(!list.length && !force && typeof window.loadMedicines==='function'){
        await window.loadMedicines();
        loading=false;
        return;
      }
      if(list.length){
        if(Array.isArray(window.medicines)){window.medicines=list;}
        if(typeof window.renderMedicines==='function') window.renderMedicines();
        else renderFallback(list);
      }else{
        renderFallback([]);
      }
      setTimeout(decorateRows,100);
    }catch(error){
      const text=error.message||String(error);
      body.innerHTML='<tr><td colspan="7"><b>Unable to load medicines.</b><br><small>'+escLocal(text)+'</small><br><button class="btn primary" type="button" id="retryProductsBtn">Retry</button></td></tr>';
      setTimeout(()=>{const b=document.getElementById('retryProductsBtn');if(b)b.onclick=()=>loadProducts(true)},0);
    }finally{loading=false;}
  }

  function decorateRows(){
    if(!ready()) return;
    const body=document.getElementById('medicinesBody');
    if(!body) return;
    Array.from(body.querySelectorAll('tr')).forEach(row=>{
      if(row.dataset.productControlReady==='1') return;
      const cells=row.querySelectorAll('td');
      if(cells.length<7) return;
      const deleteBtn=row.querySelector('.med-delete');
      const id=deleteBtn&&deleteBtn.dataset.id;
      if(!id) return;
      const priceText=(cells[2].textContent||'').replace(/[^0-9.]/g,'');
      const stockText=(cells[3].textContent||'').replace(/[^0-9]/g,'');
      cells[2].innerHTML=`<input class="input product-price-input" data-product-id="${escLocal(id)}" type="number" min="0" step="0.01" value="${priceText||0}" style="min-width:110px">`;
      cells[3].innerHTML=`<input class="input product-stock-input" data-product-id="${escLocal(id)}" type="number" min="0" step="1" value="${stockText||0}" style="min-width:90px">`;
      const save=document.createElement('button');
      save.type='button';save.className='btn primary product-save-btn';save.dataset.id=id;save.textContent='💾 Save';save.style.marginRight='6px';
      save.onclick=()=>saveProduct(id,save);
      cells[6].insertBefore(save,cells[6].firstChild);
      row.dataset.productControlReady='1';
    });
  }

  async function saveProduct(id,button){
    const priceInput=document.querySelector(`.product-price-input[data-product-id="${CSS.escape(String(id))}"]`);
    const stockInput=document.querySelector(`.product-stock-input[data-product-id="${CSS.escape(String(id))}"]`);
    if(!priceInput||!stockInput) return;
    const price=Number(priceInput.value),stock=Number(stockInput.value);
    if(!Number.isFinite(price)||price<0){show('Enter a valid price.',false);return;}
    if(!Number.isFinite(stock)||stock<0||!Number.isInteger(stock)){show('Stock must be a whole number of 0 or more.',false);return;}
    button.disabled=true;button.textContent='Saving...';
    try{
      const client=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
      const r=await client.from('medicines').update({price,stock}).eq('id',id);
      if(r.error) throw r.error;
      show(`Product updated: price ₹${price.toFixed(2)}, stock ${stock}`);
      await loadProducts(true);
    }catch(error){show('Product update failed: '+(error.message||String(error)),false);button.disabled=false;button.textContent='💾 Save';}
  }

  function start(){
    if(!document.getElementById('medicinesBody')){setTimeout(start,500);return;}
    injectNotice();
    const app=document.getElementById('app');
    if(app&&!app.classList.contains('hidden')) loadProducts(false);
    setTimeout(()=>loadProducts(false),800);
    setTimeout(()=>loadProducts(false),2000);
    setTimeout(()=>loadProducts(false),4000);
  }

  window.loadAdminProducts=loadProducts;
  window.addEventListener('load',start);
  document.addEventListener('DOMContentLoaded',start);
})();