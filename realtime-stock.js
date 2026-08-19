/* Live medicine/stock updates for the public store. Isolated add-on. */
(function(){
  'use strict';
  function start(){
    if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY)return;
    const db=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
    db.channel('public-medicines-live')
      .on('postgres_changes',{event:'*',schema:'public',table:'medicines'},function(){
        if(typeof window.loadMedicines==='function') window.loadMedicines();
      })
      .subscribe();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
