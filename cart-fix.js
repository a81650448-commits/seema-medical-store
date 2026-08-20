// Seema Medical Store - NEW SINGLE CART SYSTEM
(function(){
'use strict';
const KEY='seema_cart_final_v1';
const P=()=>Array.isArray(window.products)?window.products:[];
function read(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.filter(x=>x&&x.id).map(x=>({id:String(x.id),q:Math.max(1,Number(x.q)||1)})):[]}catch(e){return[]}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(cart.map(x=>({id:String(x.id),q:x.q}))));}catch(e){}}
function index(id){return P().findIndex(p=>String(p[4]?.id)===String(id))}
function render(){
 cart=cart.filter(x=>index(x.id)>=0);save();
 let count=0,total=0;
 const html=cart.map(x=>{const i=index(x.id),p=P()[i],price=Number(p[3])||0;count+=x.q;total+=price*x.q;return `<div class="cart-row"><div><strong>${p[1]}</strong><div class="small">${p[2]}</div></div><div class="qty"><button type="button" data-cart-new="minus" data-id="${x.id}">−</button> ${x.q} <button type="button" data-cart-new="plus" data-id="${x.id}">+</button></div><strong>₹${(price*x.q).toFixed(2)}</strong></div>`}).join('');
 const c=document.getElementById('cartCount'),t=document.getElementById('cartTotal'),box=document.getElementById('cartItems'),more=document.getElementById('cartAddMoreButton');
 if(c)c.textContent=count;if(t)t.textContent='₹'+total.toFixed(2);if(box)box.innerHTML=html||"<p class='muted'>Your cart is empty.</p>";if(more)more.hidden=cart.length===0;
}
function add(id){const i=index(id);if(i<0)return;const m=P()[i][4],stock=Number(m.stock??0);if(stock<=0){alert('This medicine is currently out of stock.');return}const x=cart.find(a=>String(a.id)===String(id));if(x){if(x.q>=stock){alert('Only '+stock+' unit(s) available.');return}x.q++}else cart.push({id:String(id),q:1});save();render()}
function quantity(id,d){const x=cart.find(a=>String(a.id)===String(id));if(!x)return;const i=index(id),stock=Number(P()[i][4]?.stock??0);if(d>0&&x.q>=stock){alert('Only '+stock+' unit(s) available.');return}x.q+=d;if(x.q<=0)cart=cart.filter(a=>a!==x);save();render()}
function total(){return cart.reduce((s,x)=>{const i=index(x.id);return s+(Number(P()[i]?.[3])||0)*x.q},0)}
function bindAddButtons(){document.querySelectorAll('#productGrid .product .add').forEach(b=>{if(b.dataset.newCartBound)return;const m=(b.getAttribute('onclick')||'').match(/addToCart\((\d+)\)/);if(!m)return;const p=P()[Number(m[1])];if(!p)return;b.removeAttribute('onclick');b.dataset.newCartId=String(p[4].id);b.dataset.newCartBound='1'})}
document.addEventListener('click',function(e){const b=e.target.closest?.('#productGrid .product .add');if(b&&b.dataset.newCartId){e.preventDefault();e.stopImmediatePropagation();add(b.dataset.newCartId);return}const q=e.target.closest?.('[data-cart-new]');if(q){e.preventDefault();e.stopImmediatePropagation();quantity(q.dataset.id,q.dataset.cartNew==='plus'?1:-1)}},true);
window.addToCart=function(i){const p=P()[i];if(p?.[4]?.id)add(p[4].id)};
window.changeQty=function(i,d){const p=P()[i];if(p?.[4]?.id)quantity(p[4].id,d)};
window.total=total;window.updateCart=render;
window.addMoreMedicines=function(){const o=document.getElementById('cartOverlay');if(o)o.classList.remove('open');const p=document.getElementById('products');if(p)p.scrollIntoView({behavior:'smooth',block:'start'})};
window.openCheckout=function(){if(!cart.length){alert('Please add at least one product.');return}const o=document.getElementById('cartOverlay');if(o)o.classList.remove('open');if(typeof window.resetCheckoutForm==='function')window.resetCheckoutForm();const items=document.getElementById('checkoutItems');if(items)items.innerHTML=cart.map(x=>{const i=index(x.id),p=P()[i];return `<div class="summary-line"><span>${p[1]} × ${x.q}</span><span>₹${((Number(p[3])||0)*x.q).toFixed(2)}</span></div>`}).join('');const ct=document.getElementById('checkoutTotal');if(ct)ct.textContent='₹'+total().toFixed(2);if(typeof window.togglePaymentFields==='function')window.togglePaymentFields();if(typeof window.updateUpiLink==='function')window.updateUpiLink();document.getElementById('checkoutOverlay')?.classList.add('open')};
function deepLink(){const id=new URLSearchParams(location.search).get('addMedicineId');if(!id||index(id)<0)return;add(id);history.replaceState({},document.title,'index.html#products');setTimeout(()=>window.openCart?.(),150)}
let cart=read();render();window.addEventListener('load',function(){bindAddButtons();render();deepLink()});const grid=document.getElementById('productGrid');if(grid)new MutationObserver(function(){bindAddButtons()}).observe(grid,{childList:true,subtree:true});
})();
