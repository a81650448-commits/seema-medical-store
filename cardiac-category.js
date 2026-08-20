// Dedicated-page navigation for medicine categories.
// Liver Care must open its own page, just like Diabetes, Cardiac Care and Stomach Care.
(function(){
  function applyCategoryLinks(){
    if(typeof products==='undefined' || !document.getElementById('categoryTabs')) return;
    const cats=['All',...new Set(products.map(p=>p[0]))];
    document.getElementById('categoryTabs').innerHTML=cats.map(c=>{
      if(c==='Diabetes') return '<a class="tab" href="diabetes.html">Diabetes</a>';
      if(c==='Cardiac Care') return '<a class="tab" href="cardiac-care.html">Cardiac Care</a>';
      if(c==='Stomach Care') return '<a class="tab" href="stomach-care.html">Stomach Care</a>';
      if(c==='Liver Care') return '<a class="tab" href="liver-care.html">Liver Care</a>';
      return `<button class="tab ${c==='All'?'active':''}" onclick="setCategory('${c.replace(/'/g,"\\'")}')">${c}</button>`;
    }).join('');
  }
  // Re-apply after Supabase finishes loading medicines and after any later render.
  window.addEventListener('load',applyCategoryLinks);
  [100,500,1000,2000,3000,5000].forEach(ms=>setTimeout(applyCategoryLinks,ms));
  const tabs=document.getElementById('categoryTabs');
  if(tabs){new MutationObserver(applyCategoryLinks).observe(tabs,{childList:true,subtree:true});}
})();
