// Seema Medical Store - Supabase connection
// Replace ONLY the value after SUPABASE_ANON_KEY with the publishable key you copied.
// Do NOT use a secret/service_role key here.

window.SUPABASE_URL = "https://fdqgknsevrvejptxeiyn.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkcWdrbnNldnJ2ZWpwdHhlaXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMDU0MTUsImV4cCI6MjEwMjY4MTQxNX0.jAdhngvutaGra7mMS5gR9FJSNHwli2ST5TNHDGTNRCE";

// Load the billing module after Supabase configuration is available.
(function(){
  const s=document.createElement('script');
  s.src='billing.js?v=20260819-15';
  s.defer=true;
  document.head.appendChild(s);
})();

// Replace the category-page placeholder illustrations with actual medicine packaging images.
(function(){
  const s=document.createElement('script');
  s.src='medicine-images.js?v=20260820-01';
  s.defer=true;
  document.head.appendChild(s);
})();
