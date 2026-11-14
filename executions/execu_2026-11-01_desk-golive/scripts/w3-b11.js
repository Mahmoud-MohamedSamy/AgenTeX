const A = 'c0e196f8-7ad6-4978-a910-7ae0bf8513ca', T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd', SRC = '56a69b17-df26-4ecc-a5f6-77c95f75f39c';
const run = async ref => (await api('POST', '/workflow/custom-actions/' + A + '/run', { runtimeInputs: { ref, note: 'QA GL W3 auth run' }, context: { app: 'desk', moduleId: TM, recordId: T1, label: 'x' } })).s;
out.r1 = await run('QAREF-KEY2');
// UI run as well
await go('/views/all/tickets/' + T1, 12000); await page.locator('#main-content').getByRole('button', { name: 'Actions', exact: true }).click(); await sleep(1200); await page.getByRole('menuitem', { name: 'QA GL W3 echo' }).click(); await sleep(2500);
const d = page.locator('[role=dialog]').last(); const ins = d.locator('input:visible'); await ins.nth(0).fill('QAREF-KEY-UI'); await ins.nth(1).fill('QA GL W3 key ui'); await d.getByRole('button', { name: /^Run/ }).last().click(); await sleep(6000);
out.uiRes = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
// see run details for headers
const det = d.getByText('Details', { exact: true }).last(); if (await det.count()) { await det.click(); await sleep(2000); out.details = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').replace(/qa-gl-w3-dummy-key-123/g, '<<PLAINTEXT KEY>>').slice(0, 1500); await shot('w3/W3-12-run-details'); }
return fin({ out });
