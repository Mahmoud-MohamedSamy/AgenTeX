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
const TK = { MK1: '43d637c7-140c-4e70-8033-16bd2a4f4cf9', MK2: '0f728e32-c972-4721-b3c4-05f407ab7f59', SA1: 'baf2d764-f0e3-4fbd-b3f6-75290ca610ef', HR1: 'fc755356-fb4e-4530-887a-7a1aa4029836', CSC: '5c506322-6ae7-4334-ba9d-e5790ee5c3cc', CSD: '27146cf7-5d12-4fb4-b118-87d7b06c31e3', CSE: 'f3951970-a98c-48af-89b9-60eb11e662f5', CSU: 'd2dcb7fb-faf9-4d59-97cb-3edb5ccc2715', CST: '51010fcc-7f0f-4c31-8906-c336abc18841', SH1: '95a9a126-cf36-479e-b30e-b258d804283f', SH2: '3fb6237c-835a-4d41-a9f2-053d7e3af501', MV1: 'c9f443d4-7639-400b-b3c1-8c9272ddbd2c', MV2: 'b70ac88f-5264-453a-880a-c79bd037cac7', MV3: '74eaccf2-9426-4148-8123-7f750be8bbc5' };
const DEP = { CS: '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', MKT: '2a73bbc0-efb3-4250-bf9b-2fdc98236794', SAL: 'ef8dc91f-1d30-491d-a1fc-9b62b96eca94', HR: '08fd8684-c5c0-4d4d-86f9-2be70cf61e53' };
const US = { O: '97be04b6-0a08-4883-aa51-e1650b11cab7', B: '3445ec4a-020e-4f12-b156-dd2de7610164', C: '9d182dfa-05f3-4af7-9685-8615a2fbe537', D: '876ce871-2b02-4854-89a7-68050391c62b', E: '23f0f9d7-2fc0-429b-9334-9933fe5c429b' };
const TEAM = '9e444340-ef59-455b-80a1-16b321592447';
const nameOf = id => (Object.entries(TK).find(([k, v]) => v === id) || [id.slice(0, 8)])[0];
// visible list of QA AC tickets via records API
const listQA = async () => { const r = await api('GET', '/modules/' + TM + '/records?limit=100&q=' + encodeURIComponent('QA AC')); return { s: r.s, ids: arr(D(r.j)).map(x => nameOf(x.id)).sort() }; };
const probe = async (k, deep) => { const id = TK[k]; const o = {}; o.rec = (await api('GET', '/modules/' + TM + '/records/' + id)).s; o.tkt = (await api('GET', '/desk/tickets/' + id)).s;
  if (deep) { for (const sub of ['comments', 'threads', 'attachments', 'history', 'shares', 'followers', 'time-entries', 'activities']) o[sub] = (await api('GET', '/desk/tickets/' + id + '/' + sub)).s; }
  return o; };
const st = o => Object.entries(o).map(([k, v]) => k + ':' + v).join(' ');
Object.assign(TK, { R1: 'd1d6ccba-03a7-49aa-88c4-2b91296cc9cb', R2: 'd6a2e416-b764-40bd-97bb-cbf9501f014f', R3: '0e5c44e2-3b6e-4cad-91f3-d6690f0cb63b', R4: '6c305f58-fc4d-435a-a59b-9931d7b4829d', R5: '26267d96-4b90-496c-8734-140f9b136c36', R4b: 'b0acbfc3-582b-424d-9c9e-8a4ff8b280c6' });
const CON2 = 'b86e9c22-d369-4a97-9f92-47db7e0cc0bc';
const prr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 110) : ''); };
let out = {};
try {
await go('/settings/customization/notifications', 10000);
const head = (await mtxt()).match(/Department (Customer Support|[A-Za-z ]+?) Rules are set/)?.[1]; out.dept = head;
const row = page.locator('div,li,tr', { hasText: /^Receiving a shared ticket/ }).last();
const lab = page.getByText('Receiving a shared ticket', { exact: true }).first(); await lab.scrollIntoViewIfNeeded(); await sleep(800);
const box = lab.locator('xpath=ancestor::*[.//*[@role="switch"] or .//input[@type="checkbox"]][1]');
out.switches = await box.locator('[role=switch], input[type=checkbox]').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.name || '') + '=' + (e.getAttribute('aria-checked') ?? e.checked)));
out.rowTxt = (await box.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await shot('access/o-notif-shared-row');
return fin({ out });
} catch (e) { out.ERR = String(e.message).split('Call log')[0].replace(/\u001b\[[0-9;]*m/g, '').slice(0, 500); return fin({ out }); }
