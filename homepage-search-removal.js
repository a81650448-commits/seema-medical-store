// Homepage-only search removal.
// Inner category pages keep their own search boxes unchanged.
(function(){
  'use strict';
  function removeHomepageSearch(){
    if(!/\/index\.html$/i.test(window.location.pathname) && window.location.pathname!=='/' && window.location.pathname!=='') return;
    document.querySelectorAll('#search, .homepage-search, [data-homepage-search]').forEach(el=>el.remove());
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',removeHomepageSearch);
  else removeHomepageSearch();
})();
