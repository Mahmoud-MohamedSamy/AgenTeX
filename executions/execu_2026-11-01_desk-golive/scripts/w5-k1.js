const ACC = 'f823cd7a-1c34-4d84-9cc8-5b12509034b4';
const t = await api('POST', '/modules/' + TM + '/records', { data: [{ field: 'subject', value: sv('QA GL W5 ticket for contact 1') }, { field: 'department', value: sv(MK) }, { field: 'contact_id', value: sv(C1) }, { field: 'email', value: sv('qa-gl-w5-c1@example.com') }, { field: 'status', value: sv('Open') }] });
out.ticket = t.s + ' ' + (t.s >= 300 ? t.t.slice(0, 250) : ''); const tid = t.j && t.j.data && t.j.data.id; if (tid) { CREATED.push({ kind: 'ticket', id: tid, name: 'QA GL W5 ticket for contact 1' }); out.tid = tid; }
const deps = arr(D((await api('GET', '/desk/departments')).j)); out.deps = deps.map(d => d.id.slice(0, 8) + ' ' + d.name).join(', ');
const PLAN = 'bc1e5c23-8fcf-4e5d-b09b-a7b0ea630b8e', PD = '19510fdc-91f3-4a7a-8888-153f1318b765';
out.k = await mk(KM, 'contract', 'QA GL W5 Contract', { contract_name: 'QA GL W5 Contract', account_id: ACC, start_date: '2026-11-01', end_date: '2027-10-31', support_plan: PLAN, department: PD, status: 'active' });
out.kBad = await mk(KM, 'contract', 'QA GL W5 Contract bad dates', { contract_name: 'QA GL W5 Contract bad dates', account_id: ACC, start_date: '2026-12-01', end_date: '2026-11-01', support_plan: PLAN, department: PD });
out.kOld = await mk(KM, 'contract', 'QA GL W5 Contract expired', { contract_name: 'QA GL W5 Contract expired', account_id: ACC, start_date: '2025-01-01', end_date: '2025-12-31', support_plan: PLAN, department: PD });
if (out.kOld.id) { await sleep(2000); out.kOldStatus = (await get(KM, out.kOld.id)).status; }
if (out.k.id) { out.kStatus = (await get(KM, out.k.id)).status; }
await go('/modules/' + AM + '/customers/' + ACC, 9000);
const tb = page.locator('main').getByText('SLA & Contract', { exact: true }).first(); if (await tb.count()) { await tb.click(); await sleep(4000); out.accK = (await mtxt()).slice(0, 500); await shot('w5/W5-16-account-contract'); }
if (tid) { await go('/views/all/tickets/' + tid, 9000); await sleep(4000); out.tPage = (await mtxt()).match(/.{0,80}(Contract|Support Plan|SLA).{0,120}/i)?.[0]; await shot('w5/W5-16-ticket-contract');
  await go('/modules/' + CM + '/customers/' + C1, 9000); out.c1Page = (await mtxt()).slice(0, 300); await shot('w5/W5-13-contact-360'); }
await go('/modules/' + KM, 8000); out.kList = (await mtxt()).slice(0, 400); await shot('w5/W5-15-contracts');
return fin({ out });
