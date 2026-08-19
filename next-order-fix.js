function startAnotherOrder(){
  const checkout=document.getElementById('checkoutOverlay');
  const form=document.getElementById('orderForm');
  const success=document.getElementById('orderSuccess');
  if(form){form.hidden=false;form.reset();}
  if(success){success.hidden=true;success.innerHTML='';}
  if(checkout)checkout.classList.remove('open');
  if(typeof togglePaymentFields==='function')togglePaymentFields();
  if(typeof updateUpiLink==='function')updateUpiLink();
  document.getElementById('trackingResult')?.replaceChildren();
  document.getElementById('products')?.scrollIntoView({behavior:'smooth'});
}
