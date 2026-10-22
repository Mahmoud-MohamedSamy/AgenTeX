const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const lay = (await api('GET', `/modules/${L}/layouts`)).j.data.find(l => l.name === 'FieldPermissions');
const s = JSON.stringify(lay.views);
const enabled = await page.getByRole('button', { name: 'Save', exact: true }).isEnabled();
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/api/')) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 120) + ' → ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 400)); }; page.on('response', f);
let clicked = false; if (enabled) { await page.getByRole('button', { name: 'Save', exact: true }).click(); clicked = true; await sleep(10000); }
page.off('response', f);
const lay2 = (await api('GET', `/modules/${L}/layouts`)).j.data.find(l => l.name === 'FieldPermissions');
return done({ before: s.includes('qa_rt_rollup'), modified: lay.updatedAt || lay.lastModifiedAt, enabled, clicked, resp, after: JSON.stringify(lay2.views).includes('qa_rt_rollup'), toasts: await page.locator('[data-sonner-toast]').allInnerTexts() });
