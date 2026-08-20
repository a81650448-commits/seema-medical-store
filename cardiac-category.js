// Dedicated-page category routing for Seema Medical Store.
// Homepage only: categories open their dedicated pages; medicines never render on the homepage.
(function(){
  const categoryPages={
    'All':'all-medicines.html',
    'Diabetes':'diabetes.html',
    'Cardiac Care':'cardiac-care.html',
    'Stomach Care':'stomach-care.html',
    'Liver Care':'liver-care.html'
  };

  function hideHomepageMedicines(){
    const grid=document.getElementById('productGrid');
    if(!grid) return;
    grid.innerHTML='';
    grid.style.display='none';
  }

  function linkDedicatedCategories(){
    const tabs=document.getElementById('categoryTabs');
    if(!tabs) return;
    tabs.querySelectorAll('.tab').forEach(function(tab){
      const name=(tab.textContent||'').trim();
      const href=categoryPages[name];
      if(!href || tab.tagName==='A') return;
      const a=document.createElement('a');
      a.className=tab.className;
      a.href=href;
      a.textContent=name;
      a.setAttribute('aria-label','Open '+name+' medicines');
      tab.replaceWith(a);
    });
  }

  // Prevent the homepage's normal product renderer from putting medicines back.
  window.renderProducts=function(){
    hideHomepageMedicines();
    linkDedicatedCategories();
  };

  function applyHomepageCategoryMode(){
    hideHomepageMedicines();
    linkDedicatedCategories();
  }

  applyHomepageCategoryMode();
  window.addEventListener('DOMContentLoaded',applyHomepageCategoryMode);
  window.addEventListener('load',applyHomepageCategoryMode);
  setTimeout(applyHomepageCategoryMode,300);
  setTimeout(applyHomepageCategoryMode,1000);
  setTimeout(applyHomepageCategoryMode,2000);
})();
