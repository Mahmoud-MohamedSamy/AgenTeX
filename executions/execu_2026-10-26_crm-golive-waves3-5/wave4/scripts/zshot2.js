const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave4/evidence/raw/';
const out = {};
for (const [file, path] of ZSHOTS) {
  await page.goto('https://crm.zoho.com' + path, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  let t = ''; for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' '); if (i > 8 && !/Loading/.test(t.slice(0, 120))) break; }
  await page.waitForTimeout(3000);
  await page.screenshot({ path: RAW + file + '.png' });
  const s = t.indexOf('Developer Hub'); out[file] = page.url().replace(/\?.*/, '') + ' :: ' + t.slice(s > 0 ? s : 0).slice(-1400);
}
return out;
