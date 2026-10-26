await page.goto(H + '/settings/security/audit-log', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/integration|Audit/i.test(await txt().catch(() => ''))) break; } await sleep(2500);
const lines = (await txt()).split('\n').filter(l => /integration|CRM ⇄ Desk/i.test(l)).slice(0, 6);
await shot('2409-01-audit-log');
const row = page.getByText(/CRM ⇄ Desk integration settings/).first(); let detail = null;
if (await row.count()) { await row.click(); await sleep(1500); detail = (await page.evaluate(() => (document.querySelector('[role=dialog]') || document.querySelector('aside[role], [data-state=open]') || {}).innerText?.slice(0, 500) || null)); await shot('2409-02-audit-detail'); }
return done({ url: page.url().replace(H, ''), lines, detail });
