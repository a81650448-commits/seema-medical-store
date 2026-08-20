// Seema Medical Store - Admin Product Controls
(function(){
  'use strict';

  function ready(){
    return document.getElementById('medicinesBody') && window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY;
  }

  function showControlMessage(text, ok){
    if(typeof msg === 'function') msg(text, ok !== false);
  }

  function injectNotice(){
    const body=document.getElementById('medicinesBody');
    if(!body || document.getElementById('productControlNotice')) return;
    const table=body.closest('.table-wrap');
    if(!table) return;
    const card=table.closest('.section');
    if(!card) return;
    const note=document.createElement('div');
    note.id='productControlNotice';
    note.className='card';
    note.style.cssText='background:#eef8f3;border:1px solid #b7dfca;color:#174b35;padding:14px 16px;margin:12px 0;';
    note.innerHTML='<b>🌐 Website Product Control</b><br><span style="font-size:13px">Change the selling price or available stock below and press <b>Save</b>. The customer website uses the same medicine database, so the updated price and stock will appear there after refresh.</span>';
    card.insertBefore(note, table);
  }

  function decorateRows(){
    if(!ready()) return;
    injectNotice();
    const body=document.getElementById('medicinesBody');
    Array.from(body.querySelectorAll('tr')).forEach(row=>{
      if(row.dataset.productControlReady==='1') return;
      const cells=row.querySelectorAll('td');
      if(cells.length<7) return;
      const deleteBtn=row.querySelector('.med-delete');
      const id=deleteBtn && deleteBtn.dataset.id;
      if(!id) return;
      const currentPrice=(cells[2].textContent||'').replace(/[^0-9.]/g,'');
      const currentStock=(cells[3].textContent||'').replace(/[^0-9]/g,'');

      cells[2].innerHTML=`<input class="input product-price-input" data-product-id="${id}" type="number" min="0" step="0.01" value="${currentPrice||0}" style="min-width:110px">`;
      cells[3].innerHTML=`<input class="input product-stock-input" data-product-id="${id}" type="number" min="0" step="1" value="${currentStock||0}" style="min-width:90px">`;
      const save=document.createElement('button');
      save.type='button';
      save.className='btn primary product-save-btn';
      save.dataset.id=id;
      save.textContent='💾 Save';
      save.style.marginRight='6px';
      save.addEventListener('click',()=>saveProduct(id,save));
      cells[6].insertBefore(save,cells[6].firstChild);
      row.dataset.productControlReady='1';
    });
  }

  async function saveProduct(id,button){
    const priceInput=document.querySelector(`.product-price-input[data-product-id="${CSS.escape(String(id))}"]`);
    const stockInput=document.querySelector(`.product-stock-input[data-product-id="${CSS.escape(String(id))}"]`);
    if(!priceInput||!stockInput) return;
    const price=Number(priceInput.value),stock=Number(stockInput.value);
    if(!Number.isFinite(price)||price<0){showControlMessage('Enter a valid price.',false);priceInput.focus();return;}
    if(!Number.isFinite(stock)||stock<0||!Number.isInteger(stock)){showControlMessage('Stock must be a whole number of 0 or more.',false);stockInput.focus();return;}
    button.disabled=true;button.textContent='Saving...';
    try{
      const client=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
      const result=await client.from('medicines').update({price,stock}).eq('id',id);
      if(result.error) throw result.error;
      showControlMessage(`Product updated: price ₹${price.toFixed(2)}, stock ${stock}`);
      if(typeof loadMedicines==='function') await loadMedicines();
      setTimeout(decorateRows,100);
    }catch(error){
      showControlMessage('Product update failed: '+(error.message||String(error)),false);
      button.disabled=false;button.textContent='💾 Save';
    }
  }

  function start(){
    if(!document.getElementById('medicinesBody')){setTimeout(start,300);return;}
    injectNotice();
    decorateRows();
    const body=document.getElementById('medicinesBody');
    if(!body.dataset.productControlObserver){
      const observer=new MutationObserver(()=>setTimeout(decorateRows,0));
      observer.observe(body,{childList:true});
      body.dataset.productControlObserver='1';
    }
  }

  window.addEventListener('load',start);
  document.addEventListener('DOMContentLoaded',start);
  setTimeout(start,500);
  setTimeout(start,1500);
})();
