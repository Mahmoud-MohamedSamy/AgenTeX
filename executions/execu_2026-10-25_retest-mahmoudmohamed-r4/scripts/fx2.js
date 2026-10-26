const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const load = async id => { await page.goto(H + `/modules/${id}`, { waitUntil: 'commit', timeout: 120000 }); let t = ''; for (let i = 0; i < 90; i++) { await sleep(1000); t = await txt().catch(() => ''); if (/\d[\d,]* records|Something went wrong/.test(t)) break; } await sleep(2500); const hdr = await page.evaluate(() => [...document.querySelectorAll('thead th')].map(t => t.innerText.trim()).filter(Boolean)); return /Something went wrong/.test(t) ? 'CRASH' : (t.match(/\d[\d,]* records/) || ['?'])[0] + ' cols=' + hdr.join('|'); };
const put = async prefs => { const v = (await api('GET', `/modules/${D}/list-preferences`)).j.data.version; return (await api('PUT', `/modules/${D}/list-preferences`, { prefs, version: v })).s; };
const out = {};
out.a = await put({ lastView: 'list', pageSize: 25, hiddenKeys: [] }) + ' ' + await load(D);
if (/CRASH/.test(out.a)) out.b = await put({ lastView: 'list', pageSize: 25, hiddenKeys: [], visibleKeys: [] }) + ' ' + await load(D);
await shot('fx-deals-list');
return done(out);
