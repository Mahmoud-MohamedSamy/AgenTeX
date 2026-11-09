const o = {}; const S = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + String(r.j.error.message).slice(0, 200)) : null });
const TS = 'a641f1df-f2c6-450e-a881-857776dacf70';
const mods = async () => { const r = await api('GET', '/modules'); const d = r.j.data; return Array.isArray(d) ? d : d.items || []; };
let m = (await mods()).find(x => /qaglnfp/.test(x.moduleKey || ''));
if (!m) { o.create = S(await api('POST', `/teamspaces/${TS}/modules`, { moduleKey: 'qaglnfp', labels: { en: 'QA GL N FP' }, pluralForm: 'QA GL N FP', singularForm: 'QA GL N FP1', storageScope: 'organization' })); m = (await mods()).find(x => /qaglnfp/.test(x.moduleKey || '')); }
o.mid = m && m.id;
o.addField = S(await api('POST', '/modules/' + m.id + '/fields', { fields: [{ fieldName: 'qa_req', datatypeKey: 'single_line', labels: { en: 'QA GL N Required' }, required: true, unique: false, uniquePeerModuleIds: [] }] }));
await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'commit', timeout: 45000 }).catch(() => {});
for (let i = 0; i < 25; i++) { await sleep(1000); if (/QA GL N FP/.test(await txt().catch(() => ''))) break; }
const link = page.getByText('QA GL N FP', { exact: true }).first(); if (await link.count()) { await link.click().catch(() => {}); await sleep(6000); }
o.url = page.url(); o.tabs = await page.$$eval('[role=tab], main button, main a', bs => bs.filter(b => b.offsetParent).map(b => (b.innerText || '').trim().replace(/\s+/g, ' ')).filter(Boolean).slice(0, 50));
await page.screenshot({ path: SHOT + '/ndc/NDC-2387-1-module.png' });
return done(o);
