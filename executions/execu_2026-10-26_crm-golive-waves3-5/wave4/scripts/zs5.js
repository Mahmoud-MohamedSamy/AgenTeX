const out = {};
for (const p of ['email-configuration/email-integration', 'email-configuration/email-config', 'email-configuration/imap', 'email', 'personal-settings/email']) {
  await page.goto('https://crm.zoho.com/crm/org943261092/settings/' + p, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(9000);
  const t = (await page.innerText('body')).replace(/\s+/g, ' ');
  out[p] = page.url().replace('https://crm.zoho.com/crm/org943261092/settings/', '') + ' imap=' + /IMAP/i.test(t) + ' gmail=' + /Gmail/i.test(t) + ' o365=' + /(Office 365|Outlook|Microsoft)/i.test(t);
  if (/IMAP/i.test(t) && /Gmail/i.test(t)) { await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave4/evidence/raw/z-email-providers.png' }); out.hit = p; out.text = t.slice(t.search(/IMAP|Gmail/) - 300, t.search(/IMAP|Gmail/) + 600); break; }
}
return out;
