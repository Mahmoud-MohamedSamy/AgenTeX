const ACC = '03e7893b-dc27-4a01-be0e-ac2f955a3b8d', CON = '01402bf2-8d93-4924-bf77-13dab577ea57', K = 'c5a8482a-0bce-4fb0-94b5-ee7b939e72ac';
const mkT = async (subj, desc) => { const t = await api('POST', '/modules/' + TM + '/records', { data: [{ field: 'subject', value: sv(subj) }, { field: 'description', value: sv(desc) }, { field: 'department', value: sv(MK) }, { field: 'contact_id', value: sv(CON) }, { field: 'email', value: sv('qa-gl-w3-c1@example.com') }, { field: 'status', value: sv('Open') }] }); const id = t.j?.data?.id; if (id) CREATED.push({ kind: 'ticket', id, name: subj }); return { s: t.s, id, err: t.s >= 300 ? t.t.slice(0, 200) : '' }; };
out.t1 = await mkT('QA GL W3 plan ticket 1', 'QAGLW3SLA entitlement check');
out.t2 = await mkT('QA GL W3 plan ticket 2', 'no keyword, plan should still give its SLA');
await sleep(8000);
for (const k of ['t1', 't2']) { const id = out[k].id; if (!id) continue; const s = await api('GET', '/desk/tickets/' + id + '/sla'); out[k].sla = JSON.stringify(D(s.j)).slice(0, 900); const r = await get(TM, id); out[k].rec = { contract: r.contract_id || r.contract || null, ticket_number: r.ticket_number, account: r.account_id }; }
const kr = await get(KM, K); out.used = Object.fromEntries(Object.entries(kr).filter(([k]) => /credit|used|remain|allow/i.test(k)));
await go('/views/all/tickets/' + out.t1.id, 10000); out.t1page = ((await mtxt()).match(/.{0,120}(SLA|Contract|Support Plan|Due).{0,200}/gi) || []).slice(0, 4); await shot('w3/W3-06-ticket1');
await go('/modules/' + KM + '/records/' + K, 9000); out.kpage = ((await page.locator('main').innerText()).match(/Support Plan Info[\s\S]{0,200}/) || [''])[0].replace(/\s+/g, ' '); await shot('w3/W3-06-contract-credits');
await go('/modules/' + AM + '/customers/' + ACC, 9000); const tb = page.locator('main').getByText('SLA & Contract', { exact: true }).first(); if (await tb.count()) { await tb.click(); await sleep(4000); } out.accPage = (await mtxt()).slice(0, 600); await shot('w3/W3-05-account-contract');
return fin({ out });
