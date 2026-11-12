async (page) => { const R = {}; const resp = []; const h = r => { if (/\/api\/v1\/.*(kanban|board|records)/.test(r.url()) && r.status() >= 400) resp.push(r.url().replace(/.*api\/v1/, '').slice(0, 120) + ' ' + r.status()); }; page.on('response', h);
  await page.goto(HOST + '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records', { waitUntil: 'domcontentloaded' }); await sleep(8000);
  await page.getByRole('button', { name: 'Kanban view' }).first().click().catch(e => R.btnErr = e.message.slice(0, 60)); await sleep(8000);
  R.text = (await bodyText()).match(/(Could not load[^.]{0,60}|Kanban[^.]{0,80})/g)?.slice(0, 4); R.cols = await page.locator('[data-kanban-column], [data-column-id]').count(); R.errs = resp.slice(0, 6);
  await page.screenshot({ path: EV + 'crm-G6-kanban-1113.png' }); page.off('response', h); return R; }
