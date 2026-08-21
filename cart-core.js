// Seema Medical Store - SINGLE CART BRIDGE v6
// IMPORTANT: this file does not create a second cart or replace the cart data model.
// It safely uses the original cart maintained by script.js.
(function(){
  'use strict';

  function install(){
    const add=window.addToCart;
    const change=window.changeQty;
    const update=window.updateCart;
    const total=window.total;

    // If script.js has not loaded yet, wait instead of creating a competing cart.
    if(typeof add!=='function' || typeof change!=='function' || typeof update!=='function' || typeof total!=='function'){
      setTimeout(install,100);
      return;
    }

    if(window.__seemaCartBridgeInstalled)return;
    window.__seemaCartBridgeInstalled=true;

    // Keep the existing, working cart implementation as the single source of truth.
    window.addToCart=function(index){
      add.call(window,index);
      update.call(window);
    };

    window.changeQty=function(index,direction){
      change.call(window,index,direction);
      update.call(window);
    };

    window.updateCart=function(){
      update.call(window);
    };

    window.total=function(){
      return total.call(window);
    };

    // Add More Medicines is available only when the cart contains products.
    window.addMoreMedicines=function(){
      const overlay=document.getElementById('cartOverlay');
      if(overlay)overlay.classList.remove('open');
      const products=document.getElementById('products');
      if(products)products.scrollIntoView({behavior:'smooth',block:'start'});
    };

    // Re-render after medicine data arrives, without replacing the existing cart.
    const grid=document.getElementById('productGrid');
    if(grid){
      new MutationObserver(function(){
        try{update.call(window)}catch(e){}
      }).observe(grid,{childList:true,subtree:true});
    }

    try{update.call(window)}catch(e){}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);
  else install();
})();
