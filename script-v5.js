async function submitOrder(e){
 e.preventDefault();
 if(!cart.length){alert("Please add at least one product.");return;}
 const items=cart.map(x=>({name:products[x.i][1],pack:products[x.i][2],qty:x.q,price:products[x.i][3]}));
 const orderId="SMS-"+Date.now().toString().slice(-8);
 const customerName=document.getElementById("customerName").value.trim();
 const phone=document.getElementById("customerPhone").value.trim();
 const address=document.getElementById("address").value.trim();
 const paymentMethod=document.getElementById("paymentMethod").value;
 const transactionId=document.getElementById("txn").value.trim();
 const orderData={order_id:orderId,customer_name:customerName,phone:phone,address:address,payment_method:paymentMethod,transaction_id:transactionId||null,items:items,total:total(),status:"Pending"};
 try{
  if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY) throw new Error("Supabase configuration is missing.");
  const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
  const {error:customerError}=await db.from("customers").insert([{name:customerName,phone:phone,address:address}]);
  if(customerError) console.warn("Customer insert warning:",customerError.message);
  const {error:orderError}=await db.from("orders").insert([orderData]);
  if(orderError) throw new Error("Order database error: "+orderError.message+(orderError.details?" | "+orderError.details:""));
  document.getElementById("orderForm").hidden=true;
  document.getElementById("orderSuccess").hidden=false;
  document.getElementById("orderSuccess").innerHTML=`<strong>Order submitted successfully!</strong><br><br>Order ID: <strong>${orderId}</strong><br>Total: <strong>₹${orderData.total}</strong><br><br>Your order has been received by Seema Medical Store.`;
  cart=[];updateCart();
 }catch(error){
  console.error("ORDER ERROR",error);
  alert("ORDER ERROR: "+(error.message||String(error)));
 }
}
