await page.goto('https://crm.zoho.com/crm/org943261092/settings/email-configuration/email-settings?action=mailSelect', { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(12000);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave4/evidence/raw/z-email-providers.png' });
const t = (await page.innerText('body')).replace(/\s+/g, ' '); const i = Math.max(0,t.search(/Gmail|IMAP|Zoho Mail|Outlook/i));
return t.slice(i - 200, i + 900);
