// Seema Medical Store - final cart/order fix
(function(){
  'use strict';
  function medicineIndex(item){if(!item)return -1;if(item.mid!=null){const byId=products.findIndex(p=>String(p[4]?.id)===String(item.mid));if(byId>=0)return byId}return Number.isInteger(item.i)&&products[item.i]?item.i:-1}
  function addMedicine(i){const medicine=products[i]?.[4];if(!medicine)return;const stock=Number(medicine.stock??0);if(stock<=0){alert('This medicine is currently out of stock.');return}const mid=String(medicine.id),existing=cart.find(x=>String(x.mid??'')===mid);if(existing){if(existing.q>=stock){alert('Only '+stock+' unit(s) available.');return}existing.q++}else cart.push({i,mid,q:1});renderCart()}
  function changeMedicineQty(i,d){const item=cart.find(x=>x.i===i||String(x.mid??'')===String(products[i]?.[4]?.id??''));if(!item)return;const index=medicineIndex(item);if(index<0)return;const stock=Number(products[index][4]?.stock??0);if(d>0&&item.q>=stock){alert('Only '+stock+' unit(s) available.');return}item.q+=d;if(item.q<=0)cart=cart.filter(x=>x!==item);renderCart()}
  function cartTotal(){return cart.reduce((sum,item)=>{const i=medicineIndex(item);return i<0?sum:sum+(Number(products[i][3])||0)*item.q},0)}
  function ensureAddMoreButton(){
    const cartBox=document.querySelector('#cartOverlay .cart');
    if(!cartBox)return;
    let button=document.getElementById('cartAddMoreButton');
    if(!button){button=document.createElement('button');button.id='cartAddMoreButton';button.type='button';button.className='secondary full';button.textContent='➕ Add More Medicines';button.onclick=function(){if(typeof window.addMoreMedicines==='function')window.addMoreMedicines();else{const overlay=document.getElementById('cartOverlay');if(overlay)overlay.classList.remove('open');location.hash='products'}};}
    const checkout=cartBox.querySelector('button[onclick="openCheckout()"]');
    if(checkout){checkout.style.marginTop='10px';if(button.parentNode!==cartBox)cartBox.insertBefore(button,checkout)}
    button.hidden=cart.length===0;
  }
  function renderCart(){
    cart=cart.filter(item=>medicineIndex(item)>=0);
    const count=cart.reduce((s,x)=>s+x.q,0),total=cartTotal(),countEl=document.getElementById('cartCount'),totalEl=document.getElementById('cartTotal'),itemsEl=document.getElementById('cartItems');
    if(countEl)countEl.textContent=count;if(totalEl)totalEl.textContent='₹'+total.toFixed(2);
    if(itemsEl)itemsEl.innerHTML=cart.length?cart.map(item=>{const i=medicineIndex(item),p=products[i];return `<div class="cart-row"><div><strong>${p[1]}</strong><div class="small">${p[2]}</div></div><div class="qty"><button type="button" data-cart-action="minus" data-cart-index="${i}">−</button> ${item.q} <button type="button" data-cart-action="plus" data-cart-index="${i}">+</button></div><strong>₹${((Number(p[3])||0)*item.q).toFixed(2)}</strong></div>`}).join(''):'<p class="muted">Your cart is empty.</p>';
    ensureAddMoreButton();
  }
  function sanitizeAddButtons(){document.querySelectorAll('#productGrid .product .add').forEach(button=>{if(button.dataset.cartBound==='1')return;const match=(button.getAttribute('onclick')||'').match(/addToCart\((\d+)\)/);if(!match)return;button.dataset.cartIndex=match[1];button.removeAttribute('onclick');button.dataset.cartBound='1'})}
  document.addEventListener('click',function(event){const addButton=event.target.closest?.('#productGrid .product .add');if(addButton){const i=Number(addButton.dataset.cartIndex);if(Number.isInteger(i)){event.preventDefault();event.stopImmediatePropagation();addMedicine(i)}return}const qtyButton=event.target.closest?.('[data-cart-action]');if(qtyButton){event.preventDefault();event.stopImmediatePropagation();changeMedicineQty(Number(qtyButton.dataset.cartIndex),qtyButton.dataset.cartAction==='plus'?1:-1)}},true);
  const grid=document.getElementById('productGrid');if(grid){new MutationObserver(sanitizeAddButtons).observe(grid,{childList:true,subtree:true});sanitizeAddButtons()}
  window.addToCart=addMedicine;window.changeQty=changeMedicineQty;window.total=cartTotal;window.updateCart=renderCart;
  window.openCheckout=function(){if(!cart.length){alert('Please add at least one product.');return}document.getElementById('cartOverlay').classList.remove('open');const form=document.getElementById('orderForm'),success=document.getElementById('orderSuccess');if(form){form.hidden=false;form.reset()}if(success){success.hidden=true;success.innerHTML=''}if(typeof window.togglePaymentFields==='function')window.togglePaymentFields();const summary=document.getElementById('checkoutItems');if(summary)summary.innerHTML=cart.map(item=>{const i=medicineIndex(item),p=products[i];return `<div class="summary-line"><span>${p[1]} × ${item.q}</span><span>₹${((Number(p[3])||0)*item.q).toFixed(2)}</span></div>`}).join('');const checkoutTotal=document.getElementById('checkoutTotal');if(checkoutTotal)checkoutTotal.textContent='₹'+cartTotal().toFixed(2);if(typeof window.updateUpiLink==='function')window.updateUpiLink();document.getElementById('checkoutOverlay').classList.add('open')};
  const originalLoad=window.loadMedicines;if(typeof originalLoad==='function')window.loadMedicines=async function(){await originalLoad();renderCart()};
  renderCart();
})();
