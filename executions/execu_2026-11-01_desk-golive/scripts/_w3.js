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
let pick = []; for (let p = 0; p < 6; p++) { const rb = await api('GET', '/audit/recycle-bin/items?limit=200' + (p ? '&page=' + (p + 1) : '')); const it = arr(D(rb.j)); pick.push(...it.filter(i => i.record_id === 'a3ed5647' || String(i.record_id).startsWith('a3ed5647') || i.record_label === 'QA GL W3 WF uses echo 2')); if (it.length < 200) break; }
out.found = pick.map(i => i.record_id + ' ' + i.record_label); if (pick.length) out.purge = (await api('POST', '/audit/recycle-bin/delete', { item_ids: pick.map(x => x.id), ids: pick.map(x => x.id) })).s;
await sleep(2000); let left = []; for (let p = 0; p < 6; p++) { const rb = await api('GET', '/audit/recycle-bin/items?limit=200' + (p ? '&page=' + (p + 1) : '')); const it = arr(D(rb.j)); left.push(...it.filter(i => /QA GL W3|qa-gl-w3/.test(JSON.stringify(i)))); if (it.length < 200) break; } out.left = left.length;
return fin({ out });
} catch (e) { out.ERR = String(e.message).replace(/\u001b\[[0-9;]*m/g, '').slice(0, 500); return fin({ out }); }
