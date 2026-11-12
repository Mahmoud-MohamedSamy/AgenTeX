const onDlg = d => d.accept().catch(() => {}); page.on("dialog", onDlg);
const BAD = /token|secret|password|cookie|authori[sz]ation|bearer/i;
const scrub = v => Array.isArray(v) ? v.map(scrub) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => BAD.test(k) ? [k.replace(BAD, 'T_'), x == null ? x : '[hidden len ' + String(x).length + ']'] : [k, scrub(x)])) : typeof v === 'string' && BAD.test(v) ? v.replace(/token|secret|password|cookie|bearer|authori[sz]ation/gi, 'T_') : v;
const CREATED = [];
const NET = []; const onNet = async r => { try { const q = r.request(); const m = q.method(); const u = r.url(); if (m === 'GET' || !u.includes('/api/v1/')) return; let b = q.postData() || ''; let t = ''; try { t = (await r.text()).slice(0, 500); } catch (e) {} NET.push({ m, u: u.replace(API, ''), s: r.status(), b: b.slice(0, 500), t }); } catch (e) {} };
page.on('response', onNet);
const D = j => j && j.data !== undefined ? j.data : j;
const fin = o => { page.off("dialog", onDlg); page.off("response", onNet); return done(scrub({ ...o, NET, CREATED })); };
const TM = '88e8ea44-1658-4df3-9930-d0902b91073d';
const flat = r => { const o = { id: r.id, created_at: r.created_at }; for (const f of (Array.isArray(r.data) ? r.data : [])) { let v = f.value; if (v && typeof v === 'object' && 'value' in v) v = v.value; o[f.field] = v; } return o; };
const findT = async q => arr(D((await api('GET', '/modules/' + TM + '/records?limit=20&sort=-created_at&q=' + encodeURIComponent(q))).j)).map(flat);
const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4', AM = '784400e1-4a2a-42c2-b4f3-7ca56e79828a', KM = '0924eb24-e42a-4eab-8efd-e3428f19e882', PM = '95b45992-5beb-4f23-b619-e3ae0e304933';
const MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794'; const C1 = '34735e25-d505-41fa-9fe3-d4a67f283a9a';
const sv = v => ({ kind: 'string', value: v });
const mk = async (mod, kind, name, fields) => { const r = await api('POST', '/modules/' + mod + '/records', { data: Object.entries(fields).map(([f, v]) => ({ field: f, value: (v && v.kind) ? v : sv(v) })) }); const id = r.j && r.j.data && r.j.data.id; if (id) CREATED.push({ kind, id, name }); return { s: r.s, id, err: r.s >= 300 ? JSON.stringify(r.j && r.j.error || r.t).slice(0, 220) : '' }; };
const get = async (mod, id) => flat(D((await api('GET', '/modules/' + mod + '/records/' + id)).j) || {});
const mtxt = async () => (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
let out = {};
try {
await go('/analytics/reports/builder', 9000);
await page.getByLabel(/Report Name/i).first().fill('QA GL W5 report').catch(async () => { await page.locator('main input').first().fill('QA GL W5 report'); });
const sel = page.locator('main').getByText(/Select a dataset/).first(); await sel.click(); await sleep(2000);
out.datasets = (await page.locator('[role=listbox], [role=menu], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
await shot('w5/W5-25-datasets');
const opt = page.getByRole('option', { name: /^Tickets/ }).first(); if (await opt.count()) await opt.click(); else await page.getByText(/^Tickets$/).last().click();
await sleep(1500);
const n0 = NET.length; await page.getByRole('button', { name: /^Create$/ }).click(); await sleep(8000);
out.net = NET.slice(n0).filter(x => /reporting/.test(x.u)).map(x => x.m + ' ' + x.u.split('/').slice(-2).join('/') + ' ' + x.s + ' ' + x.t.slice(0, 160));
const m = out.net.join(' ').match(/"id":"([0-9a-f-]{36})"/); if (m) { CREATED.push({ kind: 'report', id: m[1], name: 'QA GL W5 report' }); out.rid = m[1]; }
out.url = page.url().replace(H, ''); out.body = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 1500);
await shot('w5/W5-26-builder');
return fin({ out });
} catch (e) { out.ERR = String(e.message).replace(/\u001b\[[0-9;]*m/g, '').slice(0, 500); return fin({ out }); }
