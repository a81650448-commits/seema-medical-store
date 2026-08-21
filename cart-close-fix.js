(function(){
'use strict';
function closeCartPanel(){
 const o=document.getElementById('cartOverlay');
 if(!o)return false;
 o.classList.remove('open');
 o.style.removeProperty('display');
 o.setAttribute('aria-hidden','true');
 return true;
}
window.closeCartPanel=closeCartPanel;
function bind(){
 const overlay=document.getElementById('cartOverlay');
 if(!overlay)return;
 overlay.querySelectorAll('.close').forEach(function(b){if(b.dataset.closeBound)return;b.dataset.closeBound='1';b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();closeCartPanel();},true)});
 overlay.addEventListener('click',function(e){if(e.target===overlay)closeCartPanel()},true);
 document.addEventListener('keydown',function(e){if(e.key==='Escape')closeCartPanel()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
window.addEventListener('load',bind);setTimeout(bind,500);
})();