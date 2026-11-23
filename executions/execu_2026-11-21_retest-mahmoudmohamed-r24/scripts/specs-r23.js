// Round 23 (19 Nov 2026 evening): specs + cards for NDC-2751, 2822, 3050, 3049, 3051.
const fs = require('fs'); const path = require('path');
const D = __dirname; const W = s => fs.writeFileSync(path.join(D, 'specs', s.ticket + '.json'), JSON.stringify(s, null, 1));
fs.writeFileSync(path.join(D, 'cards', '3051-r1-api-card.json'), JSON.stringify({ out: '3051-r1-api-card.png', title: 'NDC-3051 · Desk Data Backup · GET /api/v1/desk/data/backups · NDC-Staging (tenant …0004) owner · 19 Nov 2026', rows: [
  ['1 Backups on NDC-Staging', 'GET /desk/data/backups', '200 · data [] · total_count 0 — the tenant has no backup at all', 'info'],
  ['2 Expired backup needed', "ticket: full backup of 1 Nov on tenant …0002, expired 8 Nov", 'none on NDC-Staging; a new one would only expire after 7 days', 'bad'],
  ['3 Result', '—', 'BLOCKED: the expired state cannot be reached on NDC-Staging; state not changed', 'info']] }, null, 1));

W({ out: 'NDC-2751-retest-PASS.png', ticket: 'NDC-2751', priority: 'high', label: 'RETEST PASS', verdict: 'PASS', title: "Web Forms | Form added with the website code doesn't appear on the website (Desk and CRM)",
  env: 'NDC-Staging · signed-out Edge on http://127.0.0.1:5500 (local test site) · Desk "Tech Webform" + CRM "QA RT18 2959 form" (Leads) · "Add it to your website" script code', date: '19 Nov 2026',
  panels: [{ w: 1280, h: 1190, img: '2751-r1-desk-form.png', caption: 'Desk: the form appears on the website (iframe from the script), all 11 fields', crop: [0, 0, 620, 1180], boxes: [{ b: [8, 80, 608, 1176], n: 1, kind: 'PASS' }] },
    { w: 1280, h: 1000, img: '2751-r1-crm-after-submit.png', caption: "CRM: test submission shows the form's thank-you message", crop: [0, 0, 620, 300], boxes: [{ b: [8, 80, 608, 272], n: 3, kind: 'PASS' }] }],
  rows: [[1, 'Desk form on the website', 'Form appears', 'Shown in an iframe from the script; session 200 with access-control-allow-origin = the website', 'PASS'],
    [2, 'Desk test submission', 'Request submitted', '"Thank you. Your request has been submitted." · ticket created (channel web) · submissions 200', 'PASS'],
    [3, 'CRM form on the website + submit', 'Form appears and submits', 'Website listed in Settings › "Websites the form is on": form shown, "QA RT18 2959 thank you", lead created', 'PASS'],
    [4, 'Side note: CRM form with NO website listed', 'Embed dialog: "No website is listed… so any website can show it"', 'Form does not show: /session 404, GET form 404 WEB_FORM_NOT_FOUND "This form is not available." — dialog text and behaviour disagree', 'INFO']] });

W({ out: 'NDC-2822-retest-PARTIAL.png', ticket: 'NDC-2822', priority: 'medium', label: 'RETEST PARTIAL', verdict: 'PARTIAL', title: 'Web Forms | Form fields need their own validation, in the Front-End and in the Back-End',
  env: 'NDC-Staging · CRM Leads forms "QA RT22 2822 A" (text/number/decimal/date/lists) and "B" (email/phone/text, also Arabic) + Desk Tech Webform · signed-out Edge on 127.0.0.1:5500 + direct API', date: '19 Nov 2026',
  panels: [{ w: 1280, h: 1300, img: '2822-A-bad-blur.png', caption: 'Front-End: a message under each bad field on leaving it; Send blocked, focus on Full Name, values kept', crop: [0, 80, 620, 740], boxes: [{ b: [22, 118, 594, 190], n: 1, kind: 'PASS' }, { b: [22, 218, 594, 290], n: 1, kind: 'PASS' }, { b: [22, 318, 594, 390], n: 1, kind: 'PASS' }, { b: [22, 418, 594, 490], n: 1, kind: 'PASS' }] },
    { w: 1280, h: 1100, img: '2822-B-ar-blur.png', caption: 'Arabic form: right-to-left, Arabic messages', crop: [672, 80, 600, 460], boxes: [{ b: [686, 196, 1258, 266], n: 3, kind: 'PASS' }, { b: [686, 296, 1258, 366], n: 3, kind: 'PASS' }, { b: [686, 396, 1258, 466], n: 3, kind: 'PASS' }] },
    { img: '2822-r1-api-card.png', caption: 'Back-End: direct submissions (no form page)', crop: [0, 0, 1600, 600], boxes: [{ b: [36, 471, 1564, 529], n: 6, kind: 'FAIL' }] }],
  rows: [[1, 'Front-End rules (text min/max, spaces, number, decimal, date range, email, phone)', 'Message under the field, Send blocked, focus first invalid, values kept', 'All shown; Send blocked; focus Full Name; values kept; max length also stops typing at 10', 'PASS'],
    [2, 'Builder save refuses bad rules', 'Refused with a per-field error', "422: max below min, bad date, latest before earliest, rule the field can't take, length outside 1–255", 'PASS'],
    [3, 'Arabic', 'Messages in Arabic, RTL', 'dir=rtl, Arabic messages in the browser and from the server', 'PASS'],
    [4, 'Back-End direct API, CRM + Desk', '4xx, per-field error, no record', '422 WEB_FORM_INVALID with path/type/message per field; unknown field refused; no record created', 'PASS'],
    [5, 'Valid submission', 'Record with correct values', 'Lead saved: name trimmed, 42.0 → 42, decimal 2.5, date 2026-11-20', 'PASS'],
    [6, 'Whole number (Number field) with decimals', 'Refused in both layers (dev note lists a whole-number message)', '"5.5" accepted by the browser and the server (200); lead e51e9372 has number_2 = 5.5', 'FAIL'],
    [7, 'Not checked', '—', 'File type/size/count rules and hidden fields (not in the dev note)', 'INFO']] });

