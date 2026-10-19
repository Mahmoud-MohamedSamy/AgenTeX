const out = { calls: [] };
const fr = r => { const u = r.url(); if (/approval/i.test(u) && r.request().method() === 'GET') out.calls.push(u.replace(API, '').slice(0, 150)); }; page.on('request', fr);

await page.getByText('Approval Processes', { exact: true }).first().click(); await sleep(10000);
out.url = page.url().replace(H, ''); out.body = (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900);
await shot('NDC-1234-approval-processes');
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const f = await api('GET', '/modules/' + L + '/fields'); const ap = arr(f.j.data).find(x => x.apiName === 'approval_status');
out.approvalField = ap && { type: ap.datatypeKey, values: ap.datatypeOptions, sysManaged: ap.isSystemManaged, sys: ap.isSystemField, caps: ap.capabilities };
page.off('request', fr); return done(out);
