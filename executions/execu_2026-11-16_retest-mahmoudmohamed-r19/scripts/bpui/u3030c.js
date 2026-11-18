const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const ID = 'cca267b4-989c-47e8-8fa2-70b9d5935626'; const D = '/settings/automation/blueprints/' + ID;
const net = []; page.on('response', r => { if (/blueprints/.test(r.url()) && r.request().method() !== 'GET') net.push(r.request().method() + ' ' + r.status() + ' ' + r.url().split('/blueprints/')[1].slice(36, 60)); });
const editOpen = async p => { const ed = p.getByRole('button', { name: 'Edit' }).first(); if (await ed.count()) { await ed.click(); await p.waitForTimeout(1000); } };
await page.goto(H + D, { waitUntil: 'domcontentloaded' }); await sleep(10000); await editOpen(page);
await page.locator('textarea').first().fill('QA RT19 desc keep-my-changes run'); await sleep(500);
// someone else renames in another tab (tab B) while tab A is in background
const pB = await ctx.newPage(); await pB.goto(H + D, { waitUntil: 'domcontentloaded' }); await pB.waitForTimeout(10000); await editOpen(pB);
await pB.locator('input').nth(1).fill('QA BP RT19 3030 RENAMED BY B run4'); await pB.waitForTimeout(500);
await pB.getByRole('button', { name: 'Save and Publish' }).click(); await pB.waitForTimeout(6000); await pB.close();
// come back to tab A
await page.bringToFront(); await page.evaluate(() => { document.dispatchEvent(new Event('visibilitychange')); window.dispatchEvent(new Event('focus')); }); await sleep(5000);
const tb = (await text()).replace(/\s+/g, ' '); const bi = tb.search(/someone else|changed since|was changed|saved again/i);
log('on return to tab', bi >= 0 ? tb.slice(bi, bi + 250) : 'no warning');
await shot('3030-6-return-to-tab.png');
await page.getByRole('button', { name: 'Save and Publish' }).click(); await sleep(5000);
const t2 = (await text()).replace(/\s+/g, ' '); log('after save', (t2.match(/Someone else.{0,120}/) || ['none'])[0]);
const k = page.getByRole('button', { name: 'Keep my changes' }).first(); if (await k.count()) { await k.click(); await sleep(1500); await shot('3030-7-keep-confirm.png'); const tt = (await text()).replace(/\s+/g, ' '); const di = tt.search(/Keep your changes|keep my|overwrite|replace/i); log('keep dialog', tt.slice(Math.max(0, di - 50), di + 300)); }
log('net', net);
return { ok: 1 };
