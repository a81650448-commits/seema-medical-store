// Adds the Cardiac Care category as a dedicated page without changing the existing cart/order logic.
(function(){
  function applyCardiacCategory(){
    if(typeof products==='undefined' || !document.getElementById('categoryTabs')) return;
    const cats=['All',...new Set(products.map(p=>p[0]))];
    document.getElementById('categoryTabs').innerHTML=cats.map(c=>{
      if(c==='Diabetes') return '<a class="tab" href="diabetes.html">Diabetes</a>';
      if(c==='Cardiac Care') return '<a class="tab" href="cardiac-care.html">Cardiac Care</a>';
      return `<button class="tab ${c==='All'?'active':''}" onclick="setCategory('${c.replace(/'/g,"\\'")}')">${c}</button>`;
    }).join('');
  }
  window.addEventListener('load',function(){
    applyCardiacCategory();
    setTimeout(applyCardiacCategory,500);
    setTimeout(applyCardiacCategory,1500);
  });
  setTimeout(applyCardiacCategory,100);
  setTimeout(applyCardiacCategory,1000);
})();
