// Admin Medicine Category selector: use existing categories, or create a new one.
(function(){
  'use strict';
  const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  function setup(){
    const old=$('mCategory');
    if(!old||old.dataset.categorySelectorReady)return;
    old.dataset.categorySelectorReady='true';

    const wrap=document.createElement('div');
    wrap.style.cssText='display:flex;gap:8px;align-items:center;margin-top:5px';
    const select=document.createElement('select');
    select.id='mCategory';
    select.className='select';
    select.innerHTML='<option value="">Loading categories...</option>';
    const newBtn=document.createElement('button');
    newBtn.type='button';
    newBtn.className='btn';
    newBtn.textContent='+ New Category';
    newBtn.title='Create a new category';
    wrap.append(select,newBtn);
    old.replaceWith(wrap);

    newBtn.addEventListener('click',()=>{
      const name=prompt('Enter the new medicine category name:');
      const clean=String(name||'').trim().replace(/\s+/g,' ');
      if(!clean)return;
      const existing=[...select.options].find(o=>o.value.toLowerCase()===clean.toLowerCase());
      if(existing){select.value=existing.value;return}
      const option=document.createElement('option');
      option.value=clean;option.textContent=clean;
      select.appendChild(option);select.value=clean;
    });

    loadCategories(select);
  }

  async function loadCategories(select){
    try{
      const {data,error}=await db.from('medicines').select('category').not('category','is',null);
      if(error)throw error;
      const map=new Map();
      (data||[]).forEach(row=>{
        const name=String(row.category||'').trim().replace(/\s+/g,' ');
        if(name&&!map.has(name.toLowerCase()))map.set(name.toLowerCase(),name);
      });
      const cats=[...map.values()].sort((a,b)=>a.localeCompare(b,'en',{sensitivity:'base'}));
      select.innerHTML='<option value="">Select existing category...</option>'+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
      select.insertAdjacentHTML('beforeend','<option value="__new__">＋ Create new category...</option>');
      select.addEventListener('change',()=>{
        if(select.value!=='__new__')return;
        const name=prompt('Enter the new medicine category name:');
        const clean=String(name||'').trim().replace(/\s+/g,' ');
        if(!clean){select.value='';return}
        const existing=[...select.options].find(o=>o.value.toLowerCase()===clean.toLowerCase());
        if(existing){select.value=existing.value;return}
        const option=document.createElement('option');option.value=clean;option.textContent=clean;
        select.insertBefore(option,select.lastElementChild);select.value=clean;
      });
    }catch(error){
      console.error('CATEGORY LOAD ERROR',error);
      select.innerHTML='<option value="">Unable to load categories</option><option value="__new__">＋ Create new category...</option>';
      select.addEventListener('change',()=>{
        if(select.value!=='__new__')return;
        const name=prompt('Enter the new medicine category name:');
        const clean=String(name||'').trim().replace(/\s+/g,' ');
        if(!clean){select.value='';return}
        const option=document.createElement('option');option.value=clean;option.textContent=clean;
        select.insertBefore(option,select.lastElementChild);select.value=clean;
      });
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
  window.addEventListener('medicinesCategoriesRefresh',()=>{const s=$('mCategory');if(s&&s.tagName==='SELECT')loadCategories(s)});
})();
