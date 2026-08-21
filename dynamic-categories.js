// Dynamic homepage categories: one unified sliding category section.
(function(){
  'use strict';
  const iconFor=name=>{
    const n=String(name||'').toLowerCase();
    if(n.includes('diabet'))return '🩺';
    if(n.includes('cardiac')||n.includes('heart'))return '❤️';
    if(n.includes('stomach')||n.includes('digest'))return '🧡';
    if(n.includes('liver'))return '🫀';
    if(n.includes('neuro')||n.includes('brain'))return '🧠';
    if(n.includes('pain'))return '💊';
    if(n.includes('pyret')||n.includes('fever'))return '🌡️';
    return '💊';
  };
  const descFor=name=>{
    const n=String(name||'').toLowerCase();
    if(n.includes('diabet'))return 'Diabetes care medicines';
    if(n.includes('cardiac')||n.includes('heart'))return 'Trusted heart-care medicines';
    if(n.includes('stomach')||n.includes('digest'))return 'Acidity, gas and stomach care';
    if(n.includes('liver'))return 'Support for liver health';
    if(n.includes('neuro')||n.includes('brain'))return 'Neurological care medicines';
    if(n.includes('pain'))return 'Pain relief medicines';
    if(n.includes('pyret')||n.includes('fever'))return 'Fever and temperature care';
    return 'Explore medicines in this category';
  };
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
      const all={name:'All Medicines',count:(data||[]).length,all:true};
      const items=[all,...categories];
      box.innerHTML=`<div class="category-slider-track">${items.map(c=>{
        const cat=c.all?'All':c.name;
        return `<button class="dynamic-category-card category-showcase-card" type="button" data-category="${escapeHtml(cat)}"><span class="dynamic-category-icon category-art" aria-hidden="true">${iconFor(c.name)}</span><span class="category-showcase-title">${escapeHtml(c.name)}</span><span class="category-showcase-desc">${escapeHtml(c.all?'Explore all our medicines in one place':descFor(c.name))}</span><small>${c.count} medicine${c.count===1?'':'s'}</small></button>`;
      }).join('')}</div>`;
      box.querySelectorAll('.dynamic-category-card').forEach(btn=>btn.addEventListener('click',()=>{
        if(typeof window.setCategory==='function')window.setCategory(btn.dataset.category);
        document.getElementById('productGrid')?.scrollIntoView({behavior:'smooth',block:'start'});
      }));
    }catch(err){console.error('DYNAMIC CATEGORY ERROR',err);box.innerHTML='';}
  }
  function escapeHtml(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadDynamicCategories);else loadDynamicCategories();
  window.addEventListener('medicinesReady',loadDynamicCategories);
})();