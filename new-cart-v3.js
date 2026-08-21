// Seema Medical Store - Unified Cart V3
(function(){
'use strict';
const KEY='seema_cart_v3';
const USER_PREFIX='seema_cart_v3_user_';
function read(k=KEY){try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}}
function write(v,k=KEY){try{localStorage.setItem(k,JSON.stringify(v));window.dispatchEvent(new Event('cartUpdated'));return true}catch(e){console.error('CART V3 SAVE ERROR',e);return false}}
function userId(){return window.seemaCustomerAuth?.auth?.getSession?null:null}
function syncToUser(){
  const auth=window.seemaCustomerAuth;
  if(!auth)return;
  auth.auth.getSession().then(({data})=>{const id=data?.session?.user?.id;if(id)write(read(),USER_PREFIX+id)}).catch(()=>{});
}
function normalise(){
 const out=[];
 read().forEach(x=>{if(!x||x.id==null)return;const q=Math.max(1,Number(x.q)||1);const found=out.find(y=>String(y.id)===String(x.id));if(found)found.q+=q;else out.push({id:x.id,q:q})});
 write(out);return out;
}
function loadIntoPage(){
 if(!Array.isArray(window.products))return;
 const saved=normalise();
 if(typeof cart!=='undefined'){
   cart.length=0;
   saved.forEach(x=>{const i=products.findIndex(p=>String(p?.[4]?.id)===String(x.id));if(i>=0){const stock=Number(products[i][4]?.stock??0);if(stock>0)cart.push({i,q:Math.min(x.q,stock)})}});
 }
 if(typeof window.updateCart==='function')window.updateCart();
}
function saveFromPage(){
 if(typeof cart==='undefined'||!Array.isArray(window.products))return;
 const saved=cart.map(x=>{const p=products[x.i];return p?.[4]?.id?{id:p[4].id,q:Number(x.q)||1}:null}).filter(Boolean);
 write(saved);syncToUser();
}
const originalAdd=window.addToCart;
const originalChange=window.changeQty;
const originalUpdate=window.updateCart;
window.addToCart=function(i){
 if(typeof originalAdd==='function')originalAdd(i);
 saveFromPage();
};
window.changeQty=function(i,d){
 if(typeof originalChange==='function')originalChange(i,d);
 saveFromPage();
};
window.updateCart=function(){
 if(typeof originalUpdate==='function')originalUpdate();
 saveFromPage();
};
window.newCartAdd=function(id){
 const saved=read(),found=saved.find(x=>String(x.id)===String(id));
 if(found)found.q++;else saved.push({id:id,q:1});write(saved);syncToUser();
};
window.newCartLoad=loadIntoPage;
window.newCartSave=saveFromPage;
window.newCartKey=KEY;
window.addEventListener('medicinesReady',loadIntoPage);
window.addEventListener('beforeunload',saveFromPage);
})();