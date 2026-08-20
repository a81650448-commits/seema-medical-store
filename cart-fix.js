// Seema Medical Store - definitive multi-medicine cart fix
(function(){
  'use strict';

  function medicineIndex(item){
    if(!item) return -1;
    if(item.mid!=null){
      const byId=products.findIndex(p=>String(p[4]?.id)===String(item.mid));
      if(byId>=0) return byId;
    }
    return Number.isInteger(item.i) && products[item.i] ? item.i : -1;
  }

  function addMedicine(i){
    const medicine=products[i]?.[4];
    if(!medicine) return;
    const stock=Number(medicine.stock??0);
    if(stock<=0){ alert('This medicine is currently out of stock.'); return; }
    const mid=String(medicine.id);
    const existing=cart.find(x=>String(x.mid??'')===mid);
    if(existing){
      if(existing.q>=stock){ alert('Only '+stock+' unit(s) available.'); return; }
      existing.q++;
    }else{
      cart.push({i:i,mid:mid,q:1});
    }
    renderCart();
  }

  function changeMedicineQty(i,d){
    const mid=products[i]?.[4]?.id;
    const item=cart.find(x=>x.i===i || (mid!=null && String(x.mid)===String(mid)));
    if(!item) return;
    const index=medicineIndex(item);
    if(index<0) return;
    const stock=Number(products[index][4]?.stock??0);
    if(d>0 && item.q>=stock){ alert('Only '+stock+' unit(s) available.'); return; }
    item.q+=d;
    if(item.q<=0) cart=cart.filter(x=>x!==item);
    renderCart();
  }

  function cartTotal(){
    return cart.reduce((sum,item)=>{
      const i=medicineIndex(item);
      return i<0 ? sum : sum+(Number(products[i][3])||0)*item.q;
    },0);
  }

  function renderCart(){
    cart=cart.filter(item=>medicineIndex(item)>=0);
    const count=cart.reduce((s,x)=>s+x.q,0);
    const total=cartTotal();
    const countEl=document.getElementById('cartCount');
    const totalEl=document.getElementById('cartTotal');
    const itemsEl=document.getElementById('cartItems');
    if(countEl) countEl.textContent=count;
    if(totalEl) totalEl.textContent='₹'+total.toFixed(2);
    if(itemsEl){
      itemsEl.innerHTML=cart.length?cart.map(item=>{
        const i=medicineIndex(item),p=products[i];
        return `<div class="cart-row"><div><strong>${p[1]}</strong><div class="small">${p[2]}</div></div><div class="qty"><button type="button" data-cart-action="minus" data-cart-index="${i}">−</button> ${item.q} <button type="button" data-cart-action="plus" data-cart-index="${i}">+</button></div><strong>₹${((Number(p[3])||0)*item.q).toFixed(2)}</strong></div>`;
      }).join(''):"<p class='muted'>Your cart is empty.</p>";
    }
  }

  // IMPORTANT: product buttons already contain inline onclick="addToCart(i)".
  // A capture listener runs first, so the old single-item handler cannot also run.
  document.addEventListener('click',function(event){
    const addButton=event.target.closest?.('.product .add');
    if(addButton){
      const match=(addButton.getAttribute('onclick')||'').match(/addToCart\((\d+)\)/);
      if(match){
        event.preventDefault();
        event.stopPropagation();
        addMedicine(Number(match[1]));
      }
      return;
    }

    const qtyButton=event.target.closest?.('[data-cart-action]');
    if(qtyButton){
      event.preventDefault();
      event.stopPropagation();
      changeMedicineQty(Number(qtyButton.dataset.cartIndex),qtyButton.dataset.cartAction==='plus'?1:-1);
    }
  },true);

  // Keep all existing checkout code working with the ID-based cart.
  window.updateCart=renderCart;
  window.total=cartTotal;
  window.addToCart=addMedicine;
  window.changeQty=changeMedicineQty;

  // Re-render after live stock refresh; do not recreate or clear cart.
  const originalLoad=window.loadMedicines;
  if(typeof originalLoad==='function'){
    window.loadMedicines=async function(){
      await originalLoad();
      renderCart();
    };
  }

  renderCart();
})();
