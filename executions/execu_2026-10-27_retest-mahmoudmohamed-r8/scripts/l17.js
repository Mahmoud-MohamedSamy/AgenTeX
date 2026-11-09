// NDC-2423 step 1: add QA Phone + QA Email fields, save.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const add = async (type, label, y) => { await drag(type, 800, y); await page.getByText('GENERAL', { exact: true }).last().click({ force: true }); await sleep(800); await page.getByPlaceholder('Label in English').fill(label); await sleep(400); await page.getByRole('button', { name: 'Apply', exact: true }).last().click(); await sleep(1500); };
page.on('dialog', d => d.accept().catch(() => {})); await go('/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts/212d0ec2-9ca9-4f39-b524-30275f5fd713', 15000);
await add('Phone', 'QA RT phone r6', 600); await add('Email', 'QA RT email r6', 600);
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/modules/')) resp.push(q.method() + ' ' + q.url().replace(/^.*\/api\/v1/, '').slice(0, 90) + ' → ' + r.status()); }; page.on('response', f);
await page.getByRole('button', { name: 'Save', exact: true }).click({ force: true }); await sleep(2000); const sa = page.getByRole('button', { name: /Save anyway/i }); if (await sa.count()) await sa.click(); await sleep(8000); page.off('response', f);
const fl = arr((await api('GET', `/modules/${L}/fields`)).j?.data).filter(x => /QA RT (phone|email) r6/.test(x.labels?.en || '')).map(x => ({ id: x.id, api: x.apiName, type: x.datatypeKey, cfg: JSON.stringify(x.config).slice(0, 200), unique: x.unique, required: x.required }));
return done({ resp, fl });
