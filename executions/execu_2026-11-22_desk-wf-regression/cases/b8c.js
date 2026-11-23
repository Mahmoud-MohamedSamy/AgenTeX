const out = {};
const mc = await api('POST', '/desk/macros', { name: 'QA WF IN04 macro', department_id: DEPT2, is_active: true, actions: [{ kind: 'set_field', field_key: 'classification', value: 'problem' }], usable_by: [] });
const MAC = mc.j?.data?.id || mc.j?.data?.macro?.id; out.macro = mc.s + ' ' + (MAC || mc.t.slice(0, 300)); if (MAC) ledger(`macro "QA WF IN04 macro" ${MAC}`);
const tid = (fs.readFileSync(RUN + '/ledger.md', 'utf8').match(/ticket "QA WF IN04x ticket" ([0-9a-f-]{36})/g) || []).pop()?.match(/([0-9a-f-]{36})/)[1];
const rid = (fs.readFileSync(RUN + '/ledger.md', 'utf8').match(/rule "QA WF IN04x" ([0-9a-f-]{36})/) || [])[1];
if (MAC) out.apply = (await api('POST', '/desk/tickets/bulk/macro', { ticket_ids: [tid], macro_id: MAC })).t.slice(0, 250);
await sleep(20000);
const g = await getTicket(tid); out.IN04 = { cls: g.classification, company: g.qa_ndc_company_name, runs: (await execs(tid, rid)).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.status).join(',')) };
return out;
