(function(){
'use strict';
let c=null;
const e=id=>document.getElementById(id);
const PROD_URL='https://a81650448-commits.github.io/seema-medical-store/';
const CART_KEY='seema_cart_shared_v2';
const USER_CART_PREFIX='seema_cart_user_v1_';
function msg(t,err=false){const x=e('authMessage');if(x){x.textContent=t||'';x.className='auth-message '+(err?'error':'success')}}
function openCustomerAuth(m='login'){const x=e('customerAuthOverlay');if(x){x.classList.add('open');setAuthMode(m)}}
function closeCustomerAuth(){const x=e('customerAuthOverlay');if(x)x.classList.remove('open')}
function setAuthMode(m){e('loginPanel').hidden=m!=='login';e('signupPanel').hidden=m!=='signup';e('loginTab').classList.toggle('active',m==='login');e('signupTab').classList.toggle('active',m==='signup');msg('')}
function cartUserKey(userId){return USER_CART_PREFIX+String(userId)}
function readCart(key){try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[]}catch(err){return[]}}
function writeCart(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(err){console.error('CART SAVE ERROR',err)}}
function parkCartForUser(userId){
  if(!userId)return;
  const current=readCart(CART_KEY);
  if(current.length)writeCart(cartUserKey(userId),current);
  try{localStorage.removeItem(CART_KEY)}catch(err){console.error('CART CLEAR ERROR',err)}
  if(Array.isArray(window.cart))window.cart.length=0;
  if(typeof window.updateCart==='function')window.updateCart();
}
function restoreCartForUser(userId){
  if(!userId)return;
  const key=cartUserKey(userId),saved=readCart(key);
  if(saved.length)writeCart(CART_KEY,saved);
  else{try{localStorage.removeItem(CART_KEY)}catch(err){}}
  try{localStorage.removeItem(key)}catch(err){}
  if(typeof window.dispatchEvent==='function')window.dispatchEvent(new Event('medicinesReady'));
  if(typeof window.updateCart==='function')window.updateCart();
}
async function loginCustomer(ev){
 ev.preventDefault();
 if(!c){msg('Customer login is not configured yet.',true);return}
 msg('Signing in...');
 const{data,error}=await c.auth.signInWithPassword({email:e('loginEmail').value.trim(),password:e('loginPassword').value});
 if(error){msg(error.message,true);return}
 restoreCartForUser(data.user?.id);
 closeCustomerAuth();
 refreshCustomerUI();
}
async function signupCustomer(ev){
 ev.preventDefault();
 if(!c){msg('Customer login is not configured yet.',true);return}
 const name=e('signupName').value.trim(),phone=e('signupPhone').value.trim(),email=e('signupEmail').value.trim(),password=e('signupPassword').value;
 if(password.length<6){msg('Password must be at least 6 characters.',true);return}
 msg('Creating your account...');
 const{data,error}=await c.auth.signUp({email,password,options:{data:{full_name:name,phone:phone},emailRedirectTo:PROD_URL}});
 if(error){msg(error.message,true);return}
 if(data.session){restoreCartForUser(data.user?.id);closeCustomerAuth();refreshCustomerUI()}
 else msg('Account created. Please check your email. The verification link will return you to Seema Medical Store.')
}
async function logoutCustomer(){
 if(!c)return;
 const{data}=await c.auth.getSession();
 const userId=data.session?.user?.id;
 // Preserve this customer's cart privately; do not leave it visible while logged out.
 parkCartForUser(userId);
 await c.auth.signOut();
 refreshCustomerUI();
}
async function refreshCustomerUI(){
 if(!c)return;
 const{data}=await c.auth.getSession(),u=data.session?.user||null;
 if(e('customerLoginBtn'))e('customerLoginBtn').hidden=!!u;
 if(e('customerAccount'))e('customerAccount').hidden=!u;
 if(e('customerNameDisplay'))e('customerNameDisplay').textContent=u?.user_metadata?.full_name||u?.email||'Customer';
}
async function init(){
 if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY){console.error('Supabase configuration missing');return}
 c=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
 window.seemaCustomerAuth=c;
 await refreshCustomerUI();
 c.auth.onAuthStateChange((event,session)=>{
   setTimeout(()=>{
     refreshCustomerUI();
     if(event==='SIGNED_IN'&&session?.user)restoreCartForUser(session.user.id);
   },0)
 });
}
window.openCustomerAuth=openCustomerAuth;
window.closeCustomerAuth=closeCustomerAuth;
window.setAuthMode=setAuthMode;
window.loginCustomer=loginCustomer;
window.signupCustomer=signupCustomer;
window.logoutCustomer=logoutCustomer;
init();
})();