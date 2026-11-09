await page.getByRole('button', { name: 'Get Started' }).or(page.getByText('Get Started', { exact: true })).first().click().catch(() => {});
await page.waitForTimeout(8000);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave4/evidence/raw/z-email-providers-list.png' });
const t = (await page.innerText('body')).replace(/\s+/g, ' '); const i = t.indexOf('Configure Email');
return t.slice(i, i + 900);
