/* WhatsApp Bill Sharing - safe add-on for existing admin panel */
(function(){
  'use strict';
  const escText=v=>String(v??'').replace(/[<>]/g,'');
  function getPhone(){
    const onlineOrder=document.getElementById('onlineBillOrder');
    if(onlineOrder&&onlineOrder.value&&Array.isArray(window.orders)){
      const o=window.orders.find(x=>String(x.id)===String(onlineOrder.value));
      if(o&&o.phone)return String(o.phone).replace(/\D/g,'').replace(/^0/,'91');
    }
    const p=prompt('Enter customer WhatsApp number (10 digits):');
    if(!p)return null;
    const d=p.replace(/\D/g,'');
    return d.length===10?'91'+d:d;
  }
  function openWhatsApp(text){
    const phone=getPhone();
    if(!phone){alert('Customer WhatsApp number is required.');return;}
    if(phone.length<10){alert('Please enter a valid WhatsApp number.');return;}
    window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(text),'_blank','noopener');
  }
  function addButtons(){
    const body=document.getElementById('billHistoryBody');
    if(!body)return;
    body.querySelectorAll('tr').forEach(row=>{
      if(row.dataset.whatsappAdded==='1')return;
      const cells=row.querySelectorAll('td');
      if(cells.length<6)return;
      const bill=escText(cells[0].textContent.trim());
      if(!bill||/no bills/i.test(bill))return;
      const customer=escText(cells[1].textContent.trim());
      const type=escText(cells[2].textContent.trim());
      const amount=escText(cells[3].textContent.trim());
      const payment=escText(cells[4].textContent.trim());
      const date=escText(cells[5].textContent.trim());
      const action=cells[6]||row.insertCell(-1);
      const btn=document.createElement('button');
      btn.type='button';btn.className='btn primary';btn.style.marginLeft='5px';btn.textContent='📱 WhatsApp';
      btn.addEventListener('click',function(){
        const message='Seema Medical Store - Bill '+bill+'\n\nCustomer: '+customer+'\nBill Type: '+type+'\nAmount: '+amount+'\nPayment: '+payment+'\nDate: '+date+'\n\nThank you for purchasing from Seema Medical Store.';
        openWhatsApp(message);
      });
      action.appendChild(btn);
      row.dataset.whatsappAdded='1';
    });
  }
  function start(){
    addButtons();
    const target=document.body;
    if(target)new MutationObserver(addButtons).observe(target,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
