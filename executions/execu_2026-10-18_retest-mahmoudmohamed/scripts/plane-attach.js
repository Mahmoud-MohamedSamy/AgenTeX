// Attaches the annotated evidence images to their Plane work items through Plane's own API (private signed upload; no public link).
// Token: read from the Plane secret-key CSV (column "Secret key"); never printed. Signed URLs are not printed either.
// Usage: node scripts/plane-attach.js <csvPath> [--one]   (--one = first image only, as a test)
const fs = require('fs'); const path = require('path');
const [csvPath, flag] = process.argv.slice(2);
const rows = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const API = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const DIR = path.join(__dirname, '..', 'screenshots', 'annotated');
const WI = { 1819: '2b58d6ec-e6e0-4eb1-9fd9-febc541c2d08', 2098: 'd1ef2976-b984-4e8e-b2a2-376c480c8d32', 2104: '09a41c5c-f291-4e20-8420-ce663d4a71b4',
  2095: '20793690-285a-44d4-a531-f1362f7959b3', 2096: 'c4168d45-f54b-4100-9b7e-5cb031eecee1', 2097: '3e4c22e6-3562-4ad0-af23-86bebdd9056b',
  1787: '23aa2f02-2caa-41b3-ac53-d13655bcc377', 1821: '87f48025-ef39-41d8-a136-5b369f7b2c5e', 1234: '5076d581-d3df-4eca-a47e-70afeb839685',
  1947: 'e3389924-8521-4a5d-bae5-2b8c137e8824', 2100: '86cb3c2f-977f-4a53-b2c5-846caf5ca7aa', 2102: 'aa1714ad-062a-4596-b200-65097518603f',
  1788: 'a8fe8f52-bdfc-4948-9950-9e4f44020352', 1789: '18b5bfd4-763f-40de-8e6a-9d7e606fc26b', 2124: 'b19d5e73-e018-4129-8f4e-b19160b9f7ed' };
const FILES = ['NDC-1819-retest-PARTIAL.png', 'NDC-1819-functional-PARTIAL.png', 'NDC-1819-columns-PARTIAL.png', 'NDC-2098-retest-DECISION.png',
  'NDC-2104-retest-PASS.png', 'NDC-2104-retest-DECISION.png', 'NDC-2095-retest-PASS.png', 'NDC-2096-retest-NOT-A-BUG.png', 'NDC-2097-retest-PASS.png',
  'NDC-1787-retest-PASS.png', 'NDC-1821-retest-PASS.png', 'NDC-1234-retest-PASS.png', 'NDC-1947-retest-NOT-A-BUG.png', 'NDC-2100-retest-PASS.png',
  'NDC-2102-retest-PASS.png', 'NDC-1788-retest-PARTIAL.png', 'NDC-1789-retest-FAIL.png', 'NDC-2124-retest-FAIL.png'];
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const safe = t => String(t).replace(/https?:\/\/[^\s"]+/g, u => new URL(u).host + '/…').replace(/plane_api_[A-Za-z0-9]+/g, '<token>').slice(0, 300);
(async () => {
  for (const f of (flag === '--one' ? FILES.slice(0, 1) : flag === '--rest' ? FILES.slice(1) : FILES)) {
    const id = WI[f.match(/NDC-(\d+)/)[1]]; const buf = fs.readFileSync(path.join(DIR, f));
    let base = null, r, j;
    for (const p of ['/work-items/' + id + '/attachments/', '/issues/' + id + '/issue-attachments/']) {
      r = await fetch(API + p, { method: 'POST', headers: H, body: JSON.stringify({ name: f, type: 'image/png', size: buf.length }) });
      if (r.status < 300) { base = p; break; } console.log(f, 'POST', p.split('/')[3], r.status, safe(await r.text()));
    }
    if (!base) { console.log(f, 'FAILED: no attachment endpoint accepted the request'); continue; }
    j = await r.json(); const up = j.upload_data || {}; const assetId = j.asset_id || (j.attachment && j.attachment.id);
    const fd = new FormData(); for (const [k, v] of Object.entries(up.fields || {})) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), f);
    const s3 = await fetch(up.url, { method: 'POST', body: fd });
    const done = await fetch(API + base + assetId + '/', { method: 'PATCH', headers: H, body: JSON.stringify({ is_uploaded: true }) });
    console.log(f, '→ NDC-' + f.match(/NDC-(\d+)/)[1], 'create', r.status, '| storage', s3.status, '| confirm', done.status, done.status >= 300 ? safe(await done.text()) : '');
  }
})().catch(e => console.log('ERROR', safe(e && e.message)));
