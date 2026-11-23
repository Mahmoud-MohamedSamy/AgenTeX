// Evidence for the NDC-2751 side note (empty website list), TAVI vs Zoho Desk live, 19 Nov 2026.
const fs = require('fs'); const path = require('path'); const D = __dirname;
fs.mkdirSync(path.join(D, 'specs-bugs'), { recursive: true });
fs.writeFileSync(path.join(D, 'cards', 'wf-empty-list-card.json'), JSON.stringify({
  out: 'wf-empty-list-card.png', host: 'staging-crm.taviportal.com (public form API) + desk.zoho.com', who: 'website visitor (signed out)', date: '19 Nov 2026',
  title: 'Web form with NO website listed, code pasted on http://127.0.0.1:5500 · TAVI (CRM + Desk) vs Zoho Desk live',
  rows: [
    ['1 TAVI CRM "QA RT18 2959 form", list empty', 'POST /api/v1/web-forms/public/{key}/session  (Origin: http://127.0.0.1:5500)', '404 — then GET form 404 WEB_FORM_NOT_FOUND "This form is not available." → page stays blank', 'bad'],
    ['2 TAVI Desk "QA RT22 2751 desk empty", list empty', 'same script code, same page', '404 on /session → page stays blank', 'bad'],
    ['3 TAVI Embed dialog (both apps)', 'Embed code › How to use it, step 3', '"No website is listed in the form\'s settings, so any website can show it."', 'info'],
    ['4 TAVI same CRM form, website listed', 'Settings › Websites the form is on = http://127.0.0.1:5500', '200 · form shown and submitted ("QA RT18 2959 thank you")', 'ok'],
    ['5 Zoho Desk Feedback Widget (live, techegysolutions)', 'Settings have no website/domain option; script pasted on the same page', 'Feedback tab shown; form (Name, Email, Subject, …) opens on the outside website', 'ok']]
}, null, 1));
fs.writeFileSync(path.join(D, 'specs-bugs', 'BUG-wf-empty-website-list-vs-zoho.json'), JSON.stringify({
  out: 'BUG-wf-empty-website-list-vs-zoho.png', ticket: 'NEW BUG', priority: 'medium', label: 'TAVI vs ZOHO', verdict: 'FAIL',
  title: 'Web Forms | A form with no website listed shows on no website, although the Embed dialog says any website can show it',
  env: 'NDC-Staging (CRM + Desk) vs Zoho Desk live (techegysolutions) · signed-out Edge on a local test website http://127.0.0.1:5500 · 19 Nov 2026', date: '19 Nov 2026',
  panels: [
    { img: '2751-side-desk-dialog2.png', caption: 'TAVI Embed code dialog: "No website is listed … so any website can show it"', crop: [489, 400, 622, 230], boxes: [{ b: [505, 516, 1095, 560], n: 1, kind: 'INFO' }] },
    { w: 1280, h: 720, img: '2751-side-crm-empty.png', caption: 'TAVI: same code on the test website → blank (session 404)', crop: [0, 0, 640, 300], boxes: [{ b: [6, 70, 630, 290], n: 2, kind: 'FAIL' }] },
    { w: 1280, h: 900, img: '2751-side-zoho-site-open.png', caption: 'Zoho Desk live: no website setting at all; the form shows on the same outside page', crop: [0, 0, 1280, 680], boxes: [{ b: [160, 175, 1120, 656], n: 3, kind: 'PASS' }] },
    { img: 'wf-empty-list-card.png', caption: 'Requests and results', crop: [0, 0, 1600, 470], boxes: [{ b: [36, 99, 1564, 157], n: 2, kind: 'FAIL' }] }],
  rows: [
    [1, 'What TAVI tells the admin', 'Empty list = any website', '"No website is listed in the form\'s settings, so any website can show it." (CRM and Desk)', 'INFO'],
    [2, 'TAVI form with an empty list on a website', 'Form shows (as the dialog says)', 'Nothing shows: /session 404, "This form is not available." (CRM and Desk)', 'FAIL'],
    [3, 'Zoho Desk (live)', 'Reference', 'No website list exists; the pasted widget shows and opens on any website', 'PASS'],
    [4, 'TAVI with the website listed', '—', 'Works (form shows and submits) — only the empty-list case is broken', 'INFO']]
}, null, 1));
console.log('ok');
