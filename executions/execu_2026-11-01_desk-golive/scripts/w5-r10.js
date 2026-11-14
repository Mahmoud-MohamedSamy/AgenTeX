await openBuilder();
await pickF('Edit row groups', 'Status'); await pickF('Edit aggregate columns', 'Record count');
let n0 = NET.length; await page.getByRole('button', { name: /^Run$/ }).click(); await sleep(6000);
const q = NET.slice(n0).filter(x => /reporting\/query/.test(x.u)).pop(); out.runStatus = q && q.s;
out.preview = (await mtxt()).replace(/.*Run Preview/, '').slice(0, 500);
n0 = NET.length; await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(6000);
out.saveDlg = (await dtxt()).slice(0, 300);
const sb = page.locator('[role=dialog]').last().getByRole('button', { name: /^Save$/ }); if (await sb.count()) { await sb.click(); await sleep(6000); }
out.saveNet = NET.slice(n0).filter(x => /report/i.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 160));
const m = out.saveNet.join(' ').match(/"id":"([0-9a-f-]{36})"/); if (m) { CREATED.push({ kind: 'report', id: m[1], name: 'QA GL W5 report' }); out.rid = m[1]; }
out.url = page.url().replace(H, ''); out.after = (await mtxt()).slice(0, 600);
await shot('w5/W5-26-saved');
return fin({ out: out });
