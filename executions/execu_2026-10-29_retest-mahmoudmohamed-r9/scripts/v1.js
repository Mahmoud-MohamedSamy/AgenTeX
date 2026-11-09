// NDC-2627: Timeline wording on a lead (QA RT r8 control 1, created by test user 1 today) and on a deal (Transactions).
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
await go(`/modules/${L}/records/3b0b6ece-2f8c-4446-b13f-65df18bdd78d`, 20000);
const tl = page.getByText(/^Timeline$/).first(); if (await tl.count()) { await tl.click(); await sleep(8000); }
await shot('v1-lead-timeline');
out.lead = (await txt()).split('\n').filter(l => /created|Created/.test(l)).slice(0, 8);
const feed = await api('GET', `/timeline/records/leads/3b0b6ece-2f8c-4446-b13f-65df18bdd78d/feed`); out.feedFirst = JSON.stringify(arr(feed.j?.data).slice(-1)[0] || '').slice(0, 300);
return done(out);
