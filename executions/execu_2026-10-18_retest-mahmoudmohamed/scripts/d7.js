const out = {}; const resp = [];
const fr = async r => { if (r.request().method() === 'DELETE' || (r.request().method() === 'POST' && /delete/i.test(r.url()))) resp.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(API, '') + ' ' + (r.request().postData() || '').slice(0, 200)); };
page.on('response', fr);
await page.getByRole('button', { name: 'Cancel' }).first().click().catch(() => {}); await sleep(800);
const sb = page.getByPlaceholder(/Search/i).first(); await sb.fill('').catch(() => {});
await page.getByRole('checkbox', { name: 'Select record ad0d3273-e254-4814-9598-10feacb4296e' }).check(); await sleep(1500);
out.bar = (await page.locator('main').last().innerText()).slice(0, 400).replace(/\s+/g, ' ');
await shot('NDC-1821-leads-list-selected');
const del = page.getByRole('button', { name: /^Delete/ }).first();
if (await del.count()) { await del.click(); } else { await page.getByRole('button', { name: /More|Actions|\.\.\./ }).first().click(); await sleep(800); await page.getByRole('menuitem', { name: /Delete/ }).first().click(); }
await sleep(1500);
out.confirm = (await page.locator('[role=alertdialog], [role=dialog]').last().innerText().catch(() => '')).replace(/\n+/g, ' | ');
await shot('NDC-1821-leads-list-confirm');
await page.locator('[role=alertdialog], [role=dialog]').last().getByRole('button', { name: /^Delete/ }).click(); await sleep(5000);
await shot('NDC-1821-leads-list-after-delete');
page.off('response', fr); out.resp = resp; return done(out);
