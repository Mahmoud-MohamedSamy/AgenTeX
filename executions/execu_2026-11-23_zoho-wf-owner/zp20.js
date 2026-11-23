const base = 'https://desk.zoho.com/agent/techegysolutions/tech'; out.r = {};
for (const p of ['/setup/workflows/rules/1499272000000432293/list', '/setup#setup/automation/1499272000000432293/workflows/rules', '/setup/workflows/field-updates/1499272000000432293/list', '/setup/home']) {
  await page.goto(base + p, { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {}); await sleep(20000);
  out.r[p] = { url: page.url().replace(base, ''), hasWorkflows: await page.getByText('Workflows', { exact: true }).count(), hasRules: await page.getByText('Rules', { exact: true }).count() }; }
await shot('zp20-last');
