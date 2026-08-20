// Dedicated-page category routing for Seema Medical Store.
// Safe version: does not replace buildCategories and does not use observers.
(function(){
  function linkDedicatedCategories(){
    const tabs=document.getElementById('categoryTabs');
    if(!tabs) return;
    tabs.querySelectorAll('.tab').forEach(function(tab){
      const name=(tab.textContent||'').trim();
      const href={'All':'all-medicines.html','Diabetes':'diabetes.html','Cardiac Care':'cardiac-care.html','Stomach Care':'stomach-care.html','Liver Care':'liver-care.html'}[name];
      if(!href || tab.tagName==='A') return;
      const a=document.createElement('a');
      a.className=tab.className;
      a.href=href;
      a.textContent=name;
      tab.replaceWith(a);
    });
  }
  window.addEventListener('load',function(){
    linkDedicatedCategories();
    setTimeout(linkDedicatedCategories,800);
    setTimeout(linkDedicatedCategories,2000);
  });
})();
