const out = { req: [], fail: [] };
page.on('response', r => { const m = r.request().method(); if (m !== 'GET' || r.status() >= 400) out.req.push(r.status() + ' ' + m + ' ' + r.url().replace(H, '').split('?')[0].slice(0, 110)); });
page.on('requestfailed', r => out.fail.push(r.method() + ' ' + r.url().split('?')[0].slice(0, 110) + ' ' + (r.failure()?.errorText || '')));
const dir = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_retest-mahmoudmohamed-r8/files/';
await page.locator('input[type=file]').nth(1).setInputFiles(dir + 'QA RT r8 file 01.png'); await sleep(20000); await shot('v35-one-upload');
out.toast = (await txt()).split('\n').filter(l => /upload|Upload|attach/i.test(l)).slice(0, 5);
out.req = out.req.filter(x => !/realtime|resolved-batch|presence|heartbeat|telemetry/.test(x)).slice(0, 15);
return done(out);
