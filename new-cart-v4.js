// Seema Medical Store - Single Authoritative Cart V4
(function(){
'use strict';
const KEY='seema_cart_v4', USER_PREFIX='seema_cart_v4_user_';
let hydrated=false, hydrating=false;
function read(key=KEY){try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}}
function write(value,key=KEY){try{localStorage.setItem(key,JSON.stringify(value));window.dispatchEvent(new Event('cartUpdated'));return true}catch(e){console.error('CART V4 SAVE ERROR',e);return false}}
function valid(){return Array.isArray(window.products)&&typeof cart!=='undefined'}
function rawItems(){return read(KEY).map(x=>({id:x?.id,q:Math.max(1,Number(x?.q)||1)})).filter(x=>x.id!==undefined&&x.id!==null&&String(x.id)!=='')}
function findProduct(id){if(!valid())return null;return products.find(p=>String(p?.[4]?.id)===String(id))||null}
async function hydrateFromDatabase(){
  if(hydrating)return;
  if(valid()&&products.length){hydrated=true;fromStorage();return;}
  if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY)return;
  hydrating=true;
  try{
    const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
    const {data,error}=await db.from('medicines').select('id,name,category,price,stock,manufacturer,expiry_date').order('name');
    if(error)throw error;
    if(valid()){
      products.length=0;
      (data||[]).forEach(m=>products.push([String(m.category||'Other').trim()||'Other',m.name,'Available stock: '+(m.stock??0),Number(m.price)||0,m]));
      hydrated=true;
      fromStorage();
    }
  }catch(e){
    console.error('CART V4 MEDICINE HYDRATION ERROR',e);
    // Never erase the saved cart just because medicine data failed to load.
    renderRaw();
  }finally{hydrating=false}
}
function fromStorage(){
  if(!valid()){renderRaw();return false}
  const saved=rawItems(),next=[];
  saved.forEach(x=>{
    const p=findProduct(x.id);
    if(!p)return;
    const stock=Number(p[4]?.stock??0);
    if(stock<=0)return;
    next.push({i:products.indexOf(p),q:Math.min(Math.max(1,x.q),stock)});
  });
  cart.length=0;next.forEach(x=>cart.push(x));
  hydrated=true;render();
  return true;
}
function snapshot(){
  if(!valid())return rawItems();
  return cart.map(x=>{const p=products[x.i];return p?.[4]?.id?{id:p[4].id,q:Math.max(1,Number(x.q)||1)}:null}).filter(Boolean);
}
function persist(){
  const data=snapshot();
  if(data.length||rawItems().length===0)write(data);
  const auth=window.seemaCustomerAuth;
  if(auth?.auth?.getSession)auth.auth.getSession().then(({data:s})=>{const id=s?.session?.user?.id;if(id)write(data,USER_PREFIX+id)}).catch(()=>{});
  return data;
}
function renderRaw(){
  const saved=rawItems();
  const c=document.getElementById('cartCount');if(c)c.textContent=saved.reduce((n,x)=>n+x.q,0);
  const items=document.getElementById('cartItems');
  const total=document.getElementById('cartTotal');
  if(items&&saved.length)items.innerHTML=saved.map(x=>{const p=findProduct(x.id);return `<div class="cart-row"><div><strong>${p?.[1]||'Medicine'}</strong><div class="small">${p?.[2]||'Loading medicine details...'}</div></div><div class="qty">${x.q}</div><strong>${p?'₹'+(Number(p[3])*x.q).toFixed(2):'—'}</strong></div>`}).join('');
  else if(items)items.innerHTML="<p class='muted'>Your cart is empty.</p>";
  if(total)total.textContent='₹'+saved.reduce((sum,x)=>{const p=findProduct(x.id);return sum+(p?Number(p[3])*x.q:0)},0).toFixed(2);
  const more=document.getElementById('cartAddMoreButton');if(more)more.hidden=saved.length===0;
}
function render(){
  if(!valid()){renderRaw();return}
  let count=0,total=0;
  const rows=cart.map(x=>{const p=products[x.i];if(!p)return '';const q=Number(x.q)||1,price=Number(p[3])||0;count+=q;total+=price*q;return `<div class="cart-row"><div><strong>${p[1]}</strong><div class="small">${p[2]}</div></div><div class="qty"><button type="button" onclick="changeQty(${x.i},-1)">−</button> ${q} <button type="button" onclick="changeQty(${x.i},1)">+</button></div><strong>₹${(price*q).toFixed(2)}</strong></div>`}).join('');
  const c=document.getElementById('cartCount');if(c)c.textContent=count;
  const t=document.getElementById('cartTotal');if(t)t.textContent='₹'+total.toFixed(2);
  const items=document.getElementById('cartItems');if(items)items.innerHTML=rows||"<p class='muted'>Your cart is empty.</p>";
  const more=document.getElementById('cartAddMoreButton');if(more)more.hidden=cart.length===0;
}
function add(i){if(!valid())return;const p=products[i];if(!p)return;const stock=Number(p[4]?.stock??0);if(stock<=0){alert('This medicine is currently out of stock.');return}const x=cart.find(v=>Number(v.i)===Number(i));if(x){if(x.q>=stock){alert('Only '+stock+' unit(s) available.');return}x.q++}else cart.push({i:Number(i),q:1});hydrated=true;persist();render()}
function qty(i,d){if(!valid())return;const x=cart.find(v=>Number(v.i)===Number(i));if(!x)return;const stock=Number(products[i]?.[4]?.stock??0);if(d>0&&x.q>=stock){alert('Only '+stock+' unit(s) available.');return}x.q+=Number(d);if(x.q<=0)cart.splice(cart.indexOf(x),1);persist();render()}
function open(){const o=document.getElementById('cartOverlay');if(!o)return false;o.classList.add('open');o.style.display='flex';o.setAttribute('aria-hidden','false');renderRaw();if(valid()&&products.length)fromStorage();else hydrateFromDatabase();return true}
function close(e){const o=document.getElementById('cartOverlay');if(!o)return;if(!e||e.target===o){o.classList.remove('open');o.style.removeProperty('display');o.setAttribute('aria-hidden','true');if(location.hash==='#cart')history.replaceState(null,'',location.pathname+location.search)}}
function restoreUser(id){if(!id)return;const saved=read(USER_PREFIX+id);write(saved);renderRaw();if(valid()&&products.length)fromStorage();else hydrateFromDatabase()}
function parkUser(id){if(id)write(snapshot(),USER_PREFIX+id);write([]);if(valid()){cart.length=0;render()}else renderRaw();window.dispatchEvent(new Event('cartLogoutHide'))}
function bind(){const b=document.getElementById('mainCartButton');if(b&&!b.dataset.v4Bound){b.dataset.v4Bound='1';b.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();open()},true)}const o=document.getElementById('cartOverlay');if(o&&!o.dataset.v4OverlayBound){o.dataset.v4OverlayBound='1';o.addEventListener('click',function(e){if(e.target===o)close(e)},true)}}
window.addToCart=add;window.changeQty=qty;window.updateCart=function(){render();persist()};window.openCart=open;window.closeCart=close;window.openCartPanel=open;window.reloadCartFromStorage=fromStorage;window.cartV4RestoreForUser=restoreUser;window.cartV4ParkForUser=parkUser;window.cartV4Read=()=>read();window.cartV4Key=KEY;
window.addEventListener('medicinesReady',()=>{hydrated=true;fromStorage()});window.addEventListener('storage',e=>{if(e.key===KEY){renderRaw();if(valid()&&products.length)fromStorage();else hydrateFromDatabase()}});window.addEventListener('cartUpdated',()=>{if(document.getElementById('cartOverlay')?.classList.contains('open'))renderRaw();});window.addEventListener('hashchange',()=>{if(location.hash==='#cart')open()});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();window.addEventListener('load',bind);setTimeout(bind,100);setTimeout(bind,500);if(location.hash==='#cart')setTimeout(open,50);window.addEventListener('beforeunload',persist);
})();
