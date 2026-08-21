(function(){
'use strict';
function openCartPanel(){const o=document.getElementById('cartOverlay');if(!o)return false;o.classList.add('open');o.style.display='flex';o.setAttribute('aria-hidden','false');if(typeof window.updateCart==='function')window.updateCart();return true;}
window.openCartPanel=openCartPanel;
function bind(){document.querySelectorAll('.cart-btn,[data-open-cart],#globalCartButton').forEach(function(b){if(b.dataset.cartBound)return;b.dataset.cartBound='1';b.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();openCartPanel();},true);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();window.addEventListener('load',bind);setTimeout(bind,500);setTimeout(bind,1500);
})();