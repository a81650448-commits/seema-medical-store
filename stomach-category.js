// Adds the Stomach Care category as a dedicated page without changing existing cart/order logic.
(function(){
  function applyStomachCategory(){
    if(typeof products==='undefined' || !document.getElementById('categoryTabs')) return;
    const cats=['All',...new Set(products.map(p=>p[0]))];
    document.getElementById('categoryTabs').innerHTML=cats.map(c=>{
      if(c==='Diabetes') return '<a class="tab" href="diabetes.html">Diabetes</a>';
      if(c==='Cardiac Care') return '<a class="tab" href="cardiac-care.html">Cardiac Care</a>';
      if(c==='Stomach Care') return '<a class="tab" href="stomach-care.html">Stomach Care</a>';
      return `<button class="tab ${c==='All'?'active':''}" onclick="setCategory('${c.replace(/'/g,"\\'")}')">${c}</button>`;
    }).join('');
  }
  window.addEventListener('load',function(){
    applyStomachCategory();
    setTimeout(applyStomachCategory,500);
    setTimeout(applyStomachCategory,1500);
  });
  setTimeout(applyStomachCategory,100);
  setTimeout(applyStomachCategory,1000);
})();
