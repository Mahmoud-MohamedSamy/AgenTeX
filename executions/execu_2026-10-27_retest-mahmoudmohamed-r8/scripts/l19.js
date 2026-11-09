const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await relabel('Phone 6', 'QA RT phone r6');
await page.evaluate(() => window.scrollTo(0, 0)); await drag('Email', 800, 600);
const newEmail = (await txt()).split('\n').find(l => /^Email \d+$/.test(l.trim())); if (newEmail) await relabel(newEmail.trim(), 'QA RT email r6');
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/modules/')) resp.push(q.method() + ' ' + q.url().replace(/^.*\/api\/v1/, '').slice(0, 90) + ' → ' + r.status()); }; page.on('response', f);
await page.getByRole('button', { name: 'Save', exact: true }).click({ force: true }); await sleep(2000); const sa = page.getByRole('button', { name: /Save anyway/i }); if (await sa.count()) await sa.click(); await sleep(8000); page.off('response', f);
await shot('2423-01-fields-added');
const fl = arr((await api('GET', `/modules/${L}/fields`)).j?.data).filter(x => /QA RT (phone|email) r6/.test(x.labels?.en || '')).map(x => ({ id: x.id, api: x.apiName, type: x.datatypeKey, cfg: JSON.stringify(x.config).slice(0, 220), unique: x.unique, required: x.required }));
return done({ newEmail, resp, fl });
