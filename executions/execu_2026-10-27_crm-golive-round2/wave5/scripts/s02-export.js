const res = {};
await page.locator('main button', { hasText: /^Export$/ }).first().click(); await sleep(1200);
const d = page.locator('[role=dialog]').first();
await d.locator('text=Detailed report').first().click().catch(() => {});
await d.locator('text=CSV').first().click(); await sleep(500);
const net = []; const on = r => { if (/export|jobs|artifact/.test(r.url())) net.push(r.request().method() + ' ' + r.url().replace(/^.*\/api\/v1/, '') + ' ' + r.status()); };
page.on('response', on);
const dl = page.waitForEvent('download', { timeout: 60000 }).catch(() => null);
await d.locator('button', { hasText: /^Export$/ }).click();
const f = await dl;
if (f) { const p = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_crm-golive-round2/wave5/after/s02-export.csv'; await f.saveAs(p); res.file = f.suggestedFilename(); }
else { await sleep(5000); res.noDownload = (await page.innerText('body')).replace(/\s+/g, ' ').match(/[^.]{0,80}(export|ready|email|download)[^.]{0,80}/gi)?.slice(0, 4); }
page.off('response', on); res.net = net;
await shot('s02-export-after');
return res;
