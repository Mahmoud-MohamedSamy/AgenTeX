await go('/analytics/dashboards/builder', 15000);
const disc = page.getByRole('button', { name: 'Discard them' }); if (await disc.count()) { await disc.click(); await sleep(2000); }
const addR = async name => { const b = page.getByRole('button', { name: 'Add report ' + name }).first(); if (!(await b.count())) { out.rb = await page.evaluate(() => { const bs = [...document.querySelectorAll('button')].filter(b => (b.getAttribute('aria-label') || b.innerText || '').trim() === 'Reports'); bs.forEach(b => b.click()); return bs.map(b => b.outerHTML.slice(0, 160)); }); await sleep(2000); } await b.click(); await sleep(4000); };
out.hadW1 = await page.getByRole('button', { name: 'Actions for QA GL W5 report' }).count();
if (!out.hadW1) await addR('QA GL W5 report');
await addR('Tickets Overall');
await page.getByLabel('Dashboard name').fill('QA GL W5 dashboard').catch(e => out.nameErr = e.message.slice(0, 60));
out.widgets = await page.getByRole('button', { name: /^Actions for / }).evaluateAll(es => es.map(e => e.getAttribute('aria-label')));
await shot('w5/W5-30-two-widgets');
let n0 = NET.length; await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(5000);
const dd = page.locator('[role=dialog]').last(); if (await dd.count()) { out.saveDlg = (await dd.innerText()).replace(/\s+/g, ' ').slice(0, 300); const b = dd.getByRole('button', { name: /^Save$/ }); if (await b.count()) { await b.click(); await sleep(5000); } }
out.save = NET.slice(n0).filter(x => /dashboard/i.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 140));
const m = out.save.join(' ').match(/"id":"([0-9a-f-]{36})"/); if (m) { CREATED.push({ kind: 'dashboard', id: m[1], name: 'QA GL W5 dashboard' }); out.did = m[1]; }
out.url = page.url().replace(H, '');
return fin({ out });
