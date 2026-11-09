// Builds ndc-2392/plane-draft.html and ndc-2417/plane-draft.html (review page + the compact Plane comment HTML). Nothing is posted.
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const T = {
  'ndc-2392': {
    title: 'NDC-2392 — CRM + Desk Integration missing list: recheck 9 Nov 2026',
    images: ['ev-A-sync-settings-vs-zoho.png', 'ev-B-agent-views-vs-zoho.png', 'ev-C-crm-side-vs-zoho.png', 'ev-D-access-users-vs-zoho.png'],
    comment: '<h2>Recheck on staging, 9 Nov 2026 (tenant NDC-Staging)</h2>' +
      '<p>Every item was checked again on NDC-Staging (owner account) with the integration connected. Numbers follow this ticket. Result: <strong>4 built, 2 partly built, 11 still missing, 2 not checked</strong>. The related bugs NDC-2393..2410 are all Done.</p>' +
      '<p><strong>Built now</strong></p><ul>' +
      '<li>2. Sync only records in chosen CRM list views ("Sync only records in these CRM views").</li>' +
      '<li>3. Contact matching "Primary and secondary email", with the overwrite warning.</li>' +
      '<li>4. "Delete the Desk contact / account only if nothing is linked to it".</li>' +
      '<li>14. "Contact owner (CRM)" is offered when typing @ in a ticket comment.</li></ul>' +
      '<p><strong>Partly built</strong></p><ul>' +
      '<li>1. Products sync: sync on/off, CRM module, field mapping and "Also sync each contact\'s and account\'s products" are there. Missing: choosing the Desk departments.</li>' +
      '<li>5. Initial-sync report: counts and skip reasons are in Failure Log → Skipped. Missing: the email / notice when it finishes.</li></ul>' +
      '<p><strong>Still missing</strong></p><ul>' +
      '<li>6. CRM Leads are not considered: a Desk contact with a Lead\'s email still creates a new CRM contact (tested with throwaway records, deleted after).</li>' +
      '<li>7. The 12-month window of the first sync is not stated.</li>' +
      '<li>9. The CRM pane still shows 8 fixed fields; no way to show other or custom fields.</li>' +
      '<li>10. Handshake Mode still shows empty columns (Customers 0, Potentials 0).</li>' +
      '<li>11. The CRM Desk Tickets card still has only All / Open / On hold / Closed.</li>' +
      '<li>12. No Mutual Users list or "Invite users to Desk".</li>' +
      '<li>13. CRM users are not added as Light Agents (none holds "Desk Light Agent"; 5 CRM users have no Desk profile).</li>' +
      '<li>15. No reply / comment / update from the CRM notification.</li>' +
      '<li>16. No "CRM Contact Type" condition in SLA or assignment rules.</li>' +
      '<li>17. Every profile still starts with Full Access; the middle level is still "Custom Access".</li>' +
      '<li>18. Voice of the Customer (out of NDC-1669 scope).</li></ul>' +
      '<p><strong>Not checked</strong>: 8 (needs the integrated owner deactivated) and 19 (cross-app analytics, out of scope).</p>' +
      '<p>Evidence (TAVI left, Zoho right): ev-A-sync-settings-vs-zoho.png, ev-B-agent-views-vs-zoho.png, ev-C-crm-side-vs-zoho.png, ev-D-access-users-vs-zoho.png.</p>',
  },
  'ndc-2417': {
    title: 'NDC-2417 — CRM Hierarchy Preference missing list: recheck 9 Nov 2026',
    images: ['ev-01-preference-page-vs-zoho.png', 'ev-02-reporting-manager-vs-zoho.png', 'ev-03-roles-sharing-usage-vs-zoho.png'],
    comment: '<h2>Recheck on staging, 9 Nov 2026 (tenant NDC-Staging)</h2>' +
      '<p>Every item was checked again on NDC-Staging (owner account, hierarchy mode Role, nothing switched). Numbers follow this ticket. Result: <strong>0 built, 3 partly built, 16 still missing</strong>. The related bugs NDC-2412..2416 are all Done.</p>' +
      '<p><strong>Partly built</strong></p><ul>' +
      '<li>4. The texts now agree: higher-ranked profiles see lower-ranked profiles "in the same org unit and the units below it". This is an org-unit branch, not a role tree. Not re-run at runtime.</li>' +
      '<li>15. Approvals now have an approver type "Levels" with a "Reporting depth" (how many levels up the reporting chain). Not visible: "all up to level N" and the fallback when the owner has no manager.</li>' +
      '<li>16. CRM record visibility now offers Public, Public Read Only and Hierarchy. Still no separate Public Read/Write vs Read/Write/Delete.</li></ul>' +
      '<p><strong>Still missing</strong></p><ul>' +
      '<li>1. Choice of who manages records of users with no manager.</li>' +
      '<li>2. Warning listing where "Reporting To" is used when switching back to Role (same generic dialog both ways).</li>' +
      '<li>3. Roles tree separate from profiles.</li>' +
      '<li>5. Share Data with Peers.</li>' +
      '<li>6. Transfer &amp; Delete for a role / profile.</li>' +
      '<li>7. Any user can still be chosen as manager (a User\'s list includes another User).</li>' +
      '<li>8. Personal Settings still asks to paste a user ID.</li>' +
      '<li>9. No Reporting Hierarchy section on the user, no Reports To column or filter.</li>' +
      '<li>10. No prompt for the reports when a manager is deleted or suspended.</li>' +
      '<li>11. No check when a manager\'s profile change breaks the chain.</li>' +
      '<li>12. "Reporting To" not in reports, views, filters or merge fields.</li>' +
      '<li>13. No workflow email to the record owner\'s manager.</li>' +
      '<li>14. No "Reporting Manager" blueprint transition owner.</li>' +
      '<li>17. No sharing rules (/iam/sharing-rules and /settings/data-sharing 404).</li>' +
      '<li>18. No roles API (/iam/roles, /settings/roles 404).</li>' +
      '<li>19. /iam/users/{id}/subordinates still 404.</li></ul>' +
      '<p>Evidence (TAVI left, Zoho right): ev-01-preference-page-vs-zoho.png, ev-02-reporting-manager-vs-zoho.png, ev-03-roles-sharing-usage-vs-zoho.png.</p>',
  },
};

for (const [dir, t] of Object.entries(T)) {
  const imgs = t.images.map(f => `<figure><figcaption>${esc(f)}</figcaption><img src="data:image/png;base64,${fs.readFileSync(path.join(R, dir, 'evidence/annotated', f)).toString('base64')}"></figure>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(dir.toUpperCase())} draft</title><style>
:root{--bg:#f6f7f9;--fg:#1c2330;--card:#fff;--mut:#5b6573;--bd:#dfe3e8;--warn:#fff4e5;--warnb:#f0b35a}
@media (prefers-color-scheme:dark){:root{--bg:#14171c;--fg:#e6e9ee;--card:#1d2128;--mut:#9aa3af;--bd:#2f3540;--warn:#3a2c14;--warnb:#a8742a}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.55 system-ui,Segoe UI,sans-serif}main{max-width:1100px;margin:0 auto;padding:24px 16px}
.card{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:18px 20px;margin:14px 0}.banner{background:var(--warn);border:1px solid var(--warnb);border-radius:10px;padding:12px 16px}
img{max-width:100%;border:1px solid var(--bd);border-radius:6px}figure{margin:12px 0}figcaption{color:var(--mut);font-size:13px}pre{white-space:pre-wrap;word-break:break-all;font-size:12px;background:var(--bg);padding:10px;border-radius:6px}</style></head><body><main>
<h1 style="font-size:22px">${esc(t.title)}</h1>
<div class="banner"><strong>Draft — not posted.</strong> Nothing was sent to Plane. Results table: <code>${dir}/results.md</code>. Ledger: <code>${dir}/ledger.md</code>.</div>
<div class="card"><h2 style="font-size:16px;margin-top:0">Comment as it would appear</h2>${t.comment}</div>
<div class="card"><h2 style="font-size:16px;margin-top:0">Images to attach</h2>${imgs}</div>
<div class="card"><h2 style="font-size:16px;margin-top:0">Plane comment_html (compact)</h2><pre>${esc(t.comment)}</pre></div>
</main></body></html>`;
  fs.writeFileSync(path.join(R, dir, 'plane-draft.html'), html);
  fs.writeFileSync(path.join(R, dir, 'plane-draft-comment.html'), t.comment);
  console.log('wrote', dir);
}
