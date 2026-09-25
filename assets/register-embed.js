(function () {
  const c = window.ACS_CONFIG || {};
  const slot = document.getElementById('register-form-slot');
  if (!slot) return;
  if (!c.registerFormId) {
    slot.innerHTML = '<p class="err">Registration form not wired yet.</p>';
    return;
  }
  slot.innerHTML = `
<form class="wtzm-form" action="https://webtzm.com/submit" method="post"
  data-webtzm-form="${c.registerFormId}"
  data-wtzm-enhancement="client"
  data-wtzm-spam-protection="on"
  data-wtzm-format-events="submit"
  data-wtzm-validation-style="red"
  data-wtzm-block-invalid="true"
  data-wtzm-validation-messages="true"
  data-wtzm-status-feedback="true"
  data-wtzm-lock-submit="true"
  data-wtzm-text-trim="true"
  data-wtzm-text-clean="true"
  data-wtzm-timestamp-zone="Asia/Singapore">
  <input type="hidden" name="_webtzm_form" value="${c.registerFormId}">
  <input type="hidden" name="attendance_status" value="Registered">
  <div data-wtzm-field="full_name">
    <label for="full_name">Full name <span class="wtzm-required" aria-hidden="true">*</span></label>
    <input id="full_name" name="full_name" type="text" required placeholder="As you would like it on a certificate">
  </div>
  <div data-wtzm-field="email">
    <label for="email">Email <span class="wtzm-required" aria-hidden="true">*</span></label>
    <input id="email" name="email" type="email" required placeholder="you@example.com">
  </div>
  <div data-wtzm-field="affiliation">
    <label for="affiliation">Affiliation (optional)</label>
    <input id="affiliation" name="affiliation" type="text" placeholder="ACS member, guest, other community…">
  </div>
  <div data-wtzm-field="dialogue_track">
    <label for="dialogue_track">Preferred dialogue track <span class="wtzm-required" aria-hidden="true">*</span></label>
    <select id="dialogue_track" name="dialogue_track" required>
      <option value="">Select…</option>
      <option>Ethics without dogma</option>
      <option>Secular community in Singapore</option>
      <option>Open floor / mixed</option>
    </select>
  </div>
  <div data-wtzm-field="access_notes">
    <label for="access_notes">Access or dietary notes</label>
    <textarea id="access_notes" name="access_notes" rows="3" placeholder="Optional"></textarea>
  </div>
  <p data-wtzm-send-status role="status" aria-live="polite"></p>
  <button class="wtzm-submit" type="submit">Submit registration</button>
</form>`;

  function ensureStylesheet(href) {
    if ([...document.styleSheets].some((s) => s.href && s.href.includes(href.split('?')[0].split('/').pop()))) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  function ensureScript(src, id) {
    if (id && document.getElementById(id)) return;
    if ([...document.scripts].some((s) => s.src && s.src.indexOf(src.split('?')[0]) !== -1)) return;
    const s = document.createElement('script');
    if (id) s.id = id;
    s.src = src;
    s.defer = true;
    document.body.appendChild(s);
  }
  const v = '20260925-public-form-12';
  ensureStylesheet('https://webtzm.com/assets/styles/public-form.css?v=' + v);
  ensureScript('https://webtzm.com/assets/enhance.js?v=' + v, 'wtzm-enhance-public');
})();
