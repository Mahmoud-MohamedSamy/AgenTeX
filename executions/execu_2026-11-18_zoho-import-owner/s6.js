await page.getByText('Not Now').first().click().catch(()=>{}); await page.waitForTimeout(1500);
const btns = await page.$$eval('button, [role=button], a', es => es.map(e => e.innerText.trim()).filter(t => /import/i.test(t)));
out.btns = btns;
await page.getByText(/New Import/i).first().click(); await page.waitForTimeout(8000);
out.txt = ((await body(page)).split('Workstation')[1] || '').slice(0, 1500);
out.inputs = await page.$$eval('input[type=file]', es => es.length);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/shots/04-new-import.png' });
