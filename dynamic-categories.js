// Dynamic homepage categories: reads every category currently stored in Supabase.
(function(){
  'use strict';
  async function loadDynamicCategories(){
    const box=document.getElementById('dynamicCategoryList');
    if(!box||!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY)return;
    try{
      const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
      const {data,error}=await db.from('medicines').select('category').not('category','is',null).order('category');
      if(error)throw error;
      const map=new Map();
      (data||[]).forEach(row=>{
        const name=String(row.category||'').trim();
        if(!name)return;
        const key=name.toLowerCase();
        if(!map.has(key))map.set(key,{name,count:0});
        map.get(key).count++;
      });
      const categories=[...map.values()].sort((a,b)=>a.name.localeCompare(b.name,'en',{sensitivity:'base'}));
      if(!categories.length){box.innerHTML='';return;}
      box.innerHTML=categories.map(c=>`<button class="dynamic-category-card" type="button" data-category="${escapeHtml(c.name)}"><span class="dynamic-category-icon">💊</span><strong>${escapeHtml(c.name)}</strong><small>${c.count} medicine${c.count===1?'':'s'}</small></button>`).join('');
      box.querySelectorAll('.dynamic-category-card').forEach(btn=>btn.addEventListener('click',()=>{
        if(typeof window.setCategory==='function')window.setCategory(btn.dataset.category);
        document.getElementById('products')?.scrollIntoView({behavior:'smooth'});
      }));
    }catch(err){console.error('DYNAMIC CATEGORY ERROR',err);box.innerHTML='';}
  }
  function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadDynamicCategories);else loadDynamicCategories();
  window.addEventListener('medicinesReady',loadDynamicCategories);
})();