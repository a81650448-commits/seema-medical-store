(function(){
'use strict';
function setupCategorySelector(){
 const old=document.getElementById('mCategory');
 if(!old)return;
 if(old.tagName==='SELECT')return;
 const select=document.createElement('select');
 select.id='mCategory';select.className=old.className;select.required=false;
 select.innerHTML='<option value="">Select category</option>';
 (window.medicines||[]).map(m=>String(m.category||'').trim()).filter(Boolean).filter((v,i,a)=>a.findIndex(x=>x.toLowerCase()===v.toLowerCase())===i).sort((a,b)=>a.localeCompare(b)).forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;select.appendChild(o)});
 const custom=document.createElement('option');custom.value='__new__';custom.textContent='＋ Create new category...';select.appendChild(custom);
 old.replaceWith(select);
 select.addEventListener('change',function(){if(this.value==='__new__'){const name=prompt('Enter the new medicine category name:','');const clean=(name||'').trim();if(clean){const o=document.createElement('option');o.value=clean;o.textContent=clean;this.insertBefore(o,custom);this.value=clean;}else this.value='';}});
}
function refreshCategorySelector(){
 const old=document.getElementById('mCategory');if(!old)return;
 const current=old.value;
 if(old.tagName!=='SELECT'){setupCategorySelector();return;}
 const cats=[...new Map((window.medicines||[]).map(m=>String(m.category||'').trim()).filter(Boolean).map(c=>[c.toLowerCase(),c])).values()].sort((a,b)=>a.localeCompare(b));
 old.innerHTML='<option value="">Select category</option>'+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')+'<option value="__new__">＋ Create new category...</option>';
 if(current&&current!=='__new__')old.value=current;
 old.onchange=function(){if(this.value==='__new__'){const name=prompt('Enter the new medicine category name:','');const clean=(name||'').trim();if(clean){const o=document.createElement('option');o.value=clean;o.textContent=clean;this.insertBefore(o,this.options[this.options.length-1]);this.value=clean;}else this.value='';}};
}
function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
function addEditButtons(){const body=document.getElementById('medicinesBody');if(!body)return;body.querySelectorAll('tr').forEach(row=>{const del=row.querySelector('.med-delete');if(!del||row.querySelector('.med-edit'))return;const b=document.createElement('button');b.type='button';b.className='btn primary med-edit';b.dataset.id=del.dataset.id;b.textContent='Edit';b.style.marginRight='5px';del.parentNode.insertBefore(b,del)});}
async function editMedicine(id){const m=(window.medicines||[]).find(x=>String(x.id)===String(id));if(!m)return;const price=prompt('Price:',String(m.price??''));if(price===null)return;const stock=prompt('Available stock:',String(m.stock??''));if(stock===null)return;const manufacturer=prompt('Manufacturer:',String(m.manufacturer??''));if(manufacturer===null)return;const expiry=prompt('Expiry date (YYYY-MM-DD):',String(m.expiry_date||m.expiry||''));if(expiry===null)return;const category=prompt('Category:',String(m.category||''));if(category===null)return;const payload={price:Math.max(0,Number(price)||0),stock:Math.max(0,Math.floor(Number(stock)||0)),manufacturer:manufacturer.trim(),expiry_date:expiry.trim()||null,category:category.trim()||null};const r=await window.db.from('medicines').update(payload).eq('id',id);if(r.error){window.msg('Medicine update failed: '+r.error.message,false);return}window.msg('Medicine updated successfully');window.loadMedicines();}
function bind(){
 setupCategorySelector();refreshCategorySelector();addEditButtons();
 const body=document.getElementById('medicinesBody');if(body&&!body.dataset.enhanced){body.dataset.enhanced='1';body.addEventListener('click',function(e){const b=e.target.closest('.med-edit');if(b)editMedicine(b.dataset.id)});new MutationObserver(()=>addEditButtons()).observe(body,{childList:true,subtree:true});}
}
function wait(){if(document.getElementById('app')&&!document.getElementById('app').classList.contains('hidden'))bind();}
window.addEventListener('load',()=>{setTimeout(bind,300);setInterval(refreshCategorySelector,1000)});
})();