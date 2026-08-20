// Seema Medical Store - NEW CART SYSTEM
// This is the single cart implementation. The previous cart-fix.js is no longer used.
(function(){
  'use strict';
  const KEY='seema_cart_final_v1';
  const getProducts=()=>Array.isArray(window.products)?window.products:[];
  function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x.filter(a=>a&&a.id).map(a=>({id:String(a.id),q:Math.max(1,Number(a.q)||1)})):[]}catch(e){return[]}}
  function write(){try{localStorage.setItem(KEY,JSON.stringify(cart.map(a=>({id:String(a.id),q:a.q}))));}catch(e){}}
  function find(id){return getProducts().findIndex(p=>String(p[4]?.id)===String(id))}
  function normalize(){cart=cart.filter(a=>find(a.id)>=0);write()}
  function render(){
    normalize();
    const count=cart.reduce((s,a)=>s+a.q,0);
    let amount=0;
    const rows=cart.map(a=>{const i=find(a.id),p=getProducts()[i];const price=Number(p[3])||0;amount+=price*a.q;return `<div class="cart-row"><div><strong>${p[1]}</strong><div class="small">${p[2]}</div></div><div class="qty"><button type="button" data-newcart="minus" data-id="${a.id}">−</button> ${a.q} <button type="button" data-newcart="plus" data-id="${a.id}">+</button></div><strong>₹${(price*a.q).toFixed(2)}</strong></div>`}).join('');
    const c=document.getElementById('cartCount'),t=document.getElementById('cartTotal'),box=document.getElementById('cartItems');
    if(c)c.textContent=count;if(t)t.textContent='₹'+amount.toFixed(2);if(box)box.innerHTML=rows||"<p class='muted'>Your cart is empty.</p>";
    const more=document.getElementById('cartAddMoreButton');if(more)more.hidden=cart.length===0;
  }
  function add(id){
    const i=find(id);if(i<0)return;const p=getProducts()[i],stock=Number(p[4]?.stock??0);if(stock<=0){alert('This medicine is currently out of stock.');return}
    const a=cart.find(x=>String(x.id)===String(id));if(a){if(a.q>=stock){alert('Only '+stock+' unit(s) available.');return}a.q++}else cart.push({id:String(id),q:1});write();render();
  }
  function qty(id,d){const a=cart.find(x=>String(x.id)===String(id));if(!a)return;const i=find(id),stock=Number(getProducts()[i]?.[4]?.stock??0);if(d>0&&a.q>=stock){alert('Only '+stock+' unit(s) available.');return}a.q+=d;if(a.q<=0)cart=cart.filter(x=>x!==a);write();render()}
  function total(){normalize();return cart.reduce((s,a)=>{const i=find(a.id);return s+(Number(getProducts()[i]?.[3])||0)*a.q},0)}
  function bind(){document.querySelectorAll('#productGrid .product .add').forEach(b=>{if(b.dataset.newcartBound)return;const m=(b.getAttribute('onclick')||'').match(/addToCart\((\d+)\)/);if(!m)return;const i=Number(m[1]),p=getProducts()[i];if(!p)return;b.removeAttribute('onclick');b.dataset.newcartId=String(p[4].id);b.dataset.newcartBound='1'})}
  document.addEventListener('click',function(e){const b=e.target.closest?.('#productGrid .product .add');if(b&&b.dataset.newcartId){e.preventDefault();e.stopImmediatePropagation();add(b.dataset.newcartId);return}const q=e.target.closest?.('[data-newcart]');if(q){e.preventDefault();e.stopImmediatePropagation();qty(q.dataset.id,q.dataset.newcart==='plus'?1:-1)}},true);
  window.addToCart=function(i){const p=getProducts()[i];if(p?.[4]?.id)add(p[4].id)};
  window.changeQty=function(i,d){const p=getProducts()[i];if(p?.[4]?.id)qty(p[4].id,d)};
  window.total=total;window.updateCart=render;
  window.openCheckout=function(){if(!cart.length){alert('Please add at least one product.');return}const o=document.getElementById('cartOverlay');if(o)o.classList.remove('open');if(typeof window.resetCheckoutForm==='function')window.resetCheckoutForm();const items=document.getElementById('checkoutItems');if(items)items.innerHTML=cart.map(a=>{const i=find(a.id),p=getProducts()[i];return `<div class="summary-line"><span>${p[1]} × ${a.q}</span><span>₹${((Number(p[3])||0)*a.q).toFixed(2)}</span></div>`}).join('');const ct=document.getElementById('checkoutTotal');if(ct)ct.textContent='₹'+total().toFixed(2);if(typeof window.togglePaymentFields==='function')window.togglePaymentFields();if(typeof window.updateUpiLink==='function')window.updateUpiLink();const co=document.getElementById('checkoutOverlay');if(co)co.classList.add('open')};
  window.addMoreMedicines=function(){const o=document.getElementById('cartOverlay');if(o)o.classList.remove('open');const p=document.getElementById('products');if(p)p.scrollIntoView({behavior:'smooth',block:'start'})};
  function handleDeepLink(){const params=new URLSearchParams(location.search),id=params.get('addMedicineId');if(!id||find(id)<0)return;add(id);history.replaceState({},document.title,'index.html#products');setTimeout(function(){if(typeof window.openCart==='function')window.openCart()},100)}
  window.addEventListener('load',function(){bind();render();handleDeepLink()});
  const grid=document.getElementById('productGrid');if(grid)new MutationObserver(function(){bind();render()}).observe(grid,{childList:true,subtree:true});
  let cart=read();render();
})();
