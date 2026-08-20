(function(){
  function refreshInventory(){
    if(typeof loadMedicines==='function') return loadMedicines();
    const body=document.getElementById('inventoryBody');
    if(body) body.innerHTML='<div class="card"><b>Inventory loader unavailable.</b><br><button class="btn primary" onclick="location.reload()">Reload Admin Panel</button></div>';
  }

  function setupInventorySearch(){
    const section=document.getElementById('inventory');
    const body=document.getElementById('inventoryBody');
    if(!section||!body)return;

    let input=document.getElementById('inventorySearch');
    if(!input){
      input=document.createElement('input');
      input.id='inventorySearch';
      input.className='input search';
      input.placeholder='Search inventory by medicine, category or status';
      input.setAttribute('autocomplete','off');
      const card=body.closest('.card');
      if(card) card.insertBefore(input,card.querySelector('p')?.nextSibling||body);
      else section.insertBefore(input,body);
    }

    const apply=()=>{
      const q=(input.value||'').trim().toLowerCase();
      Array.from(body.children).forEach(card=>{
        if(!card.classList.contains('card'))return;
        card.style.display=!q||card.textContent.toLowerCase().includes(q)?'':'none';
      });
    };

    if(!input.dataset.searchReady){
      input.addEventListener('input',apply);
      input.dataset.searchReady='1';
    }
    apply();

    if(!body.dataset.searchObserver){
      const observer=new MutationObserver(apply);
      observer.observe(body,{childList:true});
      body.dataset.searchObserver='1';
    }
  }

  window.addEventListener('load',function(){
    setupInventorySearch();
    document.querySelectorAll('.side button[data-section="inventory"]').forEach(function(btn){
      btn.addEventListener('click',function(){
        refreshInventory();
        setTimeout(setupInventorySearch,100);
      });
    });
    setTimeout(setupInventorySearch,300);
  });
})();
