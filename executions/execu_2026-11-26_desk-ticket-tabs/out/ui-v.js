const st = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'out/state.json'), 'utf8'));
const out = {}; const V = st.V;
const body = async () => (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ');
const status = async () => (await body()).match(/Status (\w[\w ]*?) (Due|Response|Time)/)?.[1];
const errs = []; page.on('response', async r => { if (r.request().method() !== 'GET' && /tickets|records/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 200); } catch (e) {} errs.push(r.request().method() + ' ' + r.status() + ' ' + r.url().replace(/^.*\/api\/v1/, '').replace(/[0-9a-f-]{36}/g, '{id}') + ' ' + b); } });
// P-10 screen: status dropdown to Closed on parent with open children (block rule on)
await go('/views/all/tickets/' + V.bp); await sleep(6000);
out.before = await status();
const sb = page.locator('button').filter({ hasText: /^Open$/ }).first(); await sb.click(); await sleep(1000);
out.options = (await page.locator('[role=listbox], [role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
await page.getByRole('option', { name: /^Closed$/ }).or(page.getByRole('menuitem', { name: /^Closed$/ })).first().click().catch(e => out.pickErr = String(e).slice(0, 100)); await sleep(3000);
out.dialog = (await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await shot('V-P10-status-dropdown');
const conf = page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /^Close ticket$|^Save$|^Confirm$/i }); if (await conf.count()) { await conf.first().click(); await sleep(3000); out.dialog2 = (await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); }
await page.reload(); await sleep(6000); out.afterReload = await status(); await shot('V-P10-after');
// P-12 screen: reopen a closed child of auto-closed parent
await go('/views/all/tickets/' + V.ac1); await sleep(6000);
const ro = page.getByRole('button', { name: /^Reopen/i }); out.reopenBtn = await ro.count();
if (out.reopenBtn) { await ro.first().click(); await sleep(3000); } else { const sb2 = page.locator('button').filter({ hasText: /^Closed$/ }).first(); await sb2.click().catch(() => {}); await sleep(800); await page.getByRole('option', { name: /^Open$/ }).or(page.getByRole('menuitem', { name: /^Open$/ })).first().click().catch(() => {}); await sleep(3000); }
out.childAfter = await status(); await shot('V-P12-child-reopened');
await go('/views/all/tickets/' + V.ap); await sleep(6000); out.parentAfter = await status(); await shot('V-P12-parent');
out.calls = errs.slice(0, 12);
return out;
