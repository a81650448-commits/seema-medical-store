// Global cart navigation - one shared cart storage key.
(function(){
'use strict';
const KEY='seema_cart_shared_v2';
function getSavedCount(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.reduce((n,x)=>n+(Number(x.q)||0),0):0}catch(e){return 0}}
function update(){const count=getSavedCount();const e=document.getElementById('globalCartCount');if(e)e.textContent=count;const main=document.getElementById('cartCount');if(main)main.textContent=count;const cat=document.getElementById('categoryCartCount');if(cat)cat.textContent=count}
function add(){if(/admin\.html$/i.test(location.pathname)||document.getElementById('globalCartButton')||document.getElementById('categoryCartButton'))return;const b=document.createElement('a');b.id='globalCartButton';b.href='index.html#cart';b.innerHTML='🛒 Cart <span id="globalCartCount">'+getSavedCount()+'</span>';b.setAttribute('aria-label','Open cart');b.style.cssText='position:fixed;top:14px;right:18px;z-index:99999;background:#123b2a;color:#fff;text-decoration:none;border-radius:10px;padding:11px 16px;font:700 14px Inter,Arial,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.18);display:inline-flex;align-items:center;gap:7px;';document.body.appendChild(b);update()}
function openFromHash(){if(location.hash!=='#cart')return;const tryOpen=()=>{if(typeof window.openCart==='function'){window.openCart();return true}return false};if(!tryOpen())setTimeout(tryOpen,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();window.addEventListener('load',()=>{update();openFromHash()});window.addEventListener('storage',update);window.addEventListener('cartUpdated',update);setInterval(update,500);
})();