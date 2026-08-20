// Seema Medical Store - persistent multi-medicine cart
(function(){
'use strict';
const KEY='seema_cart_v4';
function save(){try{localStorage.setItem(KEY,JSON.stringify(cart.map(x=>({mid:String(x.mid),q:x.q}))));}catch(e){}}
function restore(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(a))cart=a.filter(x=>x&&x.mid).map(x=>({mid:String(x.mid),q:Math.max(1,Number(x.q)||1),i:-1}));}catch(e){}}
function idx(x){if(!x)return-1;const i=products.findIndex(p=>String(p[4]?.id)===String(x.mid));if(i>=0)x.i=i;return i}
function render(){cart=cart.filter(x=>idx(x)>=0);save();const count=cart.reduce((s,x)=>s+x.q,0);const ce=document.getElementById('cartCount'),te=document.getElementById('cartTotal'),ie=document.getElementById('cartItems');if(ce)ce.textContent=count;if(te)te.textContent='₹'+cart.reduce((s,x)=>{const i=idx(x);return s+(Number(products[i]?.[3])||0)*x.q},0).toFixed(2);if(ie)ie.innerHTML=cart.length?cart.map(x=>{const i=idx(x),p=products[i];return `<div class="cart-row"><div><strong>${p[1]}</strong><div class="small">${p[2]}</div></div><div class="qty"><button type="button" onclick="changeQtyById('${x.mid}',-1)">−</button> ${x.q} <button type="button" onclick="changeQtyById('${x.mid}',1)">+</button></div><strong>₹${((Number(p[3])||0)*x.q).toFixed(2)}</strong></div>`}).join(''):'<p class="muted">Your cart is empty.</p>';const b=document.getElementById('cartAddMoreButton');if(b)b.hidden=!cart.length}
window.changeQtyById=function(mid,d){const x=cart.find(a=>String(a.mid)===String(mid));if(!x)return;const i=idx(x),stock=Number(products[i]?.[4]?.stock||0);if(d>0&&x.q>=stock){alert('Only '+stock+' unit(s) available.');return}x.q+=d;if(x.q<=0)cart=cart.filter(a=>a!==x);render()};
window.addToCart=function(i){const m=products[i]?.[4];if(!m)return;const stock=Number(m.stock||0);if(stock<=0){alert('This medicine is currently out of stock.');return}const mid=String(m.id),x=cart.find(a=>String(a.mid)===mid);if(x){if(x.q>=stock){alert('Only '+stock+' unit(s) available.');return}x.q++}else cart.push({mid,q:1,i});render()};
window.updateCart=render;window.total=function(){return cart.reduce((s,x)=>{const i=idx(x);return s+(Number(products[i]?.[3])||0)*x.q},0)};
function bind(){document.querySelectorAll('#productGrid .product .add').forEach(b=>{if(b.dataset.bound)return;const m=(b.getAttribute('onclick')||'').match(/addToCart\((\d+)\)/);if(m){b.dataset.i=m[1];b.removeAttribute('onclick');b.dataset.bound='1'}})}
document.addEventListener('click',e=>{const b=e.target.closest?.('#productGrid .product .add');if(b){e.preventDefault();e.stopImmediatePropagation();window.addToCart(Number(b.dataset.i));return}},true);
const g=document.getElementById('productGrid');if(g)new MutationObserver(bind).observe(g,{childList:true,subtree:true});
restore();render();
const oldLoad=window.loadMedicines;if(typeof oldLoad==='function')window.loadMedicines=async function(){await oldLoad();render()};
})();
