await page.mouse.click(1527, 392); await page.waitForTimeout(1000);
const reqs = []; page.on('request', r => { if (/roundRobin/i.test(r.url()) && r.method() !== 'GET') reqs.push(r.method() + ' ' + r.url().slice(0, 150) + ' ' + (r.postData() || '').slice(0, 1500)); });
globalThis.__rrReqs = reqs;
await page.mouse.click(1402, 73); await page.waitForTimeout(8000);
const t = await body(page); const i = t.indexOf('Round Robin'); out.txt = t.slice(i, i + 1500);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/z-rr-new.png' });
