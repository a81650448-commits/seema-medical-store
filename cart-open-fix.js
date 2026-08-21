(function(){
'use strict';
function openCartPanel(){
 const o=document.getElementById('cartOverlay');
 if(!o)return false;
 /* Restore the persisted cart BEFORE rendering. The counter can come from
    localStorage even when the in-memory cart array is temporarily empty. */
 if(typeof window.reloadCartFromStorage==='function') window.reloadCartFromStorage();
 else if(typeof window.updateCart==='function') window.updateCart();
 o.classList.add('open');
 o.style.display='flex';
 o.setAttribute('aria-hidden','false');
 return true;
}
window.openCartPanel=openCartPanel;
function bind(){
 document.querySelectorAll('.cart-btn,[data-open-cart],#globalCartButton').forEach(function(b){
  if(b.dataset.cartBound)return;
  b.dataset.cartBound='1';
  b.addEventListener('click',function(e){
   if(b.getAttribute('href')&&b.getAttribute('href').includes('#cart'))return;
   e.preventDefault();e.stopImmediatePropagation();openCartPanel();
  },true);
 });
 if(location.hash==='#cart'){setTimeout(openCartPanel,200);setTimeout(openCartPanel,900);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
window.addEventListener('load',bind);
window.addEventListener('hashchange',bind);
setTimeout(bind,500);setTimeout(bind,1500);
})();