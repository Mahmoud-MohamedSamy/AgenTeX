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
const T1 = 'd72d5704-6602-48b8-8a55-2943dbb62762', T2 = '9467ee7b-41f7-45c6-8476-9fab49e502c6';
const openMore = async () => { await page.keyboard.press('Escape').catch(() => {}); await sleep(400); const bs = page.getByRole('button', { name: 'More ticket actions' }); const n = await bs.count(); let bi = 0, by = 1e9; for (let i = 0; i < n; i++) { const b = await bs.nth(i).boundingBox().catch(() => null); if (b && b.y < by) { by = b.y; bi = i; } } await bs.nth(bi).click(); await sleep(1200); return page.locator('[role=menu]').last(); };
const clickItem = async name => { const m = await openMore(); await m.getByRole('menuitem', { name, exact: true }).first().click(); await sleep(2500); };
const dlg = async () => (await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900);
const toasts = async () => (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' / ').replace(/\s+/g, ' ').slice(0, 400);
const head = async () => (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
const flt = () => NET.filter(n => !/iam\/|auth|heartbeat|summaries|realtime|resolved-batch|\/read$|lookups/.test(n.u)).map(n => n.m + ' ' + n.s + ' ' + n.u + ' ' + n.b.slice(0, 140) + ' => ' + n.t.slice(0, 160));
let out = {};
try {
const t = await mk(TM, 'ticket', 'QA GL C6 tavi', { subject: 'QA GL C6 tavi', department: MK, status: 'Open', email: 'qa-gl-tm-c1@example.com' }); const id = t.id; out.id = id;
out.before = (await get(TM, id)).owner;
await go('/views/all/tickets/' + id, 9000);
await clickItem('Move'); const d = page.locator('[role=dialog]').last();
await d.locator('button').filter({ hasText: 'Choose a department' }).last().click(); await sleep(1200);
await page.locator('[role=option],[role=menuitem],[cmdk-item],li,button').filter({ hasText: /^Customer Support$/ }).first().click(); await sleep(1500);
out.dlg1 = await dlg(); await shot('tm/tavi-c6-dlg');
await d.locator('button').filter({ hasText: 'Unassigned' }).last().click().catch(e => out.aErr = e.message.slice(0, 80)); await sleep(1500);
out.assignOpts = (await page.locator('[role=listbox],[role=menu],[cmdk-list],[data-radix-popper-content-wrapper]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await shot('tm/tavi-c6-assign-opts'); await page.keyboard.press('Escape'); await sleep(800);
NET.length = 0; await d.getByRole('button', { name: 'Move', exact: true }).click(); await sleep(4000);
out.move = { toast: await toasts(), net: flt() }; out.after = (await get(TM, id)).owner; await shot('tm/tavi-c6-after');
return fin({ out });
} catch (e) { out.ERR = String(e.message).replace(/\u001b\[[0-9;]*m/g, '').slice(0, 500); return fin({ out }); }
