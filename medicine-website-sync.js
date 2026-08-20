// Seema Medical Store - keep customer medicine cards visibly synced with the shared database.
(function(){
  'use strict';
  function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
  function apply(){
    if(!Array.isArray(window.products)||!window.products.length)return false;
    const cards=document.querySelectorAll('#productGrid .product');
    if(!cards.length)return false;
    cards.forEach((card,i)=>{
      const m=window.products[i]?.[4];if(!m)return;
      const old=card.querySelector('.medicine-expiry');if(old)old.remove();
      if(m.expiry_date){const p=document.createElement('p');p.className='small medicine-expiry';p.textContent='Expiry: '+m.expiry_date;card.insertBefore(p,card.querySelector('.product-bottom'));}
    });
    return true;
  }
  let tries=0;const timer=setInterval(()=>{tries++;if(apply()||tries>30)clearInterval(timer);},500);
  window.addEventListener('load',()=>setTimeout(apply,300));
})();