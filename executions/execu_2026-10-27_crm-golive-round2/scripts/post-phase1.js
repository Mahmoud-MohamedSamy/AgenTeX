// Round 2 Phase 1 Plane updates approved by the user (27 Oct 2026): bug images, reopen NDC-1823, "still passes" comments on Done tickets.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const R = path.resolve(__dirname, '..');
const ATTACH = path.resolve(R, '../execu_2026-10-25_crm-golive-wave2/scripts/plane-attach.js');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1792931401453.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const h = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const retry = async fn => { for (let i = 0; i < 3; i++) { try { return await fn(); } catch (e) { if (i === 2) throw e; await new Promise(r => setTimeout(r, 8000)); } } };
const attach = (id, f) => retry(async () => execFileSync('node', [ATTACH, id, f], { stdio: 'pipe' }));
const comment = (id, html) => retry(() => fetch(`${B}/work-items/${id}/comments/`, { method: 'POST', headers: h, body: JSON.stringify({ comment_html: html }) }));
const env = acct => `<p>Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), ${acct}; CRM go-live round 2.</p>`;
const W1 = p => path.join(R, 'wave1/evidence/annotated', p), W2 = p => path.join(R, 'wave2/evidence/annotated', p);
const bugs = [['bb75665b-7c1d-40e3-b7f6-9f307ee8361c', W1('R2W1-B2-retest.png')], ['b4934494-e0f5-472a-9ca4-38753ae0524b', W1('R2W1-B1-retest.png')],
  ['58922d77-09ab-4e68-837f-dcee5c942614', W2('R2W2-C1-record-lock-vs-zoho.png')], ['13987093-2739-45e5-8ce6-ce77df55431a', W2('R2W2-C2-home-raw-keys-vs-zoho.png')]];
const pass = {
  1337: ['7bebac68-d7df-4c90-8b90-73e985d0d539', 'A user on a QA profile with Company hidden and Email read-only: writing the hidden field answers 422, editing the read-only field answers 422, and the hidden value is not returned.', 'test user 2 and CRM Admin B'],
  2381: ['b44450d2-de86-49fc-a80c-a024565037b3', 'Create, update and delete of a QA lead were each logged in the audit log within 8 seconds, with the actor and the changes.', 'owner'],
  2293: ['3b11ea52-41cd-401f-940d-d28348de8410', 'The audit log Entities filter lists 55 options on screen (53 in the API) with no duplicate names.', 'CRM Admin B'],
  1172: ['244331d7-49dc-4f9d-9fba-947440bb2433', 'A CRM Admin who is not a member doesn\u2019t see the teamspace and can\u2019t open it.', 'CRM Admin B'],
  1699: ['467c3fce-fbfc-436b-9a8a-68eccb3316f1', 'A user whose profile is not on the teamspace list doesn\u2019t see it and can\u2019t open it.', 'Supervisor'],
  1701: ['e7512895-1e5f-4c8e-b7cf-133db87016be', 'A teamspace member can\u2019t rename the teamspace or promote themselves (403).', 'test user 2'],
  2415: ['8881a557-6d80-40ab-96a8-c877c5cae723', 'Every row of the Hierarchy Preference change history shows who made the change and when.', 'CRM Admin B'],
  2416: ['73cfcb0d-2953-4e62-b914-4e3624fe6fd4', 'A user without the reporting-hierarchy permission can\u2019t change their own manager (403, manager unchanged).', 'test user 2'],
  2418: ['3cc90c86-0d95-44c4-982b-bc723a752610', 'Login History shows 21 Active sessions and none past its expiry (25 Oct: 306 of 346 were expired but shown Active).', 'CRM Admin B'],
  2543: ['405c8ff3-848d-4901-b317-2d7ac2f24a5c', 'Renaming or deleting the built-in "User" profile is refused (409 SYSTEM_PROFILE_PROTECTED) with a clear message. Note: the new built-in "AI Agent" profile is not protected yet \u2014 filed as NDC-2702.', 'CRM Admin B'],
  2546: ['44334f73-b187-4d25-afb1-74ef1e56e39c', 'Editing a profile\u2019s rank above its parent\u2019s rank is refused (400) with a clear message, and the rank stays unchanged.', 'CRM Admin B'],
  2547: ['9222d052-5b31-4a64-b10c-57896b8a3898', 'The Permissions page button now reads "Create profile" and opens the Create profile dialog.', 'CRM Admin B'],
  1593: ['dea744ef-8c6a-465c-aa95-08d79d675299', 'Import respects field permissions: a read-only field can\u2019t be mapped, and importing a value into it is refused on the server (0 created, 1 error).', 'test user 2 and owner'],
  1599: ['a1ce40d2-7034-4ca9-8229-992adb312dd3', 'Import respects field permissions: a hidden field isn\u2019t offered in the mapping, and importing a value into it is refused on the server (0 created, 1 error).', 'test user 2 and owner'],
};
(async () => {
  for (const [id, f] of bugs) { await attach(id, f); console.log('bug image', path.basename(f), 'attached'); }
  const r1823 = '2323dc05-4952-429c-853a-ba237dded14b';
  await attach(r1823, W2('NDC-1823-retest.png'));
  let c = await comment(r1823, '<p><strong>Retest 27 Oct 2026 \u2014 still fails, reopened</strong></p><p>On the Convert page, the deal fields that Zoho locks during conversion \u2014 Probability (%), Expected Revenue and the three duration fields (Lead Conversion Time, Sales Cycle Duration, Overall Sales Duration) \u2014 can still be edited. The deal form also took about 25 seconds to appear. Moved from Done back to Bug.</p>' + env('owner and CRM Admin A') + '<p>Annotated TAVI-vs-Zoho image attached: NDC-1823-retest.png</p>');
  const s = await retry(() => fetch(`${B}/work-items/${r1823}/`, { method: 'PATCH', headers: h, body: JSON.stringify({ state: BUG }) }));
  console.log('NDC-1823 image attached, comment', c.status, 'state', s.status);
  for (const [seq, [id, fact, acct]] of Object.entries(pass)) {
    await attach(id, W1(`NDC-${seq}-retest.png`));
    c = await comment(id, `<p><strong>Retest 27 Oct 2026 \u2014 still passes on the new build</strong></p><p>${fact}</p>${env(acct)}<p>Annotated TAVI-vs-Zoho image attached: NDC-${seq}-retest.png</p>`);
    console.log(`NDC-${seq} image attached, comment ${c.status}`);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
