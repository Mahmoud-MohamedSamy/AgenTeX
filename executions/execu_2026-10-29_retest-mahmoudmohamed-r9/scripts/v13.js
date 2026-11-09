const out = {}; const bad = []; page.on('response', r => { if (r.url().includes('/api/') && r.status() >= 400) bad.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(API, '').split('?')[0]); });
await page.setViewportSize({ width: 1700, height: 900 }); await sleep(2500); await shot('v13-list-wide');
const hdr = await page.getByText('Pipeline', { exact: true }).first().boundingBox(); const rb = await page.getByText('QA RT r8 deal', { exact: true }).first().boundingBox();
out.hdr = hdr; await page.mouse.move(hdr.x + 20, rb.y + rb.height / 2); await sleep(800);
await page.mouse.click(hdr.x + 20, rb.y + rb.height / 2); await sleep(3000); await shot('v13-inline-pipeline');
out.dialog = (await txt()).split('\n').filter(l => /pipeline|Pipeline|Stage|stage|Change|Cancel/.test(l)).slice(0, 20);
out.bad = bad; return done(out);
