// Category navigation for dedicated medicine pages.
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
  window.addEventListener('load',function(){
    applyCategoryLinks();
    setTimeout(applyCategoryLinks,500);
    setTimeout(applyCategoryLinks,1500);
  });
  setTimeout(applyCategoryLinks,100);
  setTimeout(applyCategoryLinks,1000);
})();
