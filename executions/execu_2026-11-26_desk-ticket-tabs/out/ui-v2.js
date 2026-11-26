const st = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'out/state.json'), 'utf8'));
const out = {}; const V = st.V;
const calls = []; page.on('response', async r => { const m = r.request().method(); if (m !== 'GET' && /\/(close|reopen|records|status)/.test(r.url()) && !/summaries|heartbeat/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 220); } catch (e) {} calls.push(m + ' ' + r.status() + ' ' + r.url().replace(/^.*\/api\/v1/, '').replace(/[0-9a-f-]{36}/g, '{id}') + ' ' + (r.request().postData() || '').slice(0, 100) + ' -> ' + b); } });
const panelStatus = () => page.locator('xpath=//*[normalize-space(text())="Status"]/following::button[1]').first();
// P-10 on parent bp (child bc1 still Open)
await go('/views/all/tickets/' + V.bp); await sleep(6000);
out.before = (await panelStatus().innerText()).trim();
await panelStatus().click(); await sleep(1000);
await page.keyboard.type('Closed'); await sleep(800); await shot('V2-search'); await page.getByText('Closed', { exact: true }).last().click(); await sleep(3000);
out.dialog = (await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await shot('V2-P10-dropdown');
const conf = page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /^Close ticket$/i });
if (await conf.count()) { await conf.click(); await sleep(3000); out.dialog2 = (await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await shot('V2-P10-after-confirm'); const c = page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /^Cancel$/ }); if (await c.count()) await c.click(); }
await page.reload(); await sleep(6000); out.after = (await panelStatus().innerText()).trim();
// P-12 reopen ac1 (parent ap Closed)
await go('/views/all/tickets/' + V.ac1); await sleep(6000);
await page.getByRole('button', { name: /^Reopen/i }).first().click(); await sleep(1200);
await page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /^Reopen ticket$/i }).click(); await sleep(4000);
out.childAfter = (await panelStatus().innerText()).trim();
await go('/views/all/tickets/' + V.ap); await sleep(6000); out.parentAfter = (await panelStatus().innerText()).trim(); await shot('V2-P12-parent');
out.calls = calls;
return out;
