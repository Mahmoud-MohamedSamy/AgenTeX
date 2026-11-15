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
const openBuilder = async () => {
  await go('/analytics/reports/builder', 4000); await page.getByRole('button', { name: 'Select Primary Module' }).waitFor({ timeout: 60000 });
  await page.getByLabel('Report Name').fill('QA GL W5 report');
  await page.getByRole('button', { name: 'Select Primary Module' }).click(); await sleep(1500);
  await page.getByRole('option', { name: /^Tickets/ }).first().click(); await sleep(1000);
  await page.getByRole('button', { name: /^Create$/ }).click();
  for (let i = 0; i < 20; i++) { await sleep(2000); if (/Continue/.test(await mtxt())) break; }
  await page.getByRole('button', { name: /^Continue$/ }).click();
  for (let i = 0; i < 15; i++) { await sleep(2000); if (/Run Preview|Edit columns/.test(await mtxt())) break; }
};
const dtxt = async () => (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
const pickF = async (btn, field) => { await page.getByRole('button', { name: btn }).click(); await sleep(1500); const d = page.locator('[role=dialog]').last();
  await d.getByPlaceholder('Search fields…').fill(field); await sleep(800); await d.getByText(new RegExp('^' + field + '$')).first().click(); await sleep(800);
  await d.getByRole('button', { name: /^Done$/ }).last().click(); await sleep(1500); };
let out = {};
try {
const R = { ticket: ['130f789e-de36-4538-ac41-b3baaab908b6', TM], contract: ['4cff9fc4-b8ea-45bf-a4b5-1fee1b5c6dd9', KM], contact: ['4b90180b-cd0d-44e5-914b-9c9fe2c85f45', CM], account: ['cc6244cd-863f-4e23-8e2e-1f528dd72787', AM] };
for (const [k, [id, m]] of Object.entries(R)) out['del ' + k] = (await api('DELETE', '/modules/' + m + '/records/' + id)).s;
out.plan = (await api('DELETE', '/desk/sla/support-plans/e3ac030f-14bb-4884-908a-f4ead909cbcd')).s;
out.pol = (await api('DELETE', '/desk/sla/policies/68b76bdf-a994-4212-b3a1-8658331d625d')).s;
await sleep(3000);
const ids = new Set([...Object.values(R).map(x => x[0]), 'e3ac030f-14bb-4884-908a-f4ead909cbcd', '68b76bdf-a994-4212-b3a1-8658331d625d']);
let items = []; for (const q of ['?limit=200&app=desk', '?limit=200']) { const b = await api('GET', '/audit/recycle-bin/items' + q); items = items.concat(arr(D(b.j))); }
const seen = new Set(); items = items.filter(x => !seen.has(x.id) && seen.add(x.id));
const pick = items.filter(x => ids.has(x.record_id)); out.bin = pick.map(x => [x.record_id.slice(0, 8), x.record_label]);
const ok = pick.filter(x => /QA GL W5R|qa-gl-w5r/i.test(x.record_label || ''));
if (ok.length) { const p = await api('POST', '/audit/recycle-bin/delete', { item_ids: ok.map(x => x.id), ids: ok.map(x => x.id) }); out.purge = p.s + ' ' + ok.length; }
for (const [k, [id, m]] of Object.entries(R)) out['get ' + k] = (await api('GET', '/modules/' + m + '/records/' + id)).s;
const left = arr(D((await api('GET', '/desk/sla/support-plans')).j)).filter(x => /W5R/.test(x.name)).length; out.plansLeft = left;
out.hcLeft = /qa-gl-w5r/.test(JSON.stringify(D((await api('GET', '/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/accounts?limit=100')).j)));
return fin({ out });
} catch (e) { out.ERR = String(e.message).replace(/\u001b\[[0-9;]*m/g, '').slice(0, 500); return fin({ out }); }
