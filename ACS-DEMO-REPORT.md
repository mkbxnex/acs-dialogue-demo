# ACS Secular Dialogue Evening — Webtzm demo experience report

**Date:** 2026-09-26 (Asia/Kuala_Lumpur)  
**Account:** mkbxnex@gmail.com (Complimentary Pro)  
**Host:** GitHub Pages (Netlify skipped — Pages already matched the allowed domain)  
**Nothing deleted:** workflows, Sheet, Drive PDFs, and site all kept for your own retest.

---

## What was built

A fictional **Atheist Community of Singapore** dialogue evening site that exercises Webtzm end-to-end in a realistic ops loop:

| Step | Webtzm feature | Demo surface |
|------|----------------|--------------|
| Public sign-up | **Create** → managed Google Sheet | https://mkbxnex.github.io/acs-dialogue-demo/ |
| Manager roster | **Record Fetch** (browser key) | `/manager/` |
| Mark attendance | **Update** keyed on `webtzm_id` | Manager attendance form |
| Issue certificate | **PDF output** (Google Doc template → PDF in Drive) | Manager certificate form |

### Live URLs
- **Public event:** https://mkbxnex.github.io/acs-dialogue-demo/
- **Manager dashboard:** https://mkbxnex.github.io/acs-dialogue-demo/manager/
- **Manager passphrase:** `acs-demo-2026`
- **Repo:** https://github.com/mkbxnex/acs-dialogue-demo

### Webtzm workflows (kept)
| Name | Form ID | Role |
|------|---------|------|
| ACS-Dialogue-Register | `frm_fc193cb551934e23b6b5a227264a4ccc` | Create + Fetch source |
| ACS-Dialogue-Attendance | `frm_b1b3d3c5822c4bf2abc26e17b579d7b7` | Update attendance_status |
| ACS-Dialogue-Certificate | `frm_62ed5e785aa04e26905a95389f97d374` | PDF certificate |

### Google artefacts (kept)
- **Roster Sheet:** https://docs.google.com/spreadsheets/d/1VQpnAXApRK831vJG7OmJYkwhgg6OiaK5VHwBxedjAFs/edit
- **Register Drive folder:** https://drive.google.com/drive/folders/1yG3hamu3QDPmJwp4WCvfBsFLxs1ggRMB
- **Certificate Drive folder:** https://drive.google.com/drive/folders/1OJz_wQI-92FNWJN2ogbmRPFJmNEC2db9
- **Certificate Doc template:** https://docs.google.com/document/d/1DrmuOpeQyqJEG3yh96yVWk6LYWaHr2G9UmSqRNtKve8/edit

---

## E2E test results (fictional visitor)

| Flow | Result |
|------|--------|
| Register `Test Visitor ACS` | Accepted after enhance.js recovery; later Delivered to Sheet |
| Record ID | `34a76e23-b252-422f-9955-e8e3fe7da18b` |
| Fetch in manager | HTTP 200; row listed |
| Update → Attended | Accepted; Sheet + Fetch eventually showed Attended |
| Issue PDF | Accepted; Drive file `ACS-Dialogue-Certificate — 2d83127a-ea35-400b-bd4f-f5b25cd6ec78.pdf` |
| Success redirect | Not configured (no easy control found during Edit) |
| Netlify | Skipped by design |

Evidence screenshots: `/workspace/acs_dialogue_demo/screenshots/`  
Detailed log: `/workspace/acs_dialogue_demo/notes/e2e-test.md`

---

## Experience notes (what worked well)

1. **Event-shaped product surface is strong.** Create → Sheet roster, Update on `webtzm_id`, Fetch JSON, and PDF-from-Doc map cleanly onto a community event ops story. The existing tutorials (`event-registration`, `update-a-record`, job-application PDF) match this demo almost 1:1.
2. **Managed Sheet + Fetch is the right pairing.** Fetch correctly refuses hand-picked Sheets; auto-created Sheet unlocked the manager dashboard without Apps Script.
3. **Update semantics are intuitive once understood.** Blank fields mean “leave alone”; attendance-only Update form is good access control.
4. **PDF via Google Doc template** is a compelling Pro story: restyle one Doc, every certificate follows. Drive folder delivery is easy to verify.
5. **Spam protection behaved as designed** when enhance.js was missing (403 verification) and when it was present (accept). Good teachable moment for “script must run.”
6. **GitHub Pages was enough.** Same `mkbxnex.github.io` allowed domain as prior UATs; no need for a second host.

---

## Friction found (and fixes / suggestions)

### Fixed already on the site
- **Bug:** Injecting Webtzm’s `<script src="enhance.js">` through `innerHTML` does **not** execute in browsers. First public submit got 403 verification.  
  **Fix pushed:** load styles/scripts with `document.createElement` in `register-embed.js` (and versioned URLs). Redeployed to Pages.

### Product / docs suggestions for Webtzm
1. **Embed snippet warning:** In Setup / Copy HTML docs, call out that script tags pasted via JS `innerHTML` will not run; recommend static HTML paste or programmatic `createElement`.
2. **Success redirect discoverability:** During Edit of this Advanced Create workflow, no obvious Success redirect control was found. Either surface it more clearly next to Allowed domains / Delivery, or document the exact path for Advanced vs Easy.
3. **Fetch freshness UX for managers:** Standard (~60s) left the roster on `Registered` briefly after Update showed Attended in the Sheet. For door-check dashboards, default Fetch panel copy could recommend **Live** when “attendance board” is the use case.
4. **Certificate ↔ registration link:** PDF workflow is a separate Create (correct for one-output design), so the manager must copy fields. A future “issue PDF for record X” that reads the Sheet row by `webtzm_id` would close the loop without a second form.
5. **Browser Fetch key:** Fine for a demo; for a real ACS event, prefer a **Netlify/Cloudflare Function + server key**, or Netlify Identity in front of `/manager/`. The demo passphrase is only theatre.
6. **Field labels in generated HTML** still used raw parameter names (`full_name`) in the copied snippet; the public page overrides with human labels. Template “Event registration” humanization helps first-time organisers.
7. **webtzm_id visibility:** Sheet UI hid column A in the visible grid during the test; managers relying on the Sheet alone may struggle. Fetch returning `webtzm_id` (as we enabled) is the better path — keep recommending Record id in Fetch docs for Update/Delete loops.
8. **Optional:** Submitter receipt with the record ID (and a deep link to a self-serve “change booking” page) would showcase Update for attendees, not only managers.

### Site / demo suggestions (optional next polish)
- Add success redirect to `/thanks/` once the Easy/Advanced control is located.
- Add a short “How this demo uses Webtzm” panel with links to the three workflows’ Setup pages (owner-only).
- Consider Netlify Identity later only if you want a public marketing hostname separate from GitHub Pages.

---

## How you can retest (keep everything)

1. Open the public URL; submit another fictional registration (wait a couple of seconds for enhance.js).
2. Open `/manager/`, passphrase `acs-demo-2026`, Refresh roster.
3. Attendance → Attended; wait up to ~1 minute; Refresh again.
4. Certificate → Issue PDF; check the certificate Drive folder.

Do not archive the three `ACS-Dialogue-*` workflows if you still want this demo live.
