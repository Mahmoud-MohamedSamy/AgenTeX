const out = {};
for (const [k, p] of [['permissions', '/settings/security/permissions'], ['profiles', '/settings/security/profiles']]) {
  await page.goto('https://staging-crm.taviportal.com' + p, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000);
  await page.screenshot({ path: `D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/serial/evidence/raw/t-pe06-user1-${k}.png` });
  out[k] = { url: page.url(), text: (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 400) };
}
out.api = (await call('GET', '/iam/profiles')).s;
return out;
