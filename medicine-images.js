// Medicine image loader for Seema Medical Store.
// Uses real packaging images when available, with a generated medicine-pack fallback
// so NO medicine card is ever left blank when an external image host blocks a request.
(function(){
  const images={
    'amaryl':'https://images.apollo247.in/pub/media/catalog/product/A/M/AMA0005_1_1.jpg?tr=q-85%2Cf-webp%2Cw-200%2Cdpr-3%2Cc-at_max+200w',
    'forxiga':'https://5.imimg.com/data5/SELLER/Default/2023/7/322565633/NO/PB/HI/152097542/6ad38ab3-95b3-4d45-9621-cd4058eb8c4b-500x500.jpeg',
    'galvus':'https://ik.imagekit.io/wlfr/wellness/images/products/353639-1.jpg',
    'glycomet gp1':'https://cdn01.pharmeasy.in/dam/productsnowatermark/085768/glycomet-gp-1mg-strip-of-15-tablets-front-2-1756904770-non-watermarked.jpg',
    'glycomet gp':'https://mcareexports.com/wp-content/uploads/2021/06/Glycomet-GP-1mg-tab.jpg',
    'lantus':'https://ik.imagekit.io/wlfr/wellness/images/products/219534-1.jpg',
    'aldactone':'https://www.netforhealth.com/wp-content/uploads/2016/09/aldactone-25-500x500-400x400.jpg',
    'amlong':'https://images.apollo247.in/pub/media/catalog/product/A/M/AML0050_1_2.jpg?tr=q-80',
    'atorva 10':'https://meds.myupchar.com/145151/1.jpg',
    'ecosprin':'https://cpimg.tistatic.com/10351405/b/4/75-MG-Gastro-Resistant-Tablets-IP..jpg',
    'lasix':'https://tiimg.tistatic.com/fp/1/007/253/furosemide-40-mg-high-blood-pressure-tablets-922.jpg',
    'rosuvas':'https://www.pharmaright.vu/i-l-1152-rosuvas-tablets-10mg.jpeg',
    'telma':'https://meds.myupchar.com/138509/1.jpg',
    'cremaffin':'https://meds.myupchar.com/127384/qret0b2brbqx3ewsa4im.jpg',
    'digene':'https://api.chemist180.com/api/media/image-resize/?name=DIGENE_ORANGE_TABLET_chemist180.jpg&path=Product+Images%2F',
    'enterogermina':'https://imgwlns.gumlet.io/images/products/227429-1.JPG',
    'omez d':'https://meds.myupchar.com/145004/1.jpg',
    'pan d':'https://shreedashrath.com/wp-content/uploads/2021/06/pand2.jpg',
    'pantop 40':'https://cmedia.cheapmedicineshop.com/media/catalog/product/cache/626c3b3f08206a0163ceb01a22c7c3d3/p/a/pantop_40_mg_with_pantoprazole_gastro-resistant.png',
    'pantocid dsr':'https://cdn01.pharmeasy.in/dam/productsnowatermark/I07747/pantocid-dsr-strip-of-15-capsules-side-6.2-1756904258-non-watermarked.jpg',
    'unienzyme':'https://images.apollo247.in/pub/media/catalog/product/U/N/UNI0005_1_1.jpg?tr=q-80',
    'vizylac':'https://www.bbassets.com/media/uploads/p/l/1200003126_2-vizylac-capsule-for-stomach-care-restores-intestinal-flora-intestinal-immunity.jpg',
    'amlycure ds':'https://meds.myupchar.com/126321/1.jpg',
    'hepano':'https://i.ebayimg.com/00/s/MTUwMFgxNTAw/z/tmAAAOSwiXRkgaRS/%24_57.JPG?set_id=880000500F',
    'liv 52':'https://sklep.sfd.pl/produkt_img/d41d8cd98f00b204e9800998ecf8427eLiv.52_i37914_d1200x1200.png',
    'silibon':'https://ik.imagekit.io/wlfr/wellness/images/products/211514-1.jpg',
    'sorbiline':'https://cdn01.pharmeasy.in/dam/productsnowatermark/161705/sorbiline-bottle-of-100ml-syrup-combo-3-1756827327-non-watermarked.jpg',
    'udiliv':'https://cpimg.tistatic.com/07789888/b/4/Udiliv-300-Mg-Tablets.jpg'
  };

  function key(v){
    return String(v||'').toLowerCase().trim()
      .replace(/[.\-_]/g,' ')
      .replace(/\s+/g,' ');
  }

  function fallbackSvg(name){
    const safe=String(name||'Medicine').replace(/[&<>"']/g,'');
    const short=safe.length>24?safe.slice(0,24)+'…':safe;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="420" height="280" viewBox="0 0 420 280">
      <rect width="420" height="280" rx="22" fill="#f4faf7"/>
      <rect x="100" y="35" width="220" height="185" rx="12" fill="#ffffff" stroke="#0f766e" stroke-width="4"/>
      <rect x="100" y="35" width="220" height="48" rx="12" fill="#0f766e"/>
      <text x="210" y="67" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="white">SEEMA MEDICAL</text>
      <circle cx="210" cy="130" r="27" fill="#d9f2ec" stroke="#0f766e" stroke-width="3"/>
      <path d="M195 130h30M210 115v30" stroke="#0f766e" stroke-width="7" stroke-linecap="round"/>
      <text x="210" y="178" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#173b36">${short}</text>
      <text x="210" y="205" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#60746f">Medicine image</text>
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }

  function putImage(box,title,src){
    const img=document.createElement('img');
    img.alt=title+' medicine image';
    img.loading='lazy';
    img.decoding='async';
    img.referrerPolicy='no-referrer';
    img.src=src||fallbackSvg(title);
    img.onerror=function(){
      if(this.dataset.fallback!=='1'){
        this.dataset.fallback='1';
        this.src=fallbackSvg(title);
      }
    };
    box.innerHTML='';
    box.appendChild(img);
    box.dataset.actualImageApplied='1';
  }

  function apply(){
    document.querySelectorAll('.medicine-grid .medicine-card').forEach(card=>{
      const title=card.querySelector('.medicine-info h2');
      const box=card.querySelector('.medicine-image');
      if(!title||!box||box.dataset.actualImageApplied==='1')return;
      const name=title.textContent.trim();
      const src=images[key(name)];
      putImage(box,name,src);
    });
  }

  const style=document.createElement('style');
  style.textContent='.medicine-grid .medicine-image{overflow:hidden;display:flex;align-items:center;justify-content:center}.medicine-grid .medicine-image img{width:100%;height:100%;max-width:100%;max-height:210px;object-fit:contain;display:block;padding:10px}';
  document.head.appendChild(style);
  apply();
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(apply,500);setTimeout(apply,1500);setTimeout(apply,3000);
})();
