const PLAN = 'bc1e5c23-8fcf-4e5d-b09b-a7b0ea630b8e', PD = '19510fdc-91f3-4a7a-8888-153f1318b765';
out.acc = await mk(AM, 'account', 'QA GL W5 Ev Account', { account_name: 'QA GL W5 Ev Account' });
if (out.acc.id) {
  out.k = await mk(KM, 'contract', 'QA GL W5 Contract bad dates', { contract_name: 'QA GL W5 Contract bad dates', account_id: out.acc.id, start_date: '2026-12-01', end_date: '2026-11-01', support_plan: PLAN, department: PD });
  if (out.k.id) { const r = await get(KM, out.k.id); out.kDates = [r.start_date, r.end_date, r.status];
    await go('/modules/' + KM + '/records/' + out.k.id, 9000); await sleep(4000); out.page = (await mtxt()).slice(0, 600); await shot('w5/W5-17-contract');
    await go('/modules/' + KM, 9000); await sleep(3000); out.list = (await mtxt()).match(/.{0,100}bad dates.{0,200}/)?.[0]; await shot('w5/W5-17-list'); }
}
return fin({ out });
