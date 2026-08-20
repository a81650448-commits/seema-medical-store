// Dedicated-page category routing + homepage category-card presentation for Seema Medical Store.
// Homepage only: categories open their dedicated pages; medicines never render on the homepage.
(function(){
  const categoryPages={
    'All':'all-medicines.html',
    'Diabetes':'diabetes.html',
    'Cardiac Care':'cardiac-care.html',
    'Stomach Care':'stomach-care.html',
    'Liver Care':'liver-care.html'
  };
  const categoryInfo={
    'Diabetes':{title:'Diabetes Care',desc:'Manage your diabetes with our best medicines',icon:'diabetes'},
    'Cardiac Care':{title:'Cardiac Care',desc:'Take care of your heart with trusted medicines',icon:'cardiac'},
    'Stomach Care':{title:'Stomach Care',desc:'Relief from acidity, gas and stomach issues',icon:'stomach'},
    'Liver Care':{title:'Liver Care',desc:'Support liver health with quality medicines',icon:'liver'},
    'All':{title:'All Medicines',desc:'Explore all our medicines in one place',icon:'all'}
  };
  function esc(v){return String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
  function categorySvg(type){
    const common='<circle cx="150" cy="150" r="132" fill="#f0f7f3"/>';
    if(type==='diabetes') return `<svg viewBox="0 0 300 300" aria-hidden="true">${common}<rect x="65" y="91" width="103" height="118" rx="14" fill="#174c8c"/><rect x="82" y="112" width="69" height="42" rx="5" fill="#eaf3f7"/><text x="116" y="139" text-anchor="middle" font-family="Arial" font-size="20" font-weight="700" fill="#174c8c">120</text><circle cx="116" cy="177" r="8" fill="#d5e4ee"/><rect x="165" y="105" width="72" height="111" rx="13" fill="#fff" stroke="#b9cfc5" stroke-width="3"/><rect x="165" y="105" width="72" height="23" rx="13" fill="#087443"/><text x="201" y="156" text-anchor="middle" font-family="Arial" font-size="12" font-weight="700" fill="#174c8c">DIABETES</text><text x="201" y="174" text-anchor="middle" font-family="Arial" font-size="11" fill="#52625b">CARE</text><ellipse cx="201" cy="199" rx="28" ry="9" fill="#eef5f1"/><circle cx="104" cy="218" r="10" fill="#fff" stroke="#d7e1dc"/><circle cx="130" cy="224" r="9" fill="#fff" stroke="#d7e1dc"/></svg>`;
    if(type==='cardiac') return `<svg viewBox="0 0 300 300" aria-hidden="true">${common}<path d="M91 126 C70 100 35 116 44 148 C53 181 89 196 150 232 C211 196 247 181 256 148 C265 116 230 100 209 126 C190 149 168 163 150 174 C132 163 110 149 91 126Z" fill="#e84d4d"/><path d="M49 153h38l14-28 19 55 17-34 13 20h51" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round"/><rect x="171" y="112" width="92" height="64" rx="9" fill="#fff" stroke="#b9cfc5" stroke-width="3"/><rect x="183" y="126" width="68" height="22" rx="3" fill="#eaf3f7"/><text x="217" y="143" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#174c8c">120/80</text><path d="M191 160h52" stroke="#aabbb4" stroke-width="4"/></svg>`;
    if(type==='stomach') return `<svg viewBox="0 0 300 300" aria-hidden="true">${common}<path d="M117 57c16 2 27 13 28 31l2 35c2 21 13 32 31 34 26 3 42 17 42 44 0 34-27 58-66 58-42 0-69-26-69-64 0-30 13-48 32-60 9-6 12-14 10-29l-3-28c-2-15 6-24 21-21Z" fill="#e96b4b"/><path d="M91 145c28 14 39 34 34 57-3 15 4 28 18 37" fill="none" stroke="#b94431" stroke-width="9" stroke-linecap="round"/><rect x="145" y="172" width="95" height="55" rx="7" fill="#fff" stroke="#d4c7bc" stroke-width="3"/><rect x="145" y="172" width="95" height="18" rx="7" fill="#f26a3d"/><text x="193" y="207" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700" fill="#d64c2d">DIGESTIVE CARE</text><circle cx="112" cy="223" r="8" fill="#fff" stroke="#d7e1dc"/><circle cx="132" cy="233" r="8" fill="#fff" stroke="#d7e1dc"/></svg>`;
    if(type==='liver') return `<svg viewBox="0 0 300 300" aria-hidden="true">${common}<path d="M72 132c19-52 69-74 127-61 39 9 70 34 79 68 6 22-4 38-25 44-30 9-61 3-88-9-28-13-61-13-88 1-22 11-18-25-5-43Z" fill="#a94b39"/><path d="M154 73c-4 38-7 73 4 104" fill="none" stroke="#7f352b" stroke-width="6"/><rect x="139" y="151" width="82" height="96" rx="14" fill="#fff" stroke="#b9cfc5" stroke-width="3"/><rect x="139" y="151" width="82" height="22" rx="12" fill="#6c9b69"/><text x="180" y="200" text-anchor="middle" font-family="Arial" font-size="13" font-weight="700" fill="#4d8b58">LIVER CARE</text><text x="180" y="220" text-anchor="middle" font-family="Arial" font-size="11" fill="#52625b">HEALTH</text><path d="M78 211c20-11 35-10 48 4-17 2-31 11-42 28-11-10-13-21-6-32Z" fill="#6fa96f"/><path d="M70 234c18-14 36-17 53-8-13 9-22 21-27 37-15-4-24-13-26-29Z" fill="#4f8d58"/></svg>`;
    return `<svg viewBox="0 0 300 300" aria-hidden="true">${common}<path d="M71 106h158c12 0 21 9 21 21v80c0 12-9 21-21 21H71c-12 0-21-9-21-21v-80c0-12 9-21 21-21Z" fill="#2f74ba"/><path d="M62 106h176l-16-30H78l-16 30Z" fill="#4d8dca"/><rect x="82" y="124" width="34" height="62" rx="7" fill="#fff"/><rect x="123" y="116" width="34" height="70" rx="7" fill="#f7b4a9"/><rect x="164" y="129" width="34" height="57" rx="7" fill="#fff"/><rect x="205" y="120" width="15" height="66" rx="5" fill="#f4d27c"/><circle cx="99" cy="151" r="7" fill="#087443"/><circle cx="140" cy="143" r="7" fill="#e84d4d"/><circle cx="181" cy="156" r="7" fill="#174c8c"/><path d="M87 200h126" stroke="#d9e6ef" stroke-width="8" stroke-linecap="round"/></svg>`;
  }
  function hideHomepageMedicines(){const grid=document.getElementById('productGrid');if(!grid)return;grid.innerHTML='';grid.style.display='none';}
  window.buildCategories=function(){
    const tabs=document.getElementById('categoryTabs');if(!tabs)return;
    const names=['Diabetes','Cardiac Care','Stomach Care','Liver Care','All'];
    tabs.innerHTML=names.map(n=>{const info=categoryInfo[n],href=categoryPages[n];return `<a class="category-card" href="${href}"><div class="category-image">${categorySvg(info.icon)}</div><h3>${esc(info.title)}</h3><p>${esc(info.desc)}</p><span class="category-arrow">→</span></a>`}).join('');
  };
  const style=document.createElement('style');style.textContent=`
    #categoryTabs{max-width:1200px;margin:0 auto 42px;padding:0 20px;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px;overflow:visible}
    .category-card{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;background:#fff;border:1px solid #e0e9e5;border-radius:20px;padding:12px 14px 20px;min-height:370px;box-shadow:0 8px 24px rgba(16,32,51,.05);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
    .category-card:hover{transform:translateY(-4px);box-shadow:0 14px 30px rgba(16,32,51,.10);border-color:#bcd8cb}
    .category-image{width:100%;height:235px;display:grid;place-items:center;overflow:hidden}.category-image svg{width:100%;height:100%;max-width:235px;max-height:235px;display:block}
    .category-card h3{margin:4px 0 8px;font-size:20px;color:#102033}.category-card p{margin:0;min-height:40px;max-width:190px;color:#63716c;font-size:13px;line-height:1.5}.category-arrow{width:38px;height:38px;margin-top:auto;display:grid;place-items:center;border-radius:50%;background:#087443;color:#fff;font-size:24px;font-weight:800}
    @media(max-width:1000px){#categoryTabs{grid-template-columns:repeat(3,minmax(0,1fr))}.category-card{min-height:350px}}
    @media(max-width:650px){#categoryTabs{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.category-card{min-height:310px;padding:8px 10px 16px}.category-image{height:185px}.category-image svg{max-width:185px;max-height:185px}.category-card h3{font-size:17px}.category-card p{font-size:12px}}
    @media(max-width:430px){#categoryTabs{grid-template-columns:1fr}.category-card{min-height:330px}.category-image{height:210px}.category-image svg{max-width:210px;max-height:210px}}
  `;document.head.appendChild(style);
  function applyHomepageCategoryMode(){hideHomepageMedicines();window.buildCategories();}
  applyHomepageCategoryMode();window.addEventListener('DOMContentLoaded',applyHomepageCategoryMode);window.addEventListener('load',applyHomepageCategoryMode);setTimeout(applyHomepageCategoryMode,300);setTimeout(applyHomepageCategoryMode,1000);setTimeout(applyHomepageCategoryMode,2000);
})();
