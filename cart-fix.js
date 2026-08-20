// Seema Medical Store - multi-medicine cart fix
// Keeps different medicines as separate cart lines and uses medicine IDs
// so live stock refreshes cannot collapse the cart into one product.
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

  window.addToCart=function(i){
    const product=products[i], medicine=product?.[4];
    if(!medicine) return;
    const stock=Number(medicine.stock??0);
    if(stock<=0){ alert('This medicine is currently out of stock.'); return; }

    const mid=String(medicine.id);
    let item=cart.find(x=>String(x.mid??'')===mid);
    if(item){
      if(item.q>=stock){
        alert('Only '+stock+' unit(s) available.');
        return;
      }
      item.q++;
    }else{
      cart.push({i:i,mid:mid,q:1});
    }
    updateCart();
  };

  window.changeQty=function(i,d){
    const source=cart.find(x=>x.i===i || String(x.mid??'')===String(products[i]?.[4]?.id??''));
    if(!source) return;
    const index=medicineIndex(source);
    if(index<0){ cart=cart.filter(x=>x!==source); updateCart(); return; }
    const stock=Number(products[index][4]?.stock??0);
    if(d>0 && source.q>=stock){
      alert('Only '+stock+' unit(s) available.');
      return;
    }
    source.q+=d;
    if(source.q<=0) cart=cart.filter(x=>x!==source);
    updateCart();
  };

  window.total=function(){
    return cart.reduce((sum,item)=>{
      const i=medicineIndex(item);
      return i<0 ? sum : sum+(Number(products[i][3])||0)*item.q;
    },0);
  };

  window.updateCart=function(){
    let count=0,totalAmount=0;
    const rows=[];
    cart=cart.filter(item=>medicineIndex(item)>=0);

    cart.forEach(item=>{
      const i=medicineIndex(item), p=products[i];
      count+=item.q;
      totalAmount+=(Number(p[3])||0)*item.q;
      rows.push(`<div class="cart-row"><div><strong>${p[1]}</strong><div class="small">${p[2]}</div></div><div class="qty"><button type="button" onclick="changeQty(${i},-1)">−</button> ${item.q} <button type="button" onclick="changeQty(${i},1)">+</button></div><strong>₹${((Number(p[3])||0)*item.q).toFixed(2)}</strong></div>`);
    });

    const countEl=document.getElementById('cartCount');
    const totalEl=document.getElementById('cartTotal');
    const itemsEl=document.getElementById('cartItems');
    if(countEl) countEl.textContent=count;
    if(totalEl) totalEl.textContent='₹'+totalAmount.toFixed(2);
    if(itemsEl) itemsEl.innerHTML=rows.length?rows.join(''):"<p class='muted'>Your cart is empty.</p>";
  };

  // Re-render cart after the live medicine refresh without losing selected items.
  const originalLoadMedicines=window.loadMedicines;
  if(typeof originalLoadMedicines==='function'){
    window.loadMedicines=async function(){
      await originalLoadMedicines();
      updateCart();
    };
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>updateCart());
  }else{
    updateCart();
  }
})();
