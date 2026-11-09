const ZSHOTS=[["z-email-config","Email"],["z-webforms","Webforms"],["z-portals","Portals"],["z-sms","Notification SMS"],["z-telephony","Telephony"],["z-templates","Templates"]];
// ZSHOTS = [[file, linkText]] : clicks the Setup sidebar link with that exact text, waits, screenshots, returns page text.
const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave4/evidence/raw/';
const out = {};
for (const [file, link] of ZSHOTS) {
  await page.goto('https://crm.zoho.com/crm/org943261092/settings/index', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(1000); if (await page.getByText(link, { exact: true }).count()) break; }
  await page.getByText(link, { exact: true }).first().click().catch(e => out[file + ' click'] = e.message.slice(0, 80));
  let t = ''; for (let i = 0; i < 30; i++) { await page.waitForTimeout(1000); t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' '); if (!/^Loading|Loading\.\.\./.test(t.slice(0, 40)) && i > 5) break; }
  await page.waitForTimeout(2500);
  await page.screenshot({ path: RAW + file + '.png' });
  out[file] = page.url().replace(/\?.*/, '') + ' :: ' + t.slice(0, 1200);
}
return out;
