// Seema Medical Store - MULTI MEDICINE CART FIX v8
(function(){
'use strict';
const KEY='seema_cart_final_v3';
let seemaCart=[];
function productsList(){try{return Array.isArray(products)?products:[]}catch(e){return[]}}
function productIndex(id){return productsList().findIndex(p=>String(p?.[4]?.id)===String(id))}
function readSaved(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.filter(x=>x&&x.id).map(x=>({id:String(x.id),q:Math.max(1,Number(x.q)||1)})):[]}catch(e){return[]}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(seemaCart));}catch(e){}}
function importOldCart(){try{const ps=productsList();if(!Array.isArray(cart)||!cart.length)return;for(const x of cart){const p=ps[x.i];const id=p?.[4]?.id;if(id==null)continue;const old=seemaCart.find(a=>a.id===String(id));const q=Math.max(1,Number(x.q)||1);if(old)old.q=Math.max(old.q,q);else seemaCart.push({id:String(id),q});}cart.length=0;}catch(e){}}
function syncLegacyCart(){try{const ps=productsList();cart.length=0;for(const x of seemaCart){const i=ps.findIndex(p=>String(p?.[4]?.id)===String(x.id));if(i>=0)cart.push({i,q:x.q});}}catch(e){}}
function cleanCart(){seemaCart=seemaCart.filter(x=>productIndex(x.id)>=0&&Number(productsList()[productIndex(x.id)]?.[4]?.stock??0)>0);}
function render(){
  importOldCart();cleanCart();save();syncLegacyCart();
  const ps=productsList();let count=0,total=0;
  const html=seemaCart.map(x=>{const i=productIndex(x.id),p=ps[i];if(!p)return'';const price=Number(p[3])||0;count+=x.q;total+=price*x.q;return `<div class="cart-row"><div><strong>${p[1]}</strong><div class="small">${p[2]}</div></div><div class="qty"><button type="button" data-seema-cart="minus" data-id="${x.id}">−</button> <span>${x.q}</span> <button type="button" data-seema-cart="plus" data-id="${x.id}">+</button></div><strong>₹${(price*x.q).toFixed(2)}</strong></div>`}).join('');
  const c=document.getElementById('cartCount'),t=document.getElementById('cartTotal'),box=document.getElementById('cartItems'),more=document.getElementById('cartAddMoreButton');
  if(c)c.textContent=count;if(t)t.textContent='₹'+total.toFixed(2);if(box)box.innerHTML=html||"<p class='muted'>Your cart is empty.</p>";if(more)more.hidden=seemaCart.length===0;
}
function add(id){
  const ps=productsList(),i=productIndex(id);if(i<0)return;const m=ps[i][4],stock=Number(m?.stock??0);if(stock<=0){alert('This medicine is currently out of stock.');return}
  const key=String(id),x=seemaCart.find(a=>a.id===key);if(x){if(x.q>=stock){alert('Only '+stock+' unit(s) available.');return}x.q++;}else{seemaCart.push({id:key,q:1});}
  save();render();
}
function quantity(id,d){const key=String(id),x=seemaCart.find(a=>a.id===key);if(!x)return;const i=productIndex(id),stock=Number(productsList()[i]?.[4]?.stock??0);if(d>0&&x.q>=stock){alert('Only '+stock+' unit(s) available.');return}x.q+=d;if(x.q<=0)seemaCart=seemaCart.filter(a=>a.id!==key);save();render()}
function total(){return seemaCart.reduce((s,x)=>{const p=productsList()[productIndex(x.id)];return s+(Number(p?.[3])||0)*x.q},0)}
function bindAddButtons(){document.querySelectorAll('#productGrid .product .add').forEach(b=>{if(b.dataset.seemaBound==='1')return;const m=(b.getAttribute('onclick')||'').match(/addToCart\((\d+)\)/);if(!m)return;const p=productsList()[Number(m[1])];if(!p?.[4]?.id)return;b.dataset.seemaId=String(p[4].id);b.dataset.seemaBound='1';b.removeAttribute('onclick');});}
document.addEventListener('click',function(e){const b=e.target.closest?.('#productGrid .product .add');if(b?.dataset.seemaId){e.preventDefault();e.stopImmediatePropagation();add(b.dataset.seemaId);return}const q=e.target.closest?.('[data-seema-cart]');if(q){e.preventDefault();e.stopImmediatePropagation();quantity(q.dataset.id,q.dataset.seemaCart==='plus'?1:-1);}},true);
window.addToCart=function(i){const p=productsList()[Number(i)];if(p?.[4]?.id)add(p[4].id)};
window.changeQty=function(i,d){const p=productsList()[Number(i)];if(p?.[4]?.id)quantity(p[4].id,d)};
window.updateCart=render;window.total=total;
window.addMoreMedicines=function(){document.getElementById('cartOverlay')?.classList.remove('open');document.getElementById('products')?.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(bindAddButtons,50)};
window.openCheckout=function(){render();if(!seemaCart.length){alert('Please add at least one product.');return}document.getElementById('cartOverlay')?.classList.remove('open');if(typeof resetCheckoutForm==='function')resetCheckoutForm();const ps=productsList(),items=document.getElementById('checkoutItems');if(items)items.innerHTML=seemaCart.map(x=>{const p=ps[productIndex(x.id)];return `<div class="summary-line"><span>${p[1]} × ${x.q}</span><span>₹${((Number(p[3])||0)*x.q).toFixed(2)}</span></div>`}).join('');const ct=document.getElementById('checkoutTotal');if(ct)ct.textContent='₹'+total().toFixed(2);if(typeof togglePaymentFields==='function')togglePaymentFields();if(typeof updateUpiLink==='function')updateUpiLink();document.getElementById('checkoutOverlay')?.classList.add('open')};
seemaCart=readSaved();
window.addEventListener('load',function(){importOldCart();render();bindAddButtons()});
const grid=document.getElementById('productGrid');if(grid)new MutationObserver(function(){bindAddButtons()}).observe(grid,{childList:true,subtree:true});
setInterval(function(){try{syncLegacyCart()}catch(e){}},300);
render();
})();