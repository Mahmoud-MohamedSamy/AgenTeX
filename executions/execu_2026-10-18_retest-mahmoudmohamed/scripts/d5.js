const out = {}; const resp = [];
const fr = async r => { const u = r.url(); if (r.request().method() === 'DELETE' || /recycle/.test(u)) { let b = ''; try { b = (await r.text()).slice(0, 300); } catch (e) { } resp.push(r.status() + ' ' + r.request().method() + ' ' + u.replace(API, '') + ' ' + b); } };
page.on('response', fr);
const opt = () => page.locator('[role=listbox] [role=option]');
await go('/workqueue', 12000);
await page.getByRole('button', { name: /^My Leads/ }).first().click(); await sleep(6000);
if (await page.getByRole('button', { name: 'Clear filters' }).count()) { await page.getByRole('button', { name: 'Clear filters' }).click(); await sleep(3000); }
if (!(await page.getByRole('button', { name: 'Criteria field' }).count())) { await page.locator('main button[aria-label*="ilter"]').first().click(); await sleep(1500); }
await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(900);
await page.getByPlaceholder('Search fields').fill('Full Name'); await sleep(700); await opt().filter({ hasText: /^Full Name$/ }).first().click(); await sleep(1200);
await page.locator('button[aria-label^="Operator for"]').first().click(); await sleep(700); await opt().filter({ hasText: /^Contains$/ }).click(); await sleep(800);
const vi = page.locator('[role=group][aria-label="Filter these records"] input').last(); await vi.fill('QA RT del-wq'); await vi.press('Enter'); await sleep(5000);
out.rows = (await page.locator('main tbody').last().innerText()).replace(/\s+/g, ' ').slice(0, 300);
await shot('NDC-1821-wq-row-before-delete');
await page.locator('main tbody tr').first().hover(); await page.getByRole('button', { name: 'Row actions' }).first().click(); await sleep(1000);
await page.getByRole('menuitem', { name: 'Delete' }).click(); await sleep(1500);
out.confirm = (await page.locator('[role=alertdialog], [role=dialog]').last().innerText().catch(() => '')).replace(/\n+/g, ' | ');
await shot('NDC-1821-wq-delete-confirm');
await page.locator('[role=alertdialog], [role=dialog]').last().getByRole('button', { name: /^Delete/ }).click(); await sleep(5000);
out.rowsAfter = (await page.locator('main tbody').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
out.toast = (await page.locator('[role=status], [data-sonner-toast]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300);
await shot('NDC-1821-wq-after-delete');
page.off('response', fr); out.resp = resp; return done(out);
