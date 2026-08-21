// Seema Medical Store - Supabase connection
// Replace ONLY the value after SUPABASE_ANON_KEY with the publishable key you copied.
// Do NOT use a secret/service_role key here.

window.SUPABASE_URL = "https://fdqgknsevrvejptxeiyn.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkcWdrbnNldnJ2ZWpwdHhlaXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMDU0MTUsImV4cCI6MjEwMjY4MTQxNX0.jAdhngvutaGra7mMS5gR9FJSNHwli2ST5TNHDGTNRCE";

(function(){const s=document.createElement('script');s.src='billing.js?v=20260821-03';s.defer=true;document.head.appendChild(s);})();
(function(){const s=document.createElement('script');s.src='medicine-images.js?v=20260820-02';s.defer=true;document.head.appendChild(s);})();
(function(){if(!/admin\.html$/i.test(window.location.pathname)){const s=document.createElement('script');s.src='medicine-website-sync.js?v=20260821-01';s.defer=true;document.head.appendChild(s);}})();
(function(){const s=document.createElement('script');s.src='cart-page-nav.js?v=20260821-01';s.defer=true;document.head.appendChild(s);})();
// Admin-only medicine editor.
(function(){if(!/admin\.html$/i.test(window.location.pathname))return;const s=document.createElement('script');s.src='product-control-fixed.js?v=20260821-02';s.defer=true;document.head.appendChild(s);})();
// Admin-only category selector for the Medicine section.
(function(){if(!/admin\.html$/i.test(window.location.pathname))return;const s=document.createElement('script');s.src='admin-category-selector.js?v=20260821-01';s.defer=true;document.head.appendChild(s);})();
