const st = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'out/state.json'), 'utf8'));
const out = {}; const U = st.U;
const dialogs = []; page.on('dialog', async d => { dialogs.push(d.type() + ':' + d.message()); await d.dismiss().catch(() => {}); });
const reqs = []; page.on('response', async r => { if (/\/resolution/.test(r.url()) && r.request().method() !== 'GET') { let b = ''; try { b = (await r.text()).slice(0, 250); } catch (e) {} reqs.push(r.request().method() + ' ' + r.status() + ' ' + (r.request().postData() || '').slice(0, 120) + ' -> ' + b); } });
const tab = async n => { await page.getByRole('tab', { name: new RegExp(n, 'i') }).first().click(); await sleep(2500); };
const pane = async () => (await page.locator('main, body').last().innerText().catch(() => '')).replace(/^[sS]*?HISTORY/, '').replace(/\s+/g, ' ').slice(0, 500);
const toast = async () => (await page.locator('[data-sonner-toast], [role=status]').allInnerTexts().catch(() => [])).join(' | ').replace(/\s+/g, ' ').slice(0, 200);
// ---- R-01 / R-02 / R-05 / R-03 (+notify) on U1
await go('/views/all/tickets/' + U.u1); await sleep(5000);
await tab('Resolution'); out['R-01 empty'] = await pane(); await shot('R01-empty');
const add = page.getByRole('button', { name: /Add Resolution/i }); if (await add.count()) { await add.first().click(); await sleep(1200); }
const ed = page.locator('[contenteditable="true"]:visible').first();
out.editorShown = await ed.count();
const saveBtn = page.getByRole('button', { name: /^Save$/ }).last();
out['R-02 save disabled when empty'] = await saveBtn.isDisabled().catch(() => 'n/a');
if (!(await saveBtn.isDisabled().catch(() => true))) { await saveBtn.click(); await sleep(1500); out['R-02 msg'] = await pane(); }
await shot('R02-empty-save');
// R-05 clear + cancel
await ed.click(); await page.keyboard.type('QA TT draft to clear');
const clear = page.getByRole('button', { name: /^Clear$/ }); out.clearBtn = await clear.count();
if (out.clearBtn) { await clear.first().click(); await sleep(800); out['R-05 after clear'] = (await ed.innerText().catch(() => '')).slice(0, 80) || '(empty)'; }
await ed.click(); await page.keyboard.type('QA TT draft to cancel');
const cb = page.getByRole('button', { name: /^Cancel$/ }); out.cancelOnNew = await cb.count(); if (out.cancelOnNew) { await cb.last().click(); await sleep(1500); } else { await page.getByRole('button', { name: /^Clear$/ }).first().click(); await sleep(800); }
out['R-05 after cancel'] = await pane(); await shot('R05-after-cancel');
// R-03 + R-08 (UI path): add with Notify ticked
if (await add.count()) { await add.first().click(); await sleep(1200); }
await page.locator('[contenteditable="true"]:visible').first().click();
await page.keyboard.type('QA TT UI resolution with notify (you can ignore this email)');
const nb = page.getByLabel(/Notify customer/i); out.notifyDefault = await nb.isChecked().catch(() => 'n/a'); if (!(await nb.isChecked().catch(() => true))) await nb.check();
await shot('R03-before-save');
await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000);
out['R-03 toast'] = await toast(); out['R-03 pane'] = await pane(); await shot('R03-saved');
// R-06 delete via UI
const act = page.getByRole('button', { name: /Resolution actions/i });
out.actionsBtn = await act.count();
if (out.actionsBtn) { await act.first().click(); await sleep(800); out.menu = (await page.locator('[role=menu]').innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('R06-menu'); await page.getByRole('menuitem', { name: /Delete/ }).first().click(); await sleep(1200); out['R-06 dialog'] = (await page.locator('[role=alertdialog], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await shot('R06-confirm'); await page.getByRole('button', { name: /^Delete$/ }).last().click(); await sleep(2500); out['R-06 after'] = await pane(); await shot('R06-after'); }
// ---- R-07 render XSS ticket
await go('/views/all/tickets/' + U.xss); await sleep(5000); await tab('Resolution'); await sleep(2000);
out['R-07 pane'] = await pane(); out['R-07 xss ran'] = await page.evaluate(() => ({ s: !!window.__qa_xss, i: !!window.__qa_xss2 })); out.dialogs = dialogs; await shot('R07-xss-render');
// ---- R-11 Save And Add Article on X ticket
await go('/views/all/tickets/' + U.x); await sleep(5000); await tab('Resolution');
if (await add.count()) { await add.first().click(); await sleep(1200); }
await page.locator('[contenteditable="true"]:visible').first().click(); await page.keyboard.type('QA TT resolution for article');
const sa = page.getByRole('button', { name: /Save And Add Article/i }); await sa.click(); await sleep(6000);
out['R-11 url'] = page.url().replace(/^https:\/\/[^/]+/, ''); out['R-11 page'] = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 400); await shot('R11-article');
out.reqs = reqs;
return out;
