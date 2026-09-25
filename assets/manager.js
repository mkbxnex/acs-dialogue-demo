(function () {
  const c = window.ACS_CONFIG || {};
  const gateCard = document.getElementById('gate-card');
  const dash = document.getElementById('dash');
  const gateInput = document.getElementById('gate');
  const gateErr = document.getElementById('gate-err');

  function unlock() {
    if ((gateInput.value || '') !== (c.managerGate || '')) {
      gateErr.classList.remove('hidden');
      return;
    }
    gateErr.classList.add('hidden');
    gateCard.classList.add('hidden');
    dash.classList.remove('hidden');
    sessionStorage.setItem('acs_mgr', '1');
    mountForms();
    refreshRoster();
  }

  document.getElementById('gate-btn').addEventListener('click', unlock);
  gateInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') unlock(); });
  if (sessionStorage.getItem('acs_mgr') === '1') {
    gateCard.classList.add('hidden');
    dash.classList.remove('hidden');
    mountForms();
    refreshRoster();
  }

  document.getElementById('refresh-btn').addEventListener('click', refreshRoster);

  function mountForms() {
    const att = document.getElementById('attendance-form-slot');
    const cert = document.getElementById('certificate-form-slot');
    if (c.attendanceUpdateFormId) {
      att.innerHTML = `
<form class="wtzm-form" id="attendance-form" action="https://webtzm.com/submit" method="post"
  data-webtzm-form="${c.attendanceUpdateFormId}" data-wtzm-enhancement="client"
  data-wtzm-spam-protection="on" data-wtzm-format-events="submit"
  data-wtzm-validation-style="red" data-wtzm-block-invalid="true"
  data-wtzm-validation-messages="true" data-wtzm-status-feedback="true"
  data-wtzm-lock-submit="true" data-wtzm-text-trim="true" data-wtzm-text-clean="true">
  <input type="hidden" name="_webtzm_form" value="${c.attendanceUpdateFormId}">
  <div data-wtzm-field="webtzm_id">
    <label for="webtzm_id">Record ID <span class="wtzm-required">*</span></label>
    <input id="webtzm_id" name="webtzm_id" type="text" required placeholder="Paste or use Select on a roster row">
  </div>
  <div data-wtzm-field="attendance_status">
    <label for="attendance_status">Attendance status <span class="wtzm-required">*</span></label>
    <select id="attendance_status" name="attendance_status" required>
      <option value="">Select…</option>
      <option>Registered</option>
      <option>Attended</option>
      <option>No-show</option>
    </select>
  </div>
  <p data-wtzm-send-status role="status" aria-live="polite"></p>
  <button class="wtzm-submit" type="submit">Save attendance</button>
</form>`;
    } else att.innerHTML = '<p class="err">Update form id not configured.</p>';

    if (c.certificateFormId) {
      cert.innerHTML = `
<form class="wtzm-form" id="certificate-form" action="https://webtzm.com/submit" method="post"
  data-webtzm-form="${c.certificateFormId}" data-wtzm-enhancement="client"
  data-wtzm-spam-protection="on" data-wtzm-format-events="submit"
  data-wtzm-validation-style="red" data-wtzm-block-invalid="true"
  data-wtzm-validation-messages="true" data-wtzm-status-feedback="true"
  data-wtzm-lock-submit="true" data-wtzm-text-trim="true" data-wtzm-text-clean="true"
  data-wtzm-timestamp-zone="Asia/Singapore">
  <input type="hidden" name="_webtzm_form" value="${c.certificateFormId}">
  <div data-wtzm-field="full_name">
    <label for="cert_full_name">Participant name <span class="wtzm-required">*</span></label>
    <input id="cert_full_name" name="full_name" type="text" required>
  </div>
  <div data-wtzm-field="email">
    <label for="cert_email">Email <span class="wtzm-required">*</span></label>
    <input id="cert_email" name="email" type="email" required>
  </div>
  <div data-wtzm-field="dialogue_track">
    <label for="cert_track">Dialogue track</label>
    <input id="cert_track" name="dialogue_track" type="text">
  </div>
  <div data-wtzm-field="event_title">
    <label for="cert_event">Event title</label>
    <input id="cert_event" name="event_title" type="text" value="${c.eventTitle || ''}">
  </div>
  <div data-wtzm-field="event_date">
    <label for="cert_date">Event date</label>
    <input id="cert_date" name="event_date" type="text" value="${c.eventDate || ''}">
  </div>
  <div data-wtzm-field="source_record_id">
    <label for="cert_rid">Source registration record ID</label>
    <input id="cert_rid" name="source_record_id" type="text">
  </div>
  <p data-wtzm-send-status role="status" aria-live="polite"></p>
  <button class="wtzm-submit" type="submit">Issue PDF certificate</button>
</form>`;
    } else cert.innerHTML = '<p class="err">Certificate form id not configured.</p>';

    if (!document.getElementById('wtzm-enhance')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://webtzm.com/assets/styles/public-form.css?v=20260925-public-form-12';
      document.head.appendChild(link);
      const s = document.createElement('script');
      s.id = 'wtzm-enhance';
      s.src = 'https://webtzm.com/assets/enhance.js?v=20260925-public-form-12';
      s.defer = true;
      document.body.appendChild(s);
    }
  }

  async function refreshRoster() {
    const status = document.getElementById('fetch-status');
    const tbody = document.querySelector('#roster tbody');
    if (!c.fetchFormId || !c.fetchBrowserKey) {
      status.textContent = 'Fetch form id or browser key missing in config.js';
      status.className = 'err';
      return;
    }
    status.textContent = 'Fetching…';
    status.className = '';
    try {
      const url = `${c.fetchBase}/${c.fetchFormId}?limit=100`;
      const res = await fetch(url, {
        headers: { Authorization: 'Bearer ' + c.fetchBrowserKey }
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      if (!res.ok) {
        status.textContent = `Fetch HTTP ${res.status}: ${text.slice(0, 200)}`;
        status.className = 'err';
        return;
      }
      const rows = data.records || data.rows || data.items || (Array.isArray(data) ? data : []);
      tbody.innerHTML = '';
      if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="6">No records yet.</td></tr>';
      }
      for (const row of rows) {
        const id = row.webtzm_id || row.recordId || row.id || '';
        const name = row.full_name || row.name || '';
        const email = row.email || '';
        const track = row.dialogue_track || '';
        const att = row.attendance_status || '—';
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHtml(name)}</td>
          <td>${escapeHtml(email)}</td>
          <td>${escapeHtml(track)}</td>
          <td><span class="status-pill status-${String(att).replace(/\s/g, '-')}">${escapeHtml(att)}</span></td>
          <td><code>${escapeHtml(id)}</code></td>
          <td>
            <button type="button" class="secondary" data-act="attend">Attendance</button>
            <button type="button" class="secondary" data-act="cert">Certificate</button>
          </td>`;
        tr.querySelector('[data-act="attend"]').addEventListener('click', () => {
          const idEl = document.getElementById('webtzm_id');
          if (idEl) idEl.value = id;
          const st = document.getElementById('attendance_status');
          if (st) st.value = 'Attended';
          idEl && idEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        tr.querySelector('[data-act="cert"]').addEventListener('click', () => {
          const set = (i, v) => { const el = document.getElementById(i); if (el) el.value = v || ''; };
          set('cert_full_name', name);
          set('cert_email', email);
          set('cert_track', track);
          set('cert_rid', id);
          set('cert_event', c.eventTitle);
          set('cert_date', c.eventDate);
          document.getElementById('cert_full_name')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        tbody.appendChild(tr);
      }
      status.textContent = `Loaded ${rows.length} record(s) · HTTP ${res.status}`;
      status.className = 'okmsg';
    } catch (e) {
      status.textContent = 'Fetch failed: ' + e.message;
      status.className = 'err';
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[ch]);
  }
})();
