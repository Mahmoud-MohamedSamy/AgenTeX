eval(require('fs').readFileSync('zlib.js', 'utf8'));
for (let a = 0; a < 3; a++) { try { await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 120000 }); break; } catch (e) {} } await sleep(12000);
const items = (JSON.parse((await api('GET', B + 'recycleBin?limit=50')).t).data || []).filter(x => /QA ZWF|qa zwf/i.test(JSON.stringify(x))); const ids = items.map(x => x.id); out.n = ids.length; out.try = {};
for (const [m, p, b] of [['POST', 'recycleBin/delete', { ids }], ['POST', 'recycleBin/deleteForever', { ids }], ['POST', 'recycleBin/permanentlyDelete', { ids }], ['DELETE', 'recycleBin/' + ids[0], null], ['POST', 'recycleBin/purge', { ids }]]) { const r = await api(m, B + p, b); out.try[m + ' ' + p.split('/').slice(0, 2).join('/')] = r.s + ' ' + r.t.slice(0, 120); }
out.after = (JSON.parse((await api('GET', B + 'recycleBin?limit=50')).t).data || []).filter(x => /QA ZWF|qa zwf/i.test(JSON.stringify(x))).map(x => x.type + ' ' + x.displayName);
require('fs').writeFileSync('zpurge.json', JSON.stringify(out, null, 1));
