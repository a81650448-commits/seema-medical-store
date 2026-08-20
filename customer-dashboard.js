// Seema Medical Store - Customer Dashboard
(function () {
  function dashboardElement(id) { return document.getElementById(id); }

  function buildDashboard() {
    if (dashboardElement('customerDashboard')) return;

    const style = document.createElement('style');
    style.textContent = `
      /* Keep the main header clean: dashboard now contains these customer shortcuts. */
      .topbar nav > a,
      .topbar nav > #customerLoginBtn,
      .topbar nav > #customerAccount,
      .topbar nav > .cart-btn{display:none!important}
      .customer-dashboard-trigger{position:fixed;left:0;top:42%;z-index:40;border:0;background:#087443;color:#fff;padding:13px 10px;border-radius:0 12px 12px 0;font-weight:800;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.18);writing-mode:vertical-rl;transform:rotate(180deg)}
      .customer-dashboard-overlay{position:fixed;inset:0;background:rgba(4,20,14,.48);z-index:50;opacity:0;visibility:hidden;transition:.2s ease}
      .customer-dashboard-overlay.open{opacity:1;visibility:visible}
      .customer-dashboard-drawer{position:absolute;left:0;top:0;height:100%;width:min(360px,88vw);background:#fff;box-shadow:12px 0 40px rgba(0,0,0,.18);transform:translateX(-100%);transition:.25s ease;overflow:auto;padding-bottom:24px}
      .customer-dashboard-overlay.open .customer-dashboard-drawer{transform:translateX(0)}
      .dashboard-head{background:#0b356d;color:#fff;padding:22px 20px 18px;display:flex;align-items:flex-start;justify-content:space-between}
      .dashboard-head h2{margin:0;font-size:22px}.dashboard-head p{margin:6px 0 0;font-size:12px;color:#dce9f8}
      .dashboard-close{border:0;background:transparent;color:#fff;font-size:28px;cursor:pointer;line-height:1}
      .dashboard-profile{margin:18px;background:#f2f7f5;border:1px solid #dbe7e2;border-radius:14px;padding:15px}
      .dashboard-profile strong{display:block;color:#087443;font-size:15px}.dashboard-profile span{display:block;margin-top:5px;color:#68756f;font-size:12px;word-break:break-word}
      .dashboard-menu{padding:0 12px}.dashboard-menu button{width:100%;display:flex;align-items:center;gap:13px;text-align:left;border:0;background:#fff;padding:14px 12px;border-radius:10px;font:inherit;font-weight:700;color:#25362f;cursor:pointer;margin:3px 0}.dashboard-menu button:hover{background:#eaf3ef;color:#087443}.dashboard-icon{width:28px;text-align:center;font-size:19px}
      .dashboard-login{margin:14px 18px 0;width:calc(100% - 36px);border:0;background:#087443;color:#fff;padding:12px;border-radius:10px;font-weight:800;cursor:pointer}
      .dashboard-footer{padding:18px;text-align:center;color:#8a9691;font-size:11px}
      body.dashboard-open{overflow:hidden}
      @media(max-width:520px){.customer-dashboard-trigger{top:45%;padding:11px 8px;font-size:12px}.customer-dashboard-drawer{width:86vw}}
    `;
    document.head.appendChild(style);

    const trigger = document.createElement('button');
    trigger.className = 'customer-dashboard-trigger';
    trigger.type = 'button';
    trigger.innerHTML = '☰ Dashboard';
    trigger.setAttribute('aria-label', 'Open customer dashboard');
    trigger.onclick = window.openCustomerDashboard;
    document.body.appendChild(trigger);

    const overlay = document.createElement('div');
    overlay.id = 'customerDashboard';
    overlay.className = 'customer-dashboard-overlay';
    overlay.innerHTML = `
      <aside class="customer-dashboard-drawer" onclick="event.stopPropagation()">
        <div class="dashboard-head">
          <div><h2>👤 <span id="dashboardTitle">Customer Dashboard</span></h2><p>Seema Medical Store</p></div>
          <button class="dashboard-close" type="button" onclick="closeCustomerDashboard()">×</button>
        </div>
        <div class="dashboard-profile" id="dashboardProfile">
          <strong id="dashboardProfileName">Customer</strong>
          <span id="dashboardProfileEmail">Login to access your account</span>
        </div>
        <div class="dashboard-menu">
          <button type="button" onclick="dashboardGoTo('#products')"><span class="dashboard-icon">💊</span> Medicines</button>
          <button type="button" onclick="dashboardGoTo('#how')"><span class="dashboard-icon">🛒</span> How to Order</button>
          <button type="button" onclick="dashboardGoTo('#track-order')"><span class="dashboard-icon">📦</span> Track Order</button>
          <button type="button" onclick="openCustomerDashboardOrders()"><span class="dashboard-icon">📋</span> My Orders</button>
          <button type="button" onclick="dashboardGoTo('#contact')"><span class="dashboard-icon">📞</span> Contact Store</button>
          <button type="button" onclick="openDashboardCart()"><span class="dashboard-icon">🛍️</span> My Cart</button>
        </div>
        <button id="dashboardLoginButton" class="dashboard-login" type="button" onclick="openDashboardLogin()">👤 Customer Login</button>
        <div class="dashboard-footer">Secure customer area • Your orders & tracking</div>
      </aside>`;
    overlay.onclick = function (event) { if (event.target === overlay) closeCustomerDashboard(); };
    document.body.appendChild(overlay);

    refreshDashboardProfile();
  }

  function refreshDashboardProfile() {
    const title = dashboardElement('dashboardTitle');
    const name = dashboardElement('dashboardProfileName');
    const email = dashboardElement('dashboardProfileEmail');
    const loginButton = dashboardElement('dashboardLoginButton');
    if (!name || !email) return;

    const account = dashboardElement('customerAccount');
    const displayName = dashboardElement('customerNameDisplay');
    if (account && !account.hidden) {
      const customerName = (displayName && displayName.textContent.trim()) || 'Customer';
      name.textContent = customerName;
      email.textContent = 'Signed in to your customer account';
      if (title) title.textContent = customerName;
      if (loginButton) {
        loginButton.textContent = '✓ Account Active';
        loginButton.disabled = true;
        loginButton.style.opacity = '.7';
      }
    } else {
      name.textContent = 'Guest Customer';
      email.textContent = 'Login to access your account';
      if (title) title.textContent = 'Customer Dashboard';
      if (loginButton) {
        loginButton.textContent = '👤 Customer Login';
        loginButton.disabled = false;
        loginButton.style.opacity = '1';
      }
    }
  }

  window.refreshCustomerDashboard = refreshDashboardProfile;

  window.openCustomerDashboard = function () {
    const drawer = dashboardElement('customerDashboard');
    if (!drawer) return;
    refreshDashboardProfile();
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

  window.openCustomerDashboardOrders = function () {
    closeCustomerDashboard();
    setTimeout(function () {
      if (typeof window.openMyOrders === 'function') {
        window.openMyOrders();
      } else {
        const el = document.querySelector('#my-orders');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  window.openDashboardCart = function () {
    closeCustomerDashboard();
    setTimeout(function () {
      if (typeof window.openCart === 'function') window.openCart();
    }, 80);
  };

  window.openDashboardLogin = function () {
    closeCustomerDashboard();
    setTimeout(function () {
      if (typeof window.openCustomerAuth === 'function') window.openCustomerAuth('login');
    }, 80);
  };

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeCustomerDashboard();
  });

  // Update the dashboard immediately after Supabase login/logout.
  document.addEventListener('DOMContentLoaded', function () {
    buildDashboard();
    setTimeout(refreshDashboardProfile, 300);
  });
  if (document.readyState !== 'loading') {
    buildDashboard();
    setTimeout(refreshDashboardProfile, 300);
  }

  // customer-auth.js updates #customerNameDisplay when authentication changes.
  // Observe that element so the dashboard title changes without a page refresh.
  const observer = new MutationObserver(function () {
    refreshDashboardProfile();
  });
  const startObserver = function () {
    const displayName = dashboardElement('customerNameDisplay');
    if (displayName) observer.observe(displayName, { childList: true, characterData: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startObserver); else startObserver();
})();
