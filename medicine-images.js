// Actual medicine packaging images for Seema Medical Store category pages.
// This script only runs when a category page contains .medicine-grid.
(function(){
  const images={
    'amaryl':'https://images.apollo247.in/pub/media/catalog/product/A/M/AMA0005_1_1.jpg?tr=q-85%2Cf-webp%2Cw-200%2Cdpr-3%2Cc-at_max+200w',
    'forxiga':'https://5.imimg.com/data5/SELLER/Default/2023/7/322565633/NO/PB/HI/152097542/6ad38ab3-95b3-4d45-9621-cd4058eb8c4b-500x500.jpeg',
    'galvus':'https://ik.imagekit.io/wlfr/wellness/images/products/353639-1.jpg',
    'glycomet gp1':'https://cdn01.pharmeasy.in/dam/productsnowatermark/085768/glycomet-gp-1mg-strip-of-15-tablets-front-2-1756904770-non-watermarked.jpg',
    'glycomet-gp':'https://mcareexports.com/wp-content/uploads/2021/06/Glycomet-GP-1mg-tab.jpg',
    'lantus':'https://ik.imagekit.io/wlfr/wellness/images/products/219534-1.jpg',
    'aldactone':'https://www.netforhealth.com/wp-content/uploads/2016/09/aldactone-25-500x500-400x400.jpg',
    'amlong':'https://images.apollo247.in/pub/media/catalog/product/A/M/AML0050_1_2.jpg?tr=q-80',
    'atorva 10':'https://meds.myupchar.com/145151/1.jpg',
    'ecosprin':'https://cpimg.tistatic.com/10351405/b/4/75-MG-Gastro-Resistant-Tablets-IP..jpg',
    'lasix':'https://tiimg.tistatic.com/fp/1/007/253/furosemide-40-mg-high-blood-pressure-tablets-922.jpg',
    'rosuvas':'https://www.pharmaright.vu/i-l-1152-rosuvas-tablets-10mg.jpeg',
    'telma':'https://d1s24u4ln0wd0i.cloudfront.net/med/12999/TELMA%2020MG%20TAB%201X15_1.webp',
    'cremaffin':'https://meds.myupchar.com/127384/qret0b2brbqx3ewsa4im.jpg',
    'digene':'https://api.chemist180.com/api/media/image-resize/?name=DIGENE_ORANGE_TABLET_chemist180.jpg&path=Product+Images%2F',
    'enterogermina':'https://imgwlns.gumlet.io/images/products/227429-1.JPG',
    'omez-d':'https://meds.myupchar.com/145004/1.jpg',
    'pan-d':'https://shreedashrath.com/wp-content/uploads/2021/06/pand2.jpg',
    'pantocid dsr':'https://cdn01.pharmeasy.in/dam/productsnowatermark/I07747/pantocid-dsr-strip-of-15-capsules-side-6.2-1756904258-non-watermarked.jpg',
    'unienzyme':'https://images.apollo247.in/pub/media/catalog/product/U/N/UNI0005_1_1.jpg?tr=q-80',
    'vizylac':'https://www.bbassets.com/media/uploads/p/l/1200003126_2-vizylac-capsule-for-stomach-care-restores-intestinal-flora-intestinal-immunity.jpg',
    'amlycure d.s.':'https://meds.myupchar.com/126321/1.jpg',
    'hepano':'https://i.ebayimg.com/00/s/MTUwMFgxNTAw/z/tmAAAOSwiXRkgaRS/%24_57.JPG?set_id=880000500F',
    'liv.52':'https://sklep.sfd.pl/produkt_img/d41d8cd98f00b204e9800998ecf8427ed41d8cd98f00b204e9800998ecf8427eLiv.52_i37914_d1200x1200.png',
    'silibon':'https://ik.imagekit.io/wlfr/wellness/images/products/211514-1.jpg',
    'sorbiline':'https://cdn01.pharmeasy.in/dam/productsnowatermark/161705/sorbiline-bottle-of-100ml-syrup-combo-3-1756827327-non-watermarked.jpg',
    'udiliv':'https://cpimg.tistatic.com/07789888/b/4/Udiliv-300-Mg-Tablets.jpg'
  };
  function key(v){return String(v||'').trim().toLowerCase().replace(/\s+/g,' ')}
  function apply(){
    const grids=document.querySelectorAll('.medicine-grid');
    if(!grids.length)return;
    grids.forEach(grid=>grid.querySelectorAll('.medicine-card').forEach(card=>{
      const title=card.querySelector('.medicine-info h2');
      const box=card.querySelector('.medicine-image');
      if(!title||!box||box.dataset.actualImageApplied==='1')return;
      const k=key(title.textContent),src=images[k];
      if(!src)return;
      box.innerHTML=`<img src="${src}" alt="${title.textContent.trim()} medicine packaging" loading="lazy" referrerpolicy="no-referrer">`;
      box.dataset.actualImageApplied='1';
    }));
  }
  const style=document.createElement('style');
  style.textContent='.medicine-grid .medicine-image img{width:100%;height:100%;max-width:100%;max-height:210px;object-fit:contain;display:block;padding:10px}.medicine-grid .medicine-image{overflow:hidden}';
  document.head.appendChild(style);
  apply();
  const observer=new MutationObserver(apply);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(apply,500);setTimeout(apply,1500);setTimeout(apply,3000);
})();
