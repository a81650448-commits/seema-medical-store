// Seema Medical Store - Homepage search for categories + medicines
(function(){
'use strict';
function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
function setup(){
 const input=document.getElementById('homepageSearch'),results=document.getElementById('homepageSearchResults');
 if(!input||!results)return;
 input.addEventListener('input',function(){
  const q=input.value.trim().toLowerCase();
  if(!q){results.hidden=true;results.innerHTML='';return;}
  const rows=Array.isArray(window.products)?window.products:[];
  const categories=[...new Map(rows.map(p=>String(p?.[0]||'').trim()).filter(Boolean).map(c=>[c.toLowerCase(),c])).values()];
  const catMatches=categories.filter(c=>c.toLowerCase().includes(q)).slice(0,6);
  const medMatches=rows.filter(p=>String(p?.[1]||'').toLowerCase().includes(q)).slice(0,10);
  let html='';
  if(catMatches.length){html+='<div class="home-search-group"><strong>Categories</strong>'+catMatches.map(c=>`<button type="button" class="home-search-result category-result" data-category="${esc(c)}">📁 ${esc(c)}<span>Open category →</span></button>`).join('')+'</div>';}
  if(medMatches.length){html+='<div class="home-search-group"><strong>Medicines</strong>'+medMatches.map(p=>{const i=rows.indexOf(p),stock=Number(p?.[4]?.stock??0);return `<div class="home-search-result medicine-result"><div><b>${esc(p[1])}</b><small>${esc(p[0])} · ${stock>0?'Stock: '+stock:'Out of stock'}</small></div><div><strong>₹${Number(p[3]||0).toFixed(2)}</strong><button type="button" class="home-search-add" data-index="${i}" ${stock<=0?'disabled':''}>${stock>0?'Add':'Out'}</button></div></div>`}).join('')+'</div>';}
  if(!html)html='<div class="home-search-empty">No category or medicine found.</div>';
  results.innerHTML=html;results.hidden=false;
  results.querySelectorAll('.category-result').forEach(b=>b.addEventListener('click',()=>window.location.href='category.html?category='+encodeURIComponent(b.dataset.category)));
  results.querySelectorAll('.home-search-add').forEach(b=>b.addEventListener('click',()=>{if(typeof window.addToCart==='function')window.addToCart(Number(b.dataset.index));}));
 });
 input.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';results.hidden=true;results.innerHTML='';input.blur();}});
 document.addEventListener('click',e=>{if(!e.target.closest('.homepage-search-wrap'))results.hidden=true;});
 window.addEventListener('medicinesReady',()=>{if(input.value.trim())input.dispatchEvent(new Event('input'));});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();