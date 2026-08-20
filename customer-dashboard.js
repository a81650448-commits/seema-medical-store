// Seema Medical Store - Customer Dashboard
(function () {
  function dashboardElement(id) { return document.getElementById(id); }

  window.openCustomerDashboard = function () {
    const drawer = dashboardElement('customerDashboard');
    if (!drawer) return;
    drawer.classList.add('open');
    document.body.classList.add('dashboard-open');
  };

  window.closeCustomerDashboard = function () {
    const drawer = dashboardElement('customerDashboard');
    if (!drawer) return;
    drawer.classList.remove('open');
    document.body.classList.remove('dashboard-open');
  };

  window.dashboardGoTo = function (target) {
    closeCustomerDashboard();
    setTimeout(function () {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeCustomerDashboard();
  });
})();
