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
          <a id="upiPayButton" class="primary full" href="#">Pay by UPI</a>
          <label>UPI Transaction / UTR Number<input id="txn" required></label>
        </div>
        <div id="codPaymentFields" hidden><p class="muted">Pay cash when your order is delivered.</p></div>
        <button class="primary full" type="submit">Confirm &amp; Place Order</button>
      </form>
      <div id="orderSuccess" hidden></div>
    </aside>`;
    overlay.addEventListener('click',function(e){if(e.target===overlay)overlay.classList.remove('open')});
    document.body.appendChild(overlay);
  }

  function goToProducts(){
    const cart=document.getElementById('cartOverlay');
    if(cart)cart.classList.remove('open');
    const products=document.getElementById('products');
    if(products)products.scrollIntoView({behavior:'smooth',block:'start'});
    if(history.replaceState)history.replaceState(null,'',location.pathname+location.search+'#products');
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
        return originalOpenCheckout();
      };
      fixedOpenCheckout.__cartActionFixed=true;
      window.openCheckout=fixedOpenCheckout;
    }
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
