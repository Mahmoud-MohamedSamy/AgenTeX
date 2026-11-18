const req = []; page.on('request', r => { const u = r.url(); if (/api\/v1/.test(u) && /audit/i.test(u)) req.push(r.method() + ' ' + u.replace(/.*\/api\/v1/, '').slice(0, 250)); });
await page.goto(H + '/settings/security/audit-log', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(1500); if (/Audit Log/i.test(await text()) && /updated|created|deleted/i.test(await text())) break; }
await sleep(2500);
await shot('C2-1-audit-log.png');
const t = await text(); const i = t.indexOf('Audit Log', 600); log('TEXT ' + t.slice(i, i + 3000).replace(/\n/g, ' | '));
log('REQ ' + JSON.stringify(req));
