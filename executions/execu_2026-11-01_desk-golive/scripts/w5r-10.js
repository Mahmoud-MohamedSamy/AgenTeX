const ACC = 'cc6244cd-863f-4e23-8e2e-1f528dd72787', CON = '4b90180b-cd0d-44e5-914b-9c9fe2c85f45';
out.url = page.url().replace(H, '');
const ks = arr(D((await api('GET', '/modules/' + KM + '/records?limit=20&q=' + encodeURIComponent('QA GL W5R'))).j)).map(flat); out.k = ks.map(k => ({ id: k.id, name: k.contract_name || k.name, plan: k.support_plan, acc: k.account || k.account_id, dep: k.department }));
for (const k of ks) CREATED.push({ kind: 'contract', id: k.id, name: 'QA GL W5R Contract' });
const t = await api('POST', '/modules/' + TM + '/records', { data: [{ field: 'subject', value: sv('QA GL W5R contract ticket') }, { field: 'description', value: sv('QAGLW5RSLA contract ticket') }, { field: 'department', value: sv(MK) }, { field: 'contact_id', value: sv(CON) }, { field: 'email', value: sv('qa-gl-w5r-c1@example.com') }, { field: 'status', value: sv('Open') }] });
const tid = D(t.j) && D(t.j).id; out.ticket = t.s; if (tid) CREATED.push({ kind: 'ticket', id: tid, name: 'QA GL W5R contract ticket' });
await sleep(6000);
if (tid) { const r = flat(D((await api('GET', '/modules/' + TM + '/records/' + tid)).j) || {}); out.tFields = Object.fromEntries(Object.entries(r).filter(([k]) => /contract|plan|sla|account/i.test(k)).map(([k, v]) => [k, String(v).slice(0, 60)]));
  await go('/views/all/tickets/' + tid, 12000); out.tPage = ((await mtxt()).match(/.{0,80}(Contract|Support Plan|SLA).{0,120}/g) || []).slice(0, 5); await shot('w5r/W5-16-ticket'); }
await go('/modules/' + AM + '/customers/' + ACC, 10000); const tb = page.locator('main').getByText('SLA & Contract', { exact: true }).first(); if (await tb.count()) { await tb.click(); await sleep(4000); } out.accPage = ((await mtxt()).match(/.{0,60}(QA GL W5R Contract|QA GL W5R Plan|No support plan|No contract).{0,100}/g) || []).slice(0, 5); await shot('w5r/W5-16-account');
return fin({ out });
