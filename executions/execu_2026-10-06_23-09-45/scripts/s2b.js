// Initialize QA MF Open's layout (save once), put QA fields on it, and set Desk Agent field permissions via Fields → Field Permissions.
const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const fields = async () => arr((await api('GET', `/modules/${OPEN}/fields`)).j.data);
const DEF = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data).find(x => x.isDefault);
await go(`/settings/modules-and-fields/${OPEN}/layouts/${DEF.id}`, 10000);
await page.locator('button', { hasText: 'NEW SECTION' }).last().click(); await sleep(800);
await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(4000);
let lay = (await api('GET', `/modules/${OPEN}/layouts/${DEF.id}`)).j.data;
const vi = Object.entries(lay.views).map(([k, v]) => k + ':' + (v && v.layout && v.layout.sections ? v.layout.sections.length : 'null')).join(',');
const qa = (await fields()).filter(f => /^qa_/.test(f.fieldName));
for (const v of ['CREATE', 'DETAIL', 'QUICK_CREATE']) { const ss = lay.views[v] && lay.views[v].layout && lay.views[v].layout.sections; if (!ss || !ss[0]) continue; const sec = ss[0]; const col = sec.columns[sec.columns.length - 1]; const have = new Set(ss.flatMap(s => s.columns.flatMap(c => c.fields.map(f => f.id)))); for (const f of qa) if (!have.has(f.id)) col.fields.push(f); }
const b = { ...lay }; delete b.id; const pu = await api('PUT', `/modules/${OPEN}/layouts/${DEF.id}`, b);
const onL = (await fields()).filter(f => /^qa_/.test(f.fieldName) && (f.layouts || []).length).length;
// Field Permissions tab
const cap = []; const onW = r => { if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(r.method()) && /permission/.test(r.url())) cap.push(`${r.method()} ${r.url().replace(API, '')} ${(r.postData() || '').slice(0, 400)}`); };
page.on('request', onW);
await go(`/settings/modules-and-fields/${OPEN}`, 6000);
await page.getByRole('tab', { name: 'Fields' }).first().click(); await sleep(2000);
await page.getByText('Field Permissions', { exact: true }).first().click(); await sleep(3000);
const head = (await page.locator('table thead').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
const setLevel = async (label, level) => {
  const row = page.locator('tr', { hasText: label }).first();
  const btn = row.locator(`[aria-label="${level} for ${label}"]`); const n = await btn.count();
  if (n) { await btn.first().click(); return `${label}: clicked "${level}" (${n} buttons; first column = first profile)`; }
  const sel = row.locator('select'); if (await sel.count()) { await sel.nth(1).selectOption({ label: level }).catch(() => { }); return `${label}: select`; }
  return `${label}: no control found`;
};
const shotA = await shot('S2b-field-permissions-before');
const ctl = await page.evaluate(() => [...document.querySelectorAll('tr')].filter(r => /QA MF secret/.test(r.innerText)).map(r => [...r.querySelectorAll('button,select,input')].map(e => e.getAttribute('aria-label') || e.tagName).join(' | ')).join(''));
rec('S2b', 'INFO', `views after first save: ${vi}; layout PUT ${pu.s}; QA fields on layout: ${onL}; Field Permissions header: ${head.slice(0, 200)}; controls in the QA MF secret row: ${ctl.slice(0, 400)}`, { shot: shotA });
page.off('request', onW);
return done();
