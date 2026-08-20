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

(function addAnandTechnicalSolutionWatermark(){
  function add(){
    if(document.querySelector('.ats-watermark')) return;
    const wrap=document.createElement('div');
    wrap.className='ats-watermark';
    wrap.setAttribute('aria-label','Anand Technical Solution');
    const img=document.createElement('img');
    img.src='anand-technical-solution-logo.svg';
    img.alt='Anand Technical Solution';
    wrap.appendChild(img);
    document.body.appendChild(wrap);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',add); else add();
})();
