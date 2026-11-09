// in-app navigation to Leads › Module actions › Import Leads
page.on('dialog', d => d.accept().catch(() => {}));
if (!/841043e1-c078-41f9-8d6e-dfd61bee45c3$/.test(page.url())) await go('/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3', 40000);
await page.getByRole('button', { name: 'Module actions' }).first().click({ force: true }); await sleep(1200);
await page.getByText(/^Import Leads$/).first().click({ force: true }); await sleep(8000);
const out = {}; const bad = []; page.on('response', r => { if (r.status() >= 400 && /api|s3/.test(r.url())) bad.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(H, '').split('?')[0].slice(0, 90)); });
await shot('v42-import-1'); out.step1 = (await txt()).split('\n').map(l => l.trim()).filter(l => /Upload|file|Trigger|automation|Coming soon|approval/i.test(l)).slice(0, 10);
const inp = page.locator('input[type=file]').last(); if (await inp.count()) { await inp.setInputFiles('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_retest-mahmoudmohamed-r8/files/qa-rt-r8-import.csv'); await sleep(12000); }
for (let i = 0; i < 4; i++) { const t = await txt(); if (/Trigger|automation and process/i.test(t)) break; const nx = page.getByRole('button', { name: /^(Next|Continue)$/ }).last(); if (!(await nx.count()) || await nx.isDisabled()) break; await nx.click(); await sleep(9000); }
await shot('v42-import-options');
out.options = (await txt()).split('\n').map(l => l.trim()).filter(l => /Trigger|automation|process management|workflow|approval|blueprint|Coming soon|Manual/i.test(l)).slice(0, 14); out.bad = bad.slice(0, 6);
return done(out);
