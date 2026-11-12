const K = 'd41bdb40-e6ef-4d63-8f09-8190528242c0';
const g = await get(KM, K); out.rec = { support_plan: g.support_plan, support_plan_name: g.support_plan_name, sla_name: g.sla_name, department: g.department };
await go('/modules/' + KM + '/records/' + K, 9000); out.page = (await mtxt()).slice(0, 600); await shot('w5/W5-16-contract-record');
// create via UI form to compare
await go('/modules/' + KM + '/records/new', 9000); out.form = (await mtxt()).slice(0, 700); await shot('w5/W5-16-contract-form');
return fin({ out });
