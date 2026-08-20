/* Safe online stock reservation fix.
   Uses Supabase RPC so the public customer page never needs direct UPDATE access
   to the medicines table. The existing admin login and panel are untouched. */
(function(){
  async function reserveOnlineStockSafe(db){
    const required=new Map();
    cart.forEach(x=>required.set(x.i,(required.get(x.i)||0)+x.q));
    const reservations=[];
    for(const [index,qty] of required){
      const medicine=products[index]?.[4];
      if(!medicine) throw new Error('A medicine in your cart is no longer available. Please refresh the page.');
      const {data,error}=await db.rpc('reserve_medicine_stock',{p_medicine_id:medicine.id,p_quantity:qty});
      if(error){
        if(/function .*reserve_medicine_stock.*does not exist/i.test(error.message||'')){
          throw new Error('Stock service is not installed yet. Please run the supplied Supabase stock-fix SQL once, then try again.');
        }
        throw error;
      }
      const row=Array.isArray(data)?data[0]:data;
      if(!row){
        const latest=await db.from('medicines').select('name,stock').eq('id',medicine.id).maybeSingle();
        const available=Number(latest.data?.stock||0);
        throw new Error(`${medicine.name} has only ${available} unit(s) available. Please reduce the quantity or refresh the page.`);
      }
      reservations.push({id:medicine.id,qty,name:row.name||medicine.name});
    }
    return reservations;
  }

  async function rollbackOnlineStock(db,reservations){
    for(const r of reservations){
      try{await db.rpc('restore_medicine_stock',{p_medicine_id:r.id,p_quantity:r.qty});}
      catch(error){console.error('STOCK RESTORE ERROR',error)}
    }
  }

  window.submitOrder=async function(e){
    e.preventDefault();
    if(!cart.length){alert('Please add at least one product.');return}
    const button=document.querySelector('#orderForm button[type="submit"]');
    if(button){button.disabled=true;button.textContent='Checking stock...'}
    let reservations=[];
    try{
      if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY)throw new Error('Supabase connection is missing. Please refresh the page.');
      const payment=document.getElementById('paymentMethod').value;
      const txn=document.getElementById('txn').value.trim();
      if(payment==='UPI'&&!txn)throw new Error('Please complete the UPI/QR payment and enter the UTR / transaction reference before placing the order.');
      const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
      const name=document.getElementById('customerName').value.trim();
      const phone=document.getElementById('customerPhone').value.trim();
      const address=document.getElementById('address').value.trim();
      const items=cart.map(x=>({name:products[x.i][1],pack:products[x.i][2],qty:x.q,price:Number(products[x.i][3])||0,medicine_id:products[x.i][4]?.id||null}));
      const orderId='SMS-'+Date.now().toString().slice(-8);
      const orderTotal=total();
      if(button)button.textContent='Updating stock...';
      reservations=await reserveOnlineStockSafe(db);
      const payload={order_id:orderId,customer_name:name,phone:phone,address:address,payment_method:payment,transaction_id:payment==='UPI'?txn:null,items,total:orderTotal,status:'Pending'};
      const customerResult=await db.from('customers').insert({name,phone,address});
      if(customerResult.error)console.warn('Customer save warning:',customerResult.error.message);
      if(button)button.textContent='Submitting order...';
      const orderResult=await db.from('orders').insert(payload);
      if(orderResult.error){await rollbackOnlineStock(db,reservations);reservations=[];throw new Error(orderResult.error.message+(orderResult.error.details?' — '+orderResult.error.details:''));}
      document.getElementById('orderForm').hidden=true;
      document.getElementById('orderSuccess').hidden=false;
      document.getElementById('orderSuccess').innerHTML=`<strong>Order submitted successfully!</strong><br><br>Order ID: <strong>${orderId}</strong><br>Total: <strong>₹${orderTotal}</strong><br>Payment: <strong>${payment==='UPI'?'UPI / QR — UTR recorded':'Cash on Delivery'}</strong><br><br>Stock has been updated automatically.<br><br>Keep this Order ID to track your order.<br><br><button type="button" class="primary" onclick="startAnotherOrder()">🛒 Place Another Order</button>`;
      cart=[];updateCart();await loadMedicines();
    }catch(error){
      console.error('SAFE ORDER SUBMISSION ERROR',error);
      if(reservations.length){const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);await rollbackOnlineStock(db,reservations);}
      alert(error.message||'Unable to submit the order.');
    }finally{
      if(button){button.disabled=false;button.textContent='Confirm & Place Order'}
    }
  };
})();
