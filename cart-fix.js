// Seema Medical Store - final cart/order fix
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
    if(stock<=0){alert('This medicine is currently out of stock.');return;}
    const mid=String(medicine.id);
    const existing=cart.find(x=>String(x.mid??'')===mid);
    if(existing){
      if(existing.q>=stock){alert('Only '+stock+' unit(s) available.');return;}
      existing.q++;
    }else{
      cart.push({i:i,mid:mid,q:1});
    }
    renderCart();
  }

  function changeMedicineQty(i,d){
    const item=cart.find(x=>x.i===i || String(x.mid??'')===String(products[i]?.[4]?.id??''));
    if(!item)return;
    const index=medicineIndex(item);
    if(index<0)return;
    const stock=Number(products[index][4]?.stock??0);
    if(d>0&&item.q>=stock){alert('Only '+stock+' unit(s) available.');return;}
    item.q+=d;
    if(item.q<=0)cart=cart.filter(x=>x!==item);
    renderCart();
  }

  function cartTotal(){
    return cart.reduce((sum,item)=>{
      const i=medicineIndex(item);
      return i<0?sum:sum+(Number(products[i][3])||0)*item.q;
    },0);
  }

  function renderCart(){
    cart=cart.filter(item=>medicineIndex(item)>=0);
    const count=cart.reduce((s,x)=>s+x.q,0), total=cartTotal();
    const countEl=document.getElementById('cartCount');
    const totalEl=document.getElementById('cartTotal');
    const itemsEl=document.getElementById('cartItems');
    if(countEl)countEl.textContent=count;
    if(totalEl)totalEl.textContent='₹'+total.toFixed(2);
    if(itemsEl){
      itemsEl.innerHTML=cart.length?cart.map(item=>{
        const i=medicineIndex(item),p=products[i];
        return `<div class="cart-row"><div><strong>${p[1]}</strong><div class="small">${p[2]}</div></div><div class="qty"><button type="button" data-cart-action="minus" data-cart-index="${i}">−</button> ${item.q} <button type="button" data-cart-action="plus" data-cart-index="${i}">+</button></div><strong>₹${((Number(p[3])||0)*item.q).toFixed(2)}</strong></div>`;
      }).join(''):"<p class='muted'>Your cart is empty.</p>";
    }
  }

  function sanitizeAddButtons(){
    document.querySelectorAll('#productGrid .product .add').forEach(button=>{
      if(button.dataset.cartBound==='1')return;
      const match=(button.getAttribute('onclick')||'').match(/addToCart\((\d+)\)/);
      if(!match)return;
      button.dataset.cartIndex=match[1];
      button.removeAttribute('onclick');
      button.dataset.cartBound='1';
    });
  }

  document.addEventListener('click',function(event){
    const addButton=event.target.closest?.('#productGrid .product .add');
    if(addButton){
      const i=Number(addButton.dataset.cartIndex);
      if(Number.isInteger(i)){
        event.preventDefault();
        event.stopImmediatePropagation();
        addMedicine(i);
      }
      return;
    }
    const qtyButton=event.target.closest?.('[data-cart-action]');
    if(qtyButton){
      event.preventDefault();
      event.stopImmediatePropagation();
      changeMedicineQty(Number(qtyButton.dataset.cartIndex),qtyButton.dataset.cartAction==='plus'?1:-1);
    }
  },true);

  const grid=document.getElementById('productGrid');
  if(grid){
    new MutationObserver(sanitizeAddButtons).observe(grid,{childList:true,subtree:true});
    sanitizeAddButtons();
  }

  // Expose the stable cart functions used by inline UI and later scripts.
  window.addToCart=addMedicine;
  window.changeQty=changeMedicineQty;
  window.total=cartTotal;
  window.updateCart=renderCart;

  // Replace checkout so it always resolves cart items by medicine ID after live stock refresh.
  window.openCheckout=function(){
    if(!cart.length){alert('Please add at least one product.');return;}
    document.getElementById('cartOverlay').classList.remove('open');
    const form=document.getElementById('orderForm'),success=document.getElementById('orderSuccess');
    if(form){form.hidden=false;form.reset();}
    if(success){success.hidden=true;success.innerHTML='';}
    if(typeof window.togglePaymentFields==='function')window.togglePaymentFields();
    const summary=document.getElementById('checkoutItems');
    if(summary)summary.innerHTML=cart.map(item=>{const i=medicineIndex(item),p=products[i];return `<div class="summary-line"><span>${p[1]} × ${item.q}</span><span>₹${((Number(p[3])||0)*item.q).toFixed(2)}</span></div>`}).join('');
    const checkoutTotal=document.getElementById('checkoutTotal');
    if(checkoutTotal)checkoutTotal.textContent='₹'+cartTotal().toFixed(2);
    if(typeof window.togglePaymentFields==='function')window.togglePaymentFields();
    if(typeof window.updateUpiLink==='function')window.updateUpiLink();
    document.getElementById('checkoutOverlay').classList.add('open');
  };

  async function reserveStock(db){
    const required=new Map();
    cart.forEach(item=>{
      const i=medicineIndex(item),m=products[i]?.[4];
      if(m)required.set(String(m.id),(required.get(String(m.id))||0)+item.q);
    });
    const reservations=[];
    for(const [id,qty] of required){
      const {data,error}=await db.rpc('reserve_medicine_stock',{p_medicine_id:id,p_quantity:qty});
      if(error)throw error;
      if(!data||!data.length){
        const current=await db.from('medicines').select('id,name,stock').eq('id',id).maybeSingle();
        if(current.error)throw current.error;
        throw new Error(`${current.data?.name||'Medicine'} has only ${Number(current.data?.stock||0)} unit(s) available. Please update your cart.`);
      }
      reservations.push({id:data[0].id,quantity:qty,name:data[0].name});
    }
    return reservations;
  }

  async function rollbackStock(db,reservations){
    for(const r of reservations){try{await db.rpc('restore_medicine_stock',{p_medicine_id:r.id,p_quantity:r.quantity});}catch(e){console.error('STOCK ROLLBACK ERROR',e)}}
  }

  window.submitOrder=async function(e){
    e.preventDefault();
    if(!cart.length){alert('Please add at least one product.');return;}
    const button=document.querySelector('#orderForm button[type="submit"]');
    if(button){button.disabled=true;button.textContent='Checking stock...';}
    let reservations=[];
    try{
      if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY)throw new Error('Supabase connection is missing. Refresh the page.');
      const payment=document.getElementById('paymentMethod').value,txn=document.getElementById('txn').value.trim();
      if(payment==='UPI'&&!txn)throw new Error('Please complete the UPI/QR payment and enter the UTR / transaction reference before placing the order.');
      const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
      const name=document.getElementById('customerName').value.trim(),phone=document.getElementById('customerPhone').value.trim(),address=document.getElementById('address').value.trim();
      const items=cart.map(item=>{const i=medicineIndex(item),p=products[i];return{name:p[1],pack:p[2],qty:item.q,price:Number(p[3])||0,medicine_id:p[4]?.id||null}});
      const orderId='SMS-'+Date.now().toString().slice(-8),orderTotal=cartTotal();
      if(button)button.textContent='Updating stock...';
      reservations=await reserveStock(db);
      const payload={order_id:orderId,customer_name:name,phone:phone,address:address,payment_method:payment,transaction_id:payment==='UPI'?txn:null,items,total:orderTotal,status:'Pending'};
      const customerResult=await db.from('customers').insert({name,phone,address});
      if(customerResult.error)console.warn('Customer save warning:',customerResult.error.message);
      if(button)button.textContent='Submitting order...';
      const orderResult=await db.from('orders').insert(payload);
      if(orderResult.error){await rollbackStock(db,reservations);reservations=[];throw new Error(orderResult.error.message+(orderResult.error.details?' — '+orderResult.error.details:''));}
      document.getElementById('orderForm').hidden=true;
      document.getElementById('orderSuccess').hidden=false;
      document.getElementById('orderSuccess').innerHTML=`<strong>Order submitted successfully!</strong><br><br>Order ID: <strong>${orderId}</strong><br>Total: <strong>₹${orderTotal}</strong><br>Payment: <strong>${payment==='UPI'?'UPI / QR — UTR recorded':'Cash on Delivery'}</strong><br><br>Stock has been updated automatically.<br><br>Keep this Order ID to track your order.<br><br><button type="button" class="primary" onclick="startAnotherOrder()">🛒 Place Another Order</button>`;
      cart=[];renderCart();
      if(typeof window.loadMedicines==='function')await window.loadMedicines();
    }catch(error){
      console.error('ORDER SUBMISSION ERROR',error);
      if(reservations.length)await rollbackStock(window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY),reservations);
      alert(error.message||'Unable to submit the order');
    }finally{
      if(button){button.disabled=false;button.textContent='Confirm & Place Order';}
    }
  };

  // Preserve the cart through every live medicine refresh.
  const originalLoad=window.loadMedicines;
  if(typeof originalLoad==='function'){
    window.loadMedicines=async function(){await originalLoad();renderCart();};
  }

  renderCart();
})();
