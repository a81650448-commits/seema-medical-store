/* WhatsApp Bill Sharing - isolated add-on; does not modify login or existing modules */
(function(){
  'use strict';
  const clean=v=>String(v??'').replace(/[<>]/g,'').trim();
  const phoneNumber=v=>{const d=String(v||'').replace(/\D/g,'');if(d.length===10)return '91'+d;if(d.length===12&&d.startsWith('91'))return d;return d};
  function getPhone(){
    const input=prompt('Enter customer WhatsApp number (10 digits):');
    if(!input)return null;
    const phone=phoneNumber(input);
    if(phone.length!==12||!phone.startsWith('91')){alert('Please enter a valid Indian 10-digit WhatsApp number.');return null;}
    return phone;
  }
  function openChat(phone,message){
    const url='https://wa.me/'+phone+'?text='+encodeURIComponent(message);
    window.open(url,'_blank','noopener,noreferrer');
  }
  function addButtons(){
    const body=document.getElementById('billHistoryBody');
    if(!body)return;
    body.querySelectorAll('tr').forEach(row=>{
      if(row.dataset.whatsappAdded==='1')return;
      const cells=row.querySelectorAll('td');
      if(cells.length<6)return;
      const bill=clean(cells[0].textContent);
      if(!bill||/no bills/i.test(bill))return;
      const customer=clean(cells[1].textContent);
      const type=clean(cells[2].textContent);
      const amount=clean(cells[3].textContent);
      const payment=clean(cells[4].textContent);
      const date=clean(cells[5].textContent);
      let action=cells[6];
      if(!action)action=row.insertCell(-1);
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='btn primary';
      btn.style.marginLeft='5px';
      btn.textContent='📱 WhatsApp';
      btn.title='Open WhatsApp with this bill message';
      btn.addEventListener('click',function(){
        const phone=getPhone();
        if(!phone)return;
        const message=`*Seema Medical Store*\n\n🧾 *Bill:* ${bill}\n👤 *Customer:* ${customer}\n📦 *Sale Type:* ${type}\n💰 *Total:* ${amount}\n💳 *Payment:* ${payment}\n📅 *Date:* ${date}\n\nThank you for purchasing from Seema Medical Store.\n\nPlease keep this message for your records.`;
        openChat(phone,message);
      });
      action.appendChild(btn);
      row.dataset.whatsappAdded='1';
    });
  }
  function start(){
    addButtons();
    const observer=new MutationObserver(addButtons);
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();