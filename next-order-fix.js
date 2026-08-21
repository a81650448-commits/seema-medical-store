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
  goToProducts();
}

(function fixCartActions(){
  function ensureCheckoutMarkup(){
    if(document.getElementById('checkoutOverlay')) return;
    const overlay=document.createElement('div');
    overlay.id='checkoutOverlay';
    overlay.className='overlay';
    overlay.innerHTML=`<aside class="checkout" onclick="event.stopPropagation()">
      <button class="close" type="button" onclick="document.getElementById('checkoutOverlay').classList.remove('open')">×</button>
      <h2>Complete Your Order</h2>
      <div id="checkoutItems"></div>
      <div class="cart-total"><span>Total</span><strong id="checkoutTotal">₹0</strong></div>
      <form id="orderForm" onsubmit="submitOrder(event)">
        <label>Name<input id="customerName" required></label>
        <label>Mobile Number<input id="customerPhone" type="tel" pattern="[0-9]{10}" required></label>
        <label>Delivery Address<textarea id="address" required></textarea></label>
        <label>Payment Method<select id="paymentMethod" onchange="togglePaymentFields()"><option value="UPI">UPI / QR Payment</option><option value="COD">Cash on Delivery</option></select></label>
        <div id="upiPaymentFields">
          <div style="padding:12px;border:1px solid #d8e6df;border-radius:12px;margin:10px 0;background:#f7fbf9;text-align:center">
            <strong style="display:block;margin-bottom:6px">Pay by UPI</strong>
            <div style="font-size:14px;margin-bottom:8px">UPI ID: <strong>7007596728@ptyes</strong></div>
            <img id="upiQrCode" alt="UPI QR Code" width="180" height="180" style="display:block;margin:8px auto;border-radius:8px;background:#fff" loading="eager">
            <a id="upiPayButton" class="primary full" href="#">Pay by UPI</a>
            <div style="font-size:12px;margin-top:7px">After payment, enter the UTR / transaction reference below.</div>
          </div>
          <label>UPI Transaction / UTR Number<input id="txn" required></label>
        </div>
        <div id="codPaymentFields" hidden><p class="muted">Pay cash when your order is delivered.</p></div>
        <button class="primary full" type="submit">Confirm &amp; Place Order</button>
      </form>
      <div id="orderSuccess" hidden></div>
    </aside>`;
    overlay.addEventListener('click',function(e){if(e.target===overlay)overlay.classList.remove('open')});
    document.body.appendChild(overlay);
    refreshUpiDisplay();
  }

  function refreshUpiDisplay(){
    const button=document.getElementById('upiPayButton');
    const qr=document.getElementById('upiQrCode');
    const amount=typeof total==='function'?Number(total()||0):0;
    const upiId='7007596728@ptyes';
    const name='ANAND ENTERPRISES';
    const upiUrl='upi://pay?pa='+encodeURIComponent(upiId)+'&pn='+encodeURIComponent(name)+'&am='+amount.toFixed(2)+'&cu=INR';
    if(button)button.href=upiUrl;
    if(qr)qr.src='https://api.qrserver.com/v1/create-qr-code/?size=180x180&data='+encodeURIComponent(upiUrl);
  }

  function goToProducts(){
    const cart=document.getElementById('cartOverlay');
    if(cart)cart.classList.remove('open');
    const products=document.getElementById('products');
    try{history.replaceState(null,'',location.pathname+location.search+'#products')}catch(e){location.hash='products'}
    if(products){
      products.scrollIntoView({behavior:'smooth',block:'start'});
      setTimeout(function(){
        const p=document.getElementById('products');
        if(p)p.scrollIntoView({behavior:'smooth',block:'start'});
      },150);
    }else{
      location.hash='products';
    }
  }

  function setup(){
    ensureCheckoutMarkup();
    const more=document.getElementById('cartAddMoreButton');
    if(more&&!more.dataset.actionFixBound){
      more.dataset.actionFixBound='1';
      more.onclick=function(e){e.preventDefault();e.stopPropagation();goToProducts()};
    }

    if(typeof window.openCheckout==='function'&&!window.openCheckout.__cartActionFixed){
      const originalOpenCheckout=window.openCheckout;
      const fixedOpenCheckout=function(){
        ensureCheckoutMarkup();
        const result=originalOpenCheckout();
        setTimeout(function(){
          refreshUpiDisplay();
          if(typeof togglePaymentFields==='function')togglePaymentFields();
        },0);
        return result;
      };
      fixedOpenCheckout.__cartActionFixed=true;
      window.openCheckout=fixedOpenCheckout;
    }

    window.addEventListener('hashchange',function(){
      if(location.hash==='#products'){
        const p=document.getElementById('products');
        if(p)p.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();

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
