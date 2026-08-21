// Seema Medical Store - SINGLE SHARED CART v15
(function(){
'use strict';
const KEY='seema_cart_shared_v2';
let pending=[];
function productIndexById(id){return Array.isArray(window.products)?products.findIndex(p=>String(p?.[4]?.id)===String(id)):-1;}
function validProduct(i){return Number.isInteger(Number(i))&&Array.isArray(window.products)&&!!products[Number(i)]&&products[Number(i)][4]?.id!=null;}
function readStored(){try{const raw=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(raw)?raw:[]}catch(e){console.error('CART READ ERROR',e);return[]}}
function saveCart(){try{
  const out=[];
  const seen=new Set();
  if(Array.isArray(pending)) pending.forEach(x=>{if(x&&x.id!=null&&!seen.has(String(x.id))){out.push({id:x.id,q:Math.max(1,Number(x.q)||1)});seen.add(String(x.id));}});
  if(Array.isArray(cart)) cart.forEach(x=>{if(validProduct(x.i)){const id=products[x.i][4].id;if(!seen.has(String(id))){out.push({id,q:Math.max(1,Number(x.q)||1)});seen.add(String(id));}}});
  if(out.length||localStorage.getItem(KEY)!==null)localStorage.setItem(KEY,JSON.stringify(out));
}catch(e){console.error('CART SAVE ERROR',e)}}
function loadCart(){try{
  if(!Array.isArray(window.products)||products.length===0)return false;
  const raw=readStored(), restored=[], unresolved=[];
  for(const x of raw){
    if(!x||x.id==null)continue;
    const i=productIndexById(x.id);
    if(i<0){unresolved.push({id:x.id,q:Math.max(1,Number(x.q)||1)});continue;}
    const stock=Number(products[i][4]?.stock??0);
    if(stock<=0)continue;
    restored.push({i,q:Math.min(Math.max(1,Number(x.q)||1),stock)});
  }
  cart.length=0;restored.forEach(x=>cart.push(x));pending=unresolved;
  return true;
}catch(e){console.error('CART LOAD ERROR',e);return false}}
function renderCart(){
  let count=0,totalAmount=0;
  const rows=(Array.isArray(cart)?cart:[]).map(x=>{
    if(!validProduct(x.i))return '';
    const p=products[x.i],price=Number(p[3])||0,q=Math.max(1,Number(x.q)||1);
    count+=q;totalAmount+=price*q;
    return `<div class="cart-row"><div><strong>${p[1]}</strong><div class="small">${p[2]}</div></div><div class="qty"><button type="button" onclick="changeQty(${x.i},-1)">−</button> <span>${q}</span> <button type="button" onclick="changeQty(${x.i},1)">+</button></div><strong>₹${(price*q).toFixed(2)}</strong></div>`;
  }).join('');
  const countEl=document.getElementById('cartCount');if(countEl)countEl.textContent=count;
  const totalEl=document.getElementById('cartTotal');if(totalEl)totalEl.textContent='₹'+totalAmount.toFixed(2);
  const items=document.getElementById('cartItems');if(items)items.innerHTML=rows||"<p class='muted'>Your cart is empty.</p>";
  const more=document.getElementById('cartAddMoreButton');if(more)more.hidden=!cart.length;
  saveCart();window.dispatchEvent(new Event('cartUpdated'));
}
window.reloadCartFromStorage=function(){if(loadCart())renderCart();};
window.addToCart=function(i){
  i=Number(i);if(!validProduct(i))return;
  const stock=Number(products[i][4]?.stock??0);if(stock<=0){alert('This medicine is currently out of stock.');return;}
  const existing=cart.find(x=>Number(x.i)===i);
  if(existing){if(existing.q>=stock){alert('Only '+stock+' unit(s) available.');return;}existing.q+=1;}
  else cart.push({i:i,q:1});
  renderCart();
};
window.changeQty=function(i,d){
  i=Number(i);const existing=cart.find(x=>Number(x.i)===i);if(!existing)return;
  const stock=Number(products[i]?.[4]?.stock??0);
  if(d>0&&existing.q>=stock){alert('Only '+stock+' unit(s) available.');return;}
  existing.q+=Number(d);if(existing.q<=0)cart.splice(cart.indexOf(existing),1);renderCart();
};
window.updateCart=renderCart;
window.total=function(){return cart.reduce((s,x)=>s+(Number(products[x.i]?.[3])||0)*x.q,0)};
window.addMoreMedicines=function(){document.getElementById('cartOverlay')?.classList.remove('open');document.getElementById('products')?.scrollIntoView({behavior:'smooth',block:'start'});};
function syncWhenReady(){
  if(!Array.isArray(window.products)||!products.length)return;
  loadCart();
  renderCart();
}
window.addEventListener('medicinesReady',syncWhenReady);
window.addEventListener('pageshow',syncWhenReady);
window.addEventListener('beforeunload',saveCart);
setTimeout(syncWhenReady,0);setTimeout(syncWhenReady,250);setTimeout(syncWhenReady,1000);
})();
