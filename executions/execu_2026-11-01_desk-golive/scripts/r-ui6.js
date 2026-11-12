const o = {}; const BASE = 'd09976e5-45fc-460c-b7d5-2e7bd261ecc9';
const b = page.locator('button', { hasText: /^Comment\s*Private/ }).first(); o.btn = await b.count(); if (o.btn) { await b.click().catch(() => {}); await sleep(6000); }
const lc = await api('GET', `/desk/tickets/${BASE}/comments`); o.saved = arr(lc.j && lc.j.data).filter(x => /screen mention/.test(x.body_html || '')).map(x => (x.body_html || '').slice(0, 300));
o.shot = await shot('../wave2n/r-mention-screen-saved');
return done(o);
