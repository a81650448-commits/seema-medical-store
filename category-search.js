// Search box for dedicated medicine category pages.
(function(){
  function init(){
    const grid=document.querySelector('.medicine-grid');
    if(!grid || document.getElementById('categoryMedicineSearch')) return;
    const wrap=document.createElement('div');
    wrap.className='category-search-wrap';
    wrap.innerHTML=`<label for="categoryMedicineSearch">Search medicines</label><div class="category-search-box"><span aria-hidden="true">🔎</span><input id="categoryMedicineSearch" type="search" placeholder="Search medicine by name..." autocomplete="off"></div><div id="categorySearchStatus" class="category-search-status"></div>`;
    const status=document.getElementById('diabetesStatus');
    if(status) status.parentNode.insertBefore(wrap,status.nextSibling); else grid.parentNode.insertBefore(wrap,grid);
    const input=wrap.querySelector('input'), count=()=>grid.querySelectorAll('.medicine-card').length;
    function filter(){
      const q=input.value.trim().toLowerCase(); let visible=0;
      grid.querySelectorAll('.medicine-card').forEach(card=>{const name=(card.querySelector('.medicine-info h2')?.textContent||'').toLowerCase();const show=!q||name.includes(q);card.style.display=show?'':'none';if(show)visible++;});
      wrap.querySelector('#categorySearchStatus').textContent=q?(visible?`${visible} medicine${visible===1?'':'s'} found`:'No medicine found'):`${count()} medicines available`;
    }
    input.addEventListener('input',filter); filter();
  }
  const style=document.createElement('style');
  style.textContent=`
    .category-search-wrap{margin:0 0 24px;padding:18px 20px;background:#fff;border:1px solid #d9e5df;border-radius:16px;box-shadow:0 6px 18px rgba(16,32,51,.05)}
    .category-search-wrap label{display:block;margin-bottom:8px;font-weight:700;color:#102033}
    .category-search-box{display:flex;align-items:center;gap:10px;border:1px solid #cbdad3;border-radius:12px;background:#f8fbf9;padding:0 14px}
    .category-search-box input{width:100%;border:0;outline:0;background:transparent;padding:13px 0;font:inherit;color:#102033}
    .category-search-status{margin-top:7px;font-size:13px;color:#63716c}
  `;
  document.head.appendChild(style);
  init();
  window.addEventListener('load',init);
  setTimeout(init,500);setTimeout(init,1500);
})();
