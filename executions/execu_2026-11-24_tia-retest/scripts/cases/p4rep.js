const R = { errs: [], fails: [] }; page.on('console', m => { if (m.type() === 'error') R.errs.push(m.text().slice(0, 160)); }); page.on('response', r => { if (r.status() >= 400 && /\/api\//.test(r.url())) R.fails.push(r.status() + ' ' + r.url().replace(/^.*\/api\/v1/, '').slice(0, 90)); });
await go('/reports'); await sleep(40000);
R.text = (await text()).split('\n').map(s => s.trim()).filter(Boolean).slice(-15); await shot('P4-reports-40s');
await page.goto(H + '/reports/view/03d7cdc2-2dda-4d7e-aa38-a1b9fdd65211', { waitUntil: 'domcontentloaded' }); await sleep(40000);
R.viewText = (await text()).split('\n').map(s => s.trim()).filter(Boolean).slice(-40); await shot('P4-report-view-40s');
R.errs = R.errs.slice(0, 8); R.fails = R.fails.slice(0, 8); return R;
