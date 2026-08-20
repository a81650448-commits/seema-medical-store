// Dedicated-page category routing for Seema Medical Store.
// Keep this file side-effect-free: no MutationObserver and no repeated timers.
(function(){
  function renderCategoryLinks(){
    const tabs=document.getElementById('categoryTabs');
    if(!tabs || !Array.isArray(window.products)) return;
    const cats=['All',...new Set(window.products.map(p=>p[0]))];
    tabs.innerHTML=cats.map(function(c){
      if(c==='Diabetes') return '<a class="tab" href="diabetes.html">Diabetes</a>';
      if(c==='Cardiac Care') return '<a class="tab" href="cardiac-care.html">Cardiac Care</a>';
      if(c==='Stomach Care') return '<a class="tab" href="stomach-care.html">Stomach Care</a>';
      if(c==='Liver Care') return '<a class="tab" href="liver-care.html">Liver Care</a>';
      return '<button class="tab '+(c==='All'?'active':'')+'" onclick="setCategory(\''+String(c).replace(/'/g,"\\'")+'\')">'+c+'</button>';
    }).join('');
  }
  // script.js calls buildCategories() after Supabase medicines load.
  window.buildCategories=renderCategoryLinks;
})();
