(function(){
  function refreshInventory(){
    if(typeof loadMedicines==='function') return loadMedicines();
    const body=document.getElementById('inventoryBody');
    if(body) body.innerHTML='<div class="card"><b>Inventory loader unavailable.</b><br><button class="btn primary" onclick="location.reload()">Reload Admin Panel</button></div>';
  }
  window.addEventListener('load',function(){
    document.querySelectorAll('.side button[data-section="inventory"]').forEach(function(btn){
      btn.addEventListener('click',refreshInventory);
    });
  });
})();