W({ out: 'NDC-3050-retest-PASS.png', ticket: 'NDC-3050', priority: 'low', label: 'RETEST PASS', verdict: 'PASS', title: 'Lead scoring | A scoring rule with no conditions and 0 points is saved and enabled',
  env: 'NDC-Staging (tenant …0004) · staging-omnichannel API · owner', date: '19 Nov 2026',
  panels: [{ img: '3050-r1-api-card.png', caption: 'Create and edit cases', crop: [0, 0, 1600, 480], boxes: [{ b: [36, 99, 1564, 157], n: 1, kind: 'PASS' }, { b: [36, 214, 1564, 272], n: 2, kind: 'PASS' }, { b: [36, 423, 1564, 460], n: 3, kind: 'PASS' }] }],
  rows: [[1, 'Name only (ticket step)', 'Refused', '400 "criteria must have at least one condition.", nothing saved', 'PASS'],
    [2, '0 points / no points / empty criteria', 'Refused', '400 with a clear message for each', 'PASS'],
    [3, 'Edit an existing rule to empty or 0', 'Refused', 'PATCH 400 both; rule unchanged (10 points, 1 condition)', 'PASS'],
    [4, 'Valid rule', 'Saved', '200, points 10, 1 condition', 'PASS']] });

W({ out: 'NDC-3049-retest-PASS.png', ticket: 'NDC-3049', priority: 'medium', label: 'RETEST PASS', verdict: 'PASS', title: 'Profiles | A custom profile cannot be deleted: "Resolve the pending invitations" although none exist',
  env: 'NDC-Staging (tenant …0004) · IAM API · owner · Omnichannel (salesiq) profiles copied from Associate · invites to @example.com', date: '19 Nov 2026',
  panels: [{ img: '3049-r1-api-card.png', caption: 'Delete refused only while an invitation is pending', crop: [0, 0, 1600, 540], boxes: [{ b: [36, 214, 1564, 272], n: 1, kind: 'PASS' }, { b: [36, 397, 1564, 455], n: 2, kind: 'PASS' }, { b: [36, 465, 1564, 523], n: 4, kind: 'INFO' }] }],
  rows: [[1, 'Delete while an invitation is pending', '409 PROFILE_INVITED (correct)', '409 "Resolve the pending invitations…"', 'PASS'],
    [2, 'Cancel the invitation, then delete', 'Profile deleted', 'Profile gone from the list', 'PASS'],
    [3, 'Delete the invited user, then delete', 'Profile deleted', 'Profile gone from the list', 'PASS'],
    [4, 'Notes', '—', 'Accept-then-delete path not run (needs a real mailbox); IAM writes answered 504 after ~10 s on staging tonight but took effect, also for a never-invited profile', 'INFO']] });

W({ out: 'NDC-3051-retest-BLOCKED.png', ticket: 'NDC-3051', priority: 'low', label: 'RETEST BLOCKED', verdict: 'BLOCKED', title: 'Data Backup | An expired backup gives "not finished" as the reason it cannot be restored',
  env: 'NDC-Staging (tenant …0004) · Desk API · owner', date: '19 Nov 2026',
  panels: [{ img: '3051-r1-api-card.png', caption: 'No backup exists on NDC-Staging', crop: [0, 0, 1600, 320], boxes: [{ b: [36, 99, 1564, 157], n: 1, kind: 'INFO' }] }],
  rows: [[1, 'Find an expired full backup', 'Backup with status expired', 'None: GET /desk/data/backups returns 0 backups', 'INFO'],
    [2, 'Reason shown for the expired backup', 'Expired reason', "Not testable here (the ticket's backup is on tenant …0002)", 'INFO']] });
console.log('specs written');
