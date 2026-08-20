// Seema Medical Store - Supabase connection
// Replace ONLY the value after SUPABASE_ANON_KEY with the publishable key you copied.
// Do NOT use a secret/service_role key here.

window.SUPABASE_URL = "https://fdqgknsevrvejptxeiyn.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJkcWdrbnNldnJ2ZWpwdHhlaXluIiwicmVmIjoiZmR3Z2tuc2V2cnZlanB0eGl5biIsImFub24iLCJpYXQiOjE3ODcxMDU0MTUsImV4cCI6MjEwMjY4MTQxNX0.jAdhngvutaGra7mMS5gR9FJSNHwli2ST5TNHDGTNRCE";

// Load the billing module after Supabase configuration is available.
(function(){
  const s=document.createElement('script');
  s.src='billing.js?v=20260821-01';
  s.defer=true;
  document.head.appendChild(s);
})();

// Actual medicine packaging images with a proxy fallback for GitHub Pages.
(function(){
  const s=document.createElement('script');
  s.src='medicine-images.js?v=20260820-02';
  s.defer=true;
  document.head.appendChild(s);
})();

// Admin-only product price/stock controls and medicine list refresh.
(function(){
  if(!/admin\\.html$/i.test(window.location.pathname)) return;
  const s=document.createElement('script');
  s.src='product-control.js?v=20260821-02';
  s.defer=true;
  document.head.appendChild(s);
})();
