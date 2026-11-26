const o = {};
await go('/settings/automation/workflow-rules'); await page.getByText('Data Backup').first().waitFor({ timeout: 120000 }).catch(() => {});
const link = page.getByText('Data Backup', { exact: true }).first(); o.hasLink = await link.count(); if (o.hasLink) { await link.click(); await sleep(7000); }
o.backupUrl = page.url(); o.backupText = (await page.locator('main').first().innerText().catch(() => '')).slice(0, 1500);
await shot('2863-data-backup-page');
const sb = page.getByText(/^Sandbox(es)?$/).first(); o.sbLink = await sb.count(); if (o.sbLink) { await sb.click(); await sleep(7000); o.sbUrl = page.url(); o.sbText = (await page.locator('main').first().innerText().catch(() => '')).slice(0, 1500); await shot('2863-sandbox-page'); }
return o;
