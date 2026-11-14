const d = page.locator('[role=dialog]').last();
await d.getByPlaceholder('https://api.example.com').fill('https://example.com'); await sleep(500);
const desk = d.getByLabel('Desk', { exact: true }); if (await desk.count()) { out.deskChecked = await desk.isChecked(); if (!out.deskChecked) await desk.check(); }
await d.getByRole('button', { name: /^Continue$/ }).click(); await sleep(3000); out.s4 = (await dtxt()).slice(0, 800); await shot('w5/W5-64-usage');
out.btns = await d.getByRole('button').allInnerTexts();
const sv2 = d.getByRole('button', { name: /^(Save|Create|Finish|Save actions|Done|Create actions?)$/ }).last();
const n0 = NET.length; if (await sv2.count()) { await sv2.click(); await sleep(5000); }
out.net = NET.slice(n0).filter(x => !/heartbeat/.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 200));
for (const m of out.net.join(' ').matchAll(/(custom-actions|api-sources)[^ ]* 20\d \{"success":true,"data":\{"id":"([0-9a-f-]{36})"/g)) CREATED.push({ kind: m[1], id: m[2], name: 'QA GL W5 action/source' });
out.list = (await mtxt()).includes('QA GL W5 action');
return fin({ out });
