const reqs = []; page.on('request', r => { if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/') && !/heartbeat|presence|iam\/auth|resolved-batch/.test(r.url())) reqs.push(r.method() + ' ' + r.url().replace(H + '/api/v1', '') + ' ' + (r.postData() || '').slice(0, 200)); });
await page.setViewportSize({ width: 1280, height: 720 });
const id = (await (async () => { return 'b81a130a-007d-4872-9825-08df9e8028e4'; })());
await page.goto(H + '/views/all/tickets/' + id, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
const own = page.getByText('Customer Experience Specialists 2', { exact: true }).first(); await own.click().catch(() => {}); await page.waitForTimeout(1500);
await page.getByText('Unassign', { exact: true }).first().click(); await page.waitForTimeout(4000);
const opts = (await page.innerText('body')).split(String.fromCharCode(10)).filter(l => /unassign|confirm|denied|error/i.test(l)).slice(0, 8);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_retest-ndc2203-r7/screenshots/raw/cl-owner-menu.png' });
return { opts, reqs };
