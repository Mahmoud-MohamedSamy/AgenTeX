const CID = 'a7a7a7a7000000000000000000000004.e13196a27ca34ba9b1d5a8d802bad45d';
await page.keyboard.press('Escape'); await sleep(500);
const res = {};
const l = await call('GET', '/iam/integrations/clients'); const items = (l.j.data.items || l.j.data); const c = items.find(x => x.client_id === CID);
res.client = JSON.stringify(c).replace(/"client_secret[^,]*,/g, '').slice(0, 900);
const mc = await call('GET', `/integrations/${encodeURIComponent(CID)}/module-config`); res.moduleConfig = mc.s + ' ' + mc.t.slice(0, 600);
const recs = await call('GET', '/modules/b4848bdf-9f59-45a9-8336-9f4f2a4fc36b/records/ec732e9b-71e8-4dc8-8a25-d8c1ee3b9c2d'); res.ruleBreakRecord = JSON.stringify((recs.j.data.data || []).filter(x => /qa_num|name/.test(x.field)));
return res;
