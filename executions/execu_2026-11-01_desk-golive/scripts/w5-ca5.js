const d = page.locator('[role=dialog]').last();
const n0 = NET.length; await d.getByRole('button', { name: /Save & publish/ }).click(); await sleep(6000);
out.net = NET.slice(n0).filter(x => !/heartbeat/.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 220));
for (const x of NET.slice(n0)) { const m = (x.t || '').match(/"id":"([0-9a-f-]{36})"/); if (m && x.m === 'POST' && x.s < 300) CREATED.push({ kind: x.u.split('?')[0].replace(/^\//, ''), id: m[1], name: 'QA GL W5 action/source' }); }
await sleep(2000); out.list = (await mtxt()).includes('QA GL W5 action'); await shot('w5/W5-64-saved');
return fin({ out });
