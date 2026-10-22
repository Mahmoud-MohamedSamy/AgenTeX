const resp = []; const f = async r => { const u = r.url(); if (u.includes('/import')) resp.push(r.request().method() + ' ' + u.replace(H + '/api/v1', '').slice(0, 160) + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 1500)); }; page.on('response', f);
const fb = page.getByRole('button', { name: 'Filters' }); if (!(await page.locator('[role=dialog],[role=menu]').count())) { await fb.click(); await sleep(1500); }
const pan = await page.locator('[role=dialog],[role=menu],[data-radix-popper-content-wrapper]').allInnerTexts();
await shot('1590-03-filters');
await page.keyboard.press('Escape'); await sleep(500);
await page.getByRole('button', { name: 'Back', exact: true }).last().click(); await sleep(3000);
await page.getByRole('button', { name: 'Save & next' }).click(); await sleep(6000);
page.off('response', f);
const tbl = (await txt()).match(/All errors[\s\S]*?Rows per page/)?.[0];
return done({ pan, tbl, resp });
