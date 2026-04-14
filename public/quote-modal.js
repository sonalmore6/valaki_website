(function () {
  /* ── Inject modal HTML ───────────────────────────────────────── */
  const productName = document.querySelector('h1.prod-title')?.textContent.trim() || '';

  const modalHTML = `
<div class="qm-overlay" id="quoteModal" onclick="handleOverlayClick(event)">
  <div class="qm-box" role="dialog" aria-modal="true" aria-labelledby="qmTitle">

    <div class="qm-header">
      <div class="qm-header-text">
        <h3 id="qmTitle">Get a Quote</h3>
        <p id="qmProductLabel">${productName ? 'Product: ' + productName : 'Fill in your requirements below'}</p>
      </div>
      <button class="qm-close" onclick="closeQuoteModal()" aria-label="Close">&times;</button>
    </div>

    <div class="qm-body">
      <div class="qm-row">
        <div class="qm-group">
          <label class="qm-label">Your Name *</label>
          <input type="text" class="qm-input" id="qmName" placeholder="Full Name">
        </div>
        <div class="qm-group">
          <label class="qm-label">Phone Number *</label>
          <input type="tel" class="qm-input" id="qmPhone" placeholder="10-digit mobile number" maxlength="10" inputmode="numeric">
          <span class="qm-field-error" id="qmPhoneError">Please enter a valid 10-digit mobile number.</span>
        </div>
      </div>

      <div class="qm-row">
        <div class="qm-group">
          <label class="qm-label">Email Address</label>
          <input type="email" class="qm-input" id="qmEmail" placeholder="you@company.com">
          <span class="qm-field-error" id="qmEmailError">Please enter a valid email address (e.g. you@example.com).</span>
        </div>
        <div class="qm-group">
          <label class="qm-label">Company Name</label>
          <input type="text" class="qm-input" id="qmCompany" placeholder="Your Company">
        </div>
      </div>

      <div class="qm-group">
        <label class="qm-label">Product Interest</label>
        <input type="text" class="qm-input" id="qmProduct" value="${productName}" placeholder="Product name or category">
      </div>

      <div class="qm-row">
        <div class="qm-group">
          <label class="qm-label">Quantity Required</label>
          <input type="text" class="qm-input" id="qmQty" placeholder="e.g. 5000 pcs / 500 kg">
        </div>
        <div class="qm-group">
          <label class="qm-label">Size / Grade</label>
          <input type="text" class="qm-input" id="qmSize" placeholder="e.g. M16 x 50mm, Grade 8.8">
        </div>
      </div>

      <div class="qm-group">
        <label class="qm-label">Message / Requirements</label>
        <textarea class="qm-textarea" id="qmMessage" placeholder="Describe your requirements — material, finish, delivery timeline..."></textarea>
      </div>

      <button class="qm-submit" id="qmSubmitBtn" onclick="submitQuoteForm()">
        <i class="fas fa-paper-plane" style="margin-right:8px"></i> Send Enquiry
      </button>

      <div class="qm-success" id="qmSuccess">
        <i class="fas fa-check-circle" style="color:#16A34A;margin-right:8px"></i>
        Thank you! Your enquiry has been received. We will contact you within 24 hours.
      </div>
      <div class="qm-error" id="qmError">
        <i class="fas fa-exclamation-circle" style="color:#DC2626;margin-right:8px"></i>
        Something went wrong. Please try WhatsApp or call us directly.
      </div>
    </div>

  </div>
</div>

<style>
.qm-field-error {
  visibility: hidden;
  color: #DC2626;
  font-size: 0.78rem;
  margin-top: 4px;
  display: block;
  min-height: 1.1em;
}
.qm-field-error.visible {
  visibility: visible;
}
</style>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  /* ── Phone: digits only, block 11th digit ────────────────────── */
  document.getElementById('qmPhone').addEventListener('keypress', function (e) {
    if (!/[0-9]/.test(e.key)) { e.preventDefault(); return; }
    if (this.value.length >= 10) { e.preventDefault(); }
  });
  document.getElementById('qmPhone').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
    setFieldError('qmPhone', 'qmPhoneError', false);
  });

  /* ── Email: clear error on edit ──────────────────────────────── */
  document.getElementById('qmEmail').addEventListener('input', function () {
    setFieldError('qmEmail', 'qmEmailError', false);
  });

  /* ── Keyboard close ──────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeQuoteModal();
  });

  function setFieldError(inputId, errorId, show) {
    const el  = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    el.style.borderColor = show ? '#DC2626' : '';
    err.classList.toggle('visible', show);
  }

  /* ── Public API ──────────────────────────────────────────────── */
  window.openQuoteModal = function () {
    document.getElementById('quoteModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('qmName').focus();
    /* reset state */
    document.getElementById('qmSuccess').style.display = 'none';
    document.getElementById('qmError').style.display   = 'none';
    setFieldError('qmPhone', 'qmPhoneError', false);
    setFieldError('qmEmail', 'qmEmailError', false);
    const btn = document.getElementById('qmSubmitBtn');
    btn.disabled  = false;
    btn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:8px"></i> Send Enquiry';
  };

  window.closeQuoteModal = function () {
    document.getElementById('quoteModal').classList.remove('active');
    document.body.style.overflow = '';
  };

  window.handleOverlayClick = function (e) {
    if (e.target === document.getElementById('quoteModal')) closeQuoteModal();
  };

  window.submitQuoteForm = async function () {
    const name    = document.getElementById('qmName').value.trim();
    const phone   = document.getElementById('qmPhone').value.trim();
    const email   = document.getElementById('qmEmail').value.trim();
    const company = document.getElementById('qmCompany').value.trim();
    const product = document.getElementById('qmProduct').value.trim();
    const qty     = document.getElementById('qmQty').value.trim();
    const size    = document.getElementById('qmSize').value.trim();
    const message = document.getElementById('qmMessage').value.trim();

    const phoneValid = phone.length === 10 && /^\d{10}$/.test(phone);
    const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const nameEl = document.getElementById('qmName');
    let hasError = false;

    nameEl.style.borderColor = !name ? '#DC2626' : '';
    if (!name) hasError = true;

    if (!phoneValid) { setFieldError('qmPhone', 'qmPhoneError', true); hasError = true; }
    else             { setFieldError('qmPhone', 'qmPhoneError', false); }

    if (!emailValid) { setFieldError('qmEmail', 'qmEmailError', true); hasError = true; }
    else             { setFieldError('qmEmail', 'qmEmailError', false); }

    if (!name)        nameEl.focus();
    else if (!phoneValid) document.getElementById('qmPhone').focus();
    else if (!emailValid) document.getElementById('qmEmail').focus();

    if (hasError) return;

    const btn = document.getElementById('qmSubmitBtn');
    btn.disabled  = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px"></i> Sending…';

    document.getElementById('qmSuccess').style.display = 'none';
    document.getElementById('qmError').style.display   = 'none';

    try {
      const res = await fetch('/send-enquiry', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, phone, email, company, product, quantity: qty, size_grade: size, message })
      });
      const data = await res.json();

      if (data.success) {
        document.getElementById('qmSuccess').style.display = 'block';
        ['qmName','qmPhone','qmEmail','qmCompany','qmQty','qmSize','qmMessage'].forEach(id => {
          document.getElementById(id).value = '';
        });
        btn.innerHTML = '<i class="fas fa-check" style="margin-right:8px"></i> Enquiry Sent!';
        setTimeout(() => closeQuoteModal(), 1500);
      } else {
        document.getElementById('qmError').style.display = 'block';
        btn.disabled  = false;
        btn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:8px"></i> Send Enquiry';
      }
    } catch (err) {
      document.getElementById('qmError').style.display = 'block';
      btn.disabled  = false;
      btn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:8px"></i> Send Enquiry';
    }
  };
})();
