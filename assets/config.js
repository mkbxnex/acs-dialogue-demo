/** Demo config. Fetch browser key is intentionally public (Webtzm browser key). */
window.ACS_CONFIG = {
  basePath: (function () {
    const p = location.pathname;
    if (p.includes("/acs-dialogue-demo")) return "/acs-dialogue-demo";
    return "";
  })(),
  eventTitle: "Secular Dialogue Evening — Singapore",
  eventDate: "Saturday, 18 October 2026 · 7:00–9:30pm SGT",
  eventVenue: "Community hall, central Singapore (address shared after registration)",
  registerFormId: "frm_fc193cb551934e23b6b5a227264a4ccc",
  attendanceUpdateFormId: "frm_b1b3d3c5822c4bf2abc26e17b579d7b7",
  certificateFormId: "frm_62ed5e785aa04e26905a95389f97d374",
  fetchFormId: "frm_fc193cb551934e23b6b5a227264a4ccc",
  fetchBrowserKey: "wtzm_pk_0NyOZpjT77J0C-kDsf7tLwti9nM4_PfYAe6Kdl7WOO0",
  fetchBase: "https://webtzm.com/fetch",
  managerGate: "acs-demo-2026",
  webtzmSubmit: "https://webtzm.com/submit"
};
