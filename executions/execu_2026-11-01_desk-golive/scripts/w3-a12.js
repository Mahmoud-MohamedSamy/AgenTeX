const KD = 'b4cd6764-7e07-4a8c-ac6b-7a6e25093963', PU = 'cf48ae47-db59-48c3-b787-3c48bd20ea75';
out.kd = await get(KM, KD); await go('/modules/' + KM + '/records/' + KD, 9000); out.kdPage = ((await page.locator('#main-content').innerText()).match(/Support Plan Info[\s\S]{0,250}/) || [''])[0].replace(/\s+/g, ' '); await shot('w3/W3-08-api-contract-discontinued-plan');
const d = n => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
const mkT = async (subj, con, email) => { const t = await api('POST', '/modules/' + TM + '/records', { data: [{ field: 'subject', value: sv(subj) }, { field: 'description', value: sv('QAGLW3SLA ' + subj) }, { field: 'department', value: sv(MK) }, { field: 'contact_id', value: sv(con) }, { field: 'email', value: sv(email) }, { field: 'status', value: sv('Open') }] }); const id = t.j?.data?.id; if (id) CREATED.push({ kind: 'ticket', id, name: subj }); return id; };
for (const [k, s, e] of [['exp', d(-60), d(-1)], ['fut', d(18), d(200)]]) {
  const a = await mk(AM, 'account', 'QA GL W3 Account ' + k, { account_name: 'QA GL W3 Account ' + k });
  const c = await mk(CM, 'contact', 'QA GL W3 Contact ' + k, { first_name: 'QA GL W3', last_name: 'Contact ' + k, email: 'qa-gl-w3-' + k + '@example.com', account_id: a.id });
  const kk = await mk(KM, 'contract', 'QA GL W3 Contract ' + k, { contract_name: 'QA GL W3 Contract ' + k, account_id: a.id, start_date: s, end_date: e, support_plan: PU, department: MK });
  await sleep(1500); const kr = await get(KM, kk.id); const tid = await mkT('QA GL W3 ' + k + ' contract ticket', c.id, 'qa-gl-w3-' + k + '@example.com'); await sleep(8000);
  const sla = D((await api('GET', '/desk/tickets/' + tid + '/sla')).j); out[k] = { contract: kk.s + ' status=' + kr.status + ' ' + s + '..' + e, slaState: sla?.state, policy: sla?.policy?.name, coverage: JSON.stringify(sla?.coverage).slice(0, 300), note: sla?.note, tid };
  await go('/views/all/tickets/' + tid, 11000); out[k].page = ((await page.locator('#main-content').innerText()).replace(/\s+/g, ' ').match(/SLA .{0,300}/) || [''])[0]; await shot('w3/W3-10-' + k + '-ticket'); }
return fin({ out });
