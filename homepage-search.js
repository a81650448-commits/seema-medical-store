// Aditya Medical Store - reliable homepage medicine search
(function(){
'use strict';
function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
function norm(v){return String(v??'').toLowerCase().trim();}
let searchRows=[];

async function getRows(){
  if(Array.isArray(window.products)&&window.products.length)return window.products;
  try{
    if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY)return [];
    const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
    const {data,error}=await db.from('medicines').select('id,name,category,price,stock,manufacturer,expiry_date').order('name');
    if(error)throw error;
    return (data||[]).map(m=>[String(m.category||'Other'),m.name,'Available stock: '+(m.stock??0),Number(m.price)||0,m]);
  }catch(error){console.error('HOMEPAGE SEARCH ERROR',error);return []}
}

async function setup(){
 const input=document.getElementById('homepageSearch'),results=document.getElementById('homepageSearchResults');
 if(!input||!results)return;
 async function run(){
   const q=norm(input.value);
   if(!q){results.hidden=true;results.innerHTML='';return;}
   searchRows=await getRows();
   const categories=[...new Map(searchRows.map(p=>String(p?.[0]||'').trim()).filter(Boolean).map(c=>[norm(c),c])).values()];
   const catMatches=categories.filter(c=>norm(c).includes(q)).slice(0,6);
   const medMatches=searchRows.filter(p=>norm(p?.[1]).includes(q)||norm(p?.[0]).includes(q)||norm(p?.[4]?.manufacturer).includes(q)).slice(0,12);
   let html='';
   if(catMatches.length)html+='<div class="home-search-group"><strong>Categories</strong>'+catMatches.map(c=>`<button type="button" class="home-search-result category-result" data-category="${esc(c)}">📁 ${esc(c)}<span>Open category →</span></button>`).join('')+'</div>';
   if(medMatches.length)html+='<div class="home-search-group"><strong>Medicines</strong>'+medMatches.map(p=>{const i=searchRows.indexOf(p),stock=Number(p?.[4]?.stock??0);return `<div class="home-search-result medicine-result"><div><b>${esc(p[1])}</b><small>${esc(p[0])}${p?.[4]?.manufacturer?' · '+esc(p[4].manufacturer):''} · ${stock>0?'Stock: '+stock:'Out of stock'}</small></div><div><strong>₹${Number(p[3]||0).toFixed(2)}</strong><button type="button" class="home-search-add" data-index="${i}" ${stock<=0?'disabled':''}>${stock>0?'Add':'Out'}</button></div></div>`}).join('')+'</div>';
   if(!html)html='<div class="home-search-empty">No category or medicine found.</div>';
   results.innerHTML=html;results.hidden=false;
   results.querySelectorAll('.category-result').forEach(b=>b.addEventListener('click',()=>window.location.href='category.html?category='+encodeURIComponent(b.dataset.category)));
   results.querySelectorAll('.home-search-add').forEach(b=>b.addEventListener('click',()=>{const row=searchRows[Number(b.dataset.index)];const products=window.products||[];const same=products.findIndex(p=>String(p?.[4]?.id)===String(row?.[4]?.id));if(typeof window.addToCart==='function')window.addToCart(same>=0?same:Number(b.dataset.index));}));
 }
 input.addEventListener('input',run);
 input.addEventListener('search',run);
 input.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';results.hidden=true;results.innerHTML='';input.blur();}if(e.key==='Enter'){e.preventDefault();run();}});
 document.addEventListener('click',e=>{if(!e.target.closest('.homepage-search-wrap'))results.hidden=true;});
 window.addEventListener('medicinesReady',()=>{if(input.value.trim())run();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();