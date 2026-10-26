// Fix: empty {} list prefs crash Deals/Contacts/Tasks list pages. Try null, DELETE, then {lastView:'list'} on Deals first.
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const load = async id => { await page.goto(H + `/modules/${id}`, { waitUntil: 'commit', timeout: 120000 }); let t = ''; for (let i = 0; i < 90; i++) { await sleep(1000); t = await txt().catch(() => ''); if (/\d[\d,]* records|Something went wrong/.test(t)) break; } return /Something went wrong/.test(t) ? 'CRASH' : (t.match(/\d[\d,]* records/) || ['?'])[0]; };
const cur = async () => (await api('GET', `/modules/${D}/list-preferences`)).j?.data;
const out = {};
let v = (await cur()).version; let r = await api('PUT', `/modules/${D}/list-preferences`, { prefs: null, version: v }); out.putNull = r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 150) : JSON.stringify((await cur()))); 
out.afterNull = await load(D);
if (out.afterNull === 'CRASH') { r = await api('DELETE', `/modules/${D}/list-preferences`); out.del = r.s + ' ' + JSON.stringify(await cur()); out.afterDel = await load(D); }
if (out.afterDel === 'CRASH') { v = (await cur()).version; r = await api('PUT', `/modules/${D}/list-preferences`, { prefs: { lastView: 'list' }, version: v }); out.putList = r.s; out.afterList = await load(D); }
return done(out);
