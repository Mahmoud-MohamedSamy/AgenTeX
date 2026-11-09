await page.goto('https://staging-crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records/f68207e6-1bf9-4134-a3ae-7e29db2c45e9', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); const t = await page.innerText('body').catch(() => ''); if (t.includes('Timeline') && !t.includes('Record not found')) break; }
await page.getByRole('button', { name: 'Send Email' }).first().click();
await page.waitForTimeout(4000);
const d = page.locator('[role=dialog]');
await d.locator('select').first().selectOption({ label: 'QA W4 Template' });
await page.waitForTimeout(3000);
const txt = (await d.innerText()).replace(/\s+/g, ' ');
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave4/evidence/raw/t-compose-qa-template.png' });

const subj = await d.getByRole('textbox', { name: 'Subject' }).inputValue().catch(() => null); const body = await d.getByRole('textbox', { name: 'Message' }).innerText().catch(() => null);
await d.getByRole('button', { name: 'Cancel' }).click().catch(() => {}); return { subj, body };
