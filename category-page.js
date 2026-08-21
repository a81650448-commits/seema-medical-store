(function(){
  'use strict';
  const params=new URLSearchParams(window.location.search);
  const requested=(params.get('category')||'All').trim()||'All';
  let medicines=[];

  function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}

  async function loadCategory(){
    const grid=document.getElementById('categoryProducts');
    try{
      if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY)throw new Error('Supabase connection is missing.');
      const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
      const {data,error}=await db.from('medicines').select('id,name,category,price,stock,manufacturer,expiry_date').order('name');
      if(error)throw error;
      medicines=data||[];
      const matches=requested.toLowerCase()==='all'?medicines:medicines.filter(m=>String(m.category||'').trim().toLowerCase()===requested.toLowerCase());
      const actualName=requested.toLowerCase()==='all'?'All Medicines':(matches[0]?.category||requested);
      document.getElementById('categoryTitle').textContent=actualName;
      document.getElementById('categoryCount').textContent=matches.length+' medicine'+(matches.length===1?'':'s')+' available';
      document.title=actualName+' | Seema Medical Store';
      render(matches);
    }catch(error){
      console.error('CATEGORY PAGE ERROR',error);
      document.getElementById('categoryCount').textContent='Unable to load medicines.';
      grid.innerHTML='<div class="category-empty">Unable to load medicines. Please refresh the page.</div>';
    }
  }

  function render(source){
    const q=(document.getElementById('categorySearch').value||'').trim().toLowerCase();
    const filtered=source.filter(m=>(String(m.name||'')+' '+String(m.category||'')+' '+String(m.manufacturer||'')).toLowerCase().includes(q));
    const grid=document.getElementById('categoryProducts');
    if(!filtered.length){grid.innerHTML='<div class="category-empty">No medicine found in this category.</div>';return;}
    grid.innerHTML=filtered.map(m=>{
      const stock=Number(m.stock||0),price=Number(m.price||0);
      const button=stock>0?`<button class="order-btn" type="button" onclick="orderMedicine('${esc(m.id)}')">Add to Cart</button>`:'<button class="order-btn" type="button" disabled>Out of Stock</button>';
      return `<article class="category-product"><div class="category-label">${esc(m.category||'Medicine')}</div><h3>${esc(m.name)}</h3>${m.manufacturer?`<p><strong>Manufacturer:</strong> ${esc(m.manufacturer)}</p>`:''}<p>Available stock: ${stock}</p>${m.expiry_date?`<p>Expiry: ${esc(m.expiry_date)}</p>`:''}<div class="price">${price>0?'₹'+price:'Check price'}</div>${button}</article>`;
    }).join('');
  }

  window.orderMedicine=function(id){
    window.location.href='index.html?addMedicineId='+encodeURIComponent(id)+'#products';
  };

  document.getElementById('categorySearch').addEventListener('input',()=>{
    const q=(document.getElementById('categorySearch').value||'').trim().toLowerCase();
    const matches=requested.toLowerCase()==='all'?medicines:medicines.filter(m=>String(m.category||'').trim().toLowerCase()===requested.toLowerCase());
    render(matches.filter(m=>(String(m.name||'')+' '+String(m.category||'')+' '+String(m.manufacturer||'')).toLowerCase().includes(q)));
  });
  loadCategory();
})();
