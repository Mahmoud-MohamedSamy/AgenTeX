const d = page.locator('[role=dialog]').last();
await d.getByRole('textbox', { name: 'Module name (plural)' }).fill('QA GL W5 Modules'); await d.getByRole('textbox', { name: 'Module name (singular)' }).fill('QA GL W5 Module'); await sleep(500);
let n0 = NET.length; await d.getByRole('button', { name: /^Create$/ }).click(); await sleep(6000);
out.create = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 200));
const m = out.create.join(' ').match(/"id":"([0-9a-f-]{36})"/); out.mid = m && m[1]; if (out.mid) CREATED.push({ kind: 'module', id: out.mid, name: 'QA GL W5 Module' });
out.url = page.url().replace(H, ''); await shot('w5/W5-51-created');
if (out.mid) { const fl = await api('GET', '/modules/' + out.mid + '/fields'); const fs = arr(D(fl.j)); out.fields = fs.map(f => f.apiName + (f.isRequired || f.required ? '*' : '')).slice(0, 20);
  const nameF = (fs.find(f => /name/i.test(f.apiName)) || {}).apiName || 'name';
  const r = await mk(out.mid, 'qa-module-record', 'QA GL W5 Module rec 1', { [nameF]: 'QA GL W5 Module rec 1' }); out.rec = r;
  await go('/modules/' + out.mid, 10000); out.list = (await mtxt()).slice(0, 300); await shot('w5/W5-51-records'); }
return fin({ out });
