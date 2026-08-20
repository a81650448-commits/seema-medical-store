// Dedicated-page navigation for medicine categories.
// Keep this lightweight: do NOT observe categoryTabs mutations because
// changing innerHTML would trigger the observer again and freeze the page.
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

  // Supabase medicines load asynchronously, so apply once after the page loads
  // and a few times while the initial data request completes.
  window.addEventListener('load',applyCategoryLinks);
  [300,1000,2000].forEach(ms=>setTimeout(applyCategoryLinks,ms));
})();
