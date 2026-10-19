const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const R = 'd802f26e-3cdc-410d-b1ab-735917a64024'; const out = { calls: [] };
const SHOT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-18_retest-mahmoudmohamed/screenshots/raw/';
page.on('response', async r => { const m = r.request().method(); if (m !== 'GET' && /approv/i.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 200); } catch (e) { } out.calls.push(r.status() + ' ' + m + ' ' + r.url().replace(H + '/api/v1', '') + ' ' + (r.request().postData() || '').slice(0, 200) + ' -> ' + b); } });
await page.goto(H + '/modules/' + D + '/records/' + R, { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(1000); if (await page.getByText('Respond', { exact: true }).count()) break; } await page.getByText('Respond', { exact: true }).first().click(); for (let i = 0; i < 20; i++) { await sleep(1000); if (await page.getByRole('button', { name: /^Approve/ }).count()) break; }
await page.screenshot({ path: SHOT + 'NDC-1234-pending.png' });
out.buttons = (await page.getByRole('button').allInnerTexts()).filter(t => /approv|reject|delegat|reset/i.test(t)).slice(0, 8);
const ab = page.getByRole('button', { name: /^Approve/ }).first(); out.approveBtn = await ab.count();
if (out.approveBtn) { await ab.click(); await sleep(2000); const dlg = page.locator('[role=dialog], [role=alertdialog]').last(); if (await dlg.count()) { out.dlg = (await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 200); const t = dlg.locator('textarea'); if (await t.count()) await t.fill('QA retest NDC-1234'); await dlg.getByRole('button', { name: /^Approve/ }).last().click(); } await sleep(5000); }
await page.screenshot({ path: SHOT + 'NDC-1234-approved.png' });
const g = await api('GET', '/modules/' + D + '/records/' + R); out.after = ((g.j.data.data || []).find(x => x.field === 'approval_status') || { value: {} }).value.value;
return out;
