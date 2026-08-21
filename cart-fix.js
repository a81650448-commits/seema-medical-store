// Seema Medical Store - SINGLE SHARED CART v9
// Uses the existing global `cart` from script.js as the ONLY cart state.
// This prevents the old and new cart systems from overwriting each other.
(function(){
'use strict';
const KEY='seema_cart_shared_v1';

function validProduct(i){return Number.isInteger(Number(i))&&products[Number(i)]&&products[Number(i)][4]?.id!=null;}
function saveCart(){try{localStorage.setItem(KEY,JSON.stringify(cart));}catch(e){}}
function loadCart(){try{const saved=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(saved))return;cart.length=0;saved.forEach(x=>{const i=Number(x.i),q=Math.max(1,Number(x.q)||1);if(validProduct(i)&&Number(products[i][4]?.stock??0)>0)cart.push({i,q:Math.min(q,Number(products[i][4]?.stock??0))});});}catch(e){}}
function renderCart(){
  let count=0,totalAmount=0;
  const rows=cart.map(x=>{const p=products[x.i];if(!p)return '';const price=Number(p[3])||0;count+=x.q;totalAmount+=price*x.q;return `<div class="cart-row"><div><strong>${p[1]}</strong><div class="small">${p[2]}</div></div><div class="qty"><button type="button" onclick="changeQty(${x.i},-1)">−</button> <span>${x.q}</span> <button type="button" onclick="changeQty(${x.i},1)">+</button></div><strong>₹${(price*x.q).toFixed(2)}</strong></div>`;}).join('');
  const countEl=document.getElementById('cartCount');if(countEl)countEl.textContent=count;
  const totalEl=document.getElementById('cartTotal');if(totalEl)totalEl.textContent='₹'+totalAmount.toFixed(2);
  const items=document.getElementById('cartItems');if(items)items.innerHTML=rows||"<p class='muted'>Your cart is empty.</p>";
  const more=document.getElementById('cartAddMoreButton');if(more)more.hidden=cart.length===0;
  saveCart();
}

// Replace the original single/competing cart handlers with handlers using the shared `cart` array.
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
  existing.q+=Number(d);if(existing.q<=0)cart.splice(cart.indexOf(existing),1);
  renderCart();
};
window.updateCart=renderCart;
window.total=function(){return cart.reduce((s,x)=>s+(Number(products[x.i]?.[3])||0)*x.q,0)};

// Keep the existing checkout/order implementation, but make sure it sees the shared cart.
window.addMoreMedicines=function(){
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.getElementById('products')?.scrollIntoView({behavior:'smooth',block:'start'});
};

// Load any cart saved before refresh, after medicines have been fetched.
const originalLoad=window.loadMedicines;
if(typeof originalLoad==='function'){
  window.loadMedicines=async function(){const result=await originalLoad.apply(this,arguments);loadCart();renderCart();return result;};
}

window.addEventListener('load',function(){loadCart();renderCart();});

// Re-render after product-grid changes without creating another cart state.
const grid=document.getElementById('productGrid');
if(grid)new MutationObserver(function(){renderCart();}).observe(grid,{childList:true,subtree:true});

// Initial render is harmless even before Supabase products arrive.
renderCart();
})();