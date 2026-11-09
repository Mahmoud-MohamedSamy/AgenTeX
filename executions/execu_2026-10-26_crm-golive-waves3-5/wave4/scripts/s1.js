const SHOTS=[["t-email-integrations","/settings/integrations/email",""],["t-email-templates","/settings/integrations/email-templates",""],["t-email-signature","/settings/integrations/email-signature",""],["t-sms","/settings/sms",""],["t-telephony","/settings/integrations/telephony",""],["t-portals","/settings/record-portals",""],["t-activity-reminders","/settings/activity-reminders",""],["t-notif-prefs","/settings/notifications/preferences",""],["t-web-forms","/settings/web-forms",""]];
const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave4/evidence/raw/';
const out = {};
for (const [name, p, waitText] of SHOTS) {
  await page.goto('https://staging-crm.taviportal.com' + p, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  let t = '';
  for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); t = await page.innerText('main').catch(() => page.innerText('body').catch(() => '')); if ((!waitText || t.includes(waitText)) && !/Loading/.test(t)) break; }
  await page.waitForTimeout(1500);
  await page.screenshot({ path: RAW + name + '.png' });
  out[name] = t.replace(/\s+/g, ' ').slice(0, 1500);
}
return out;
