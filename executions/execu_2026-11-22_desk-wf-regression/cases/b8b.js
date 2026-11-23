const out = {}; const R = {}; const TK = {};
const OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7', TEAM = 'fa641d99-ce7f-47ca-94e7-b15113bd4913';
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 160) + ')' : '')).join(','));
const tl = (await api('GET', '/desk/email-templates')).j?.data?.email_templates || [];
const agentT = tl.find(t => t.notification_type === 'agent' && t.module === 'desk_tickets'), teamT = tl.find(t => t.notification_type === 'team' && t.module === 'desk_tickets') || agentT, contT = tl.find(t => t.notification_type === 'contact' && t.module === 'desk_tickets');
out.tpls = { agent: agentT?.name, team: teamT?.name, contact: contT?.name };
const E = (tpl, rec) => ({ type: 'Email', emailTemplateId: tpl.id, emailSubject: tpl.subject || 'QA WF', emailBody: tpl.body_html || 'QA WF', emailRecipients: rec });
const mk = async (k, a) => { const r = await mkRule(k, { kind: 'RecordCreated' }, [a]); R[k] = r.id; out[k + ' save'] = r.s + ' ' + (r.err || ''); };
await mk('AC15teamT', E(teamT, [{ kind: 'Team', value: TEAM }]));
await mk('AC15contT', E(contT, [{ kind: 'Contact', value: 'contact_id' }]));
await mk('AC16agentToContact', E(agentT, [{ kind: 'Contact', value: 'contact_id' }]));
await mk('AC15agentT', E(agentT, [{ kind: 'User', value: OWN }]));
// macro
const mc = await api('POST', '/desk/macros', { name: 'QA WF IN04 macro', department_id: DEPT2, is_active: true, actions: [{ kind: 'set_field', field_key: 'classification', value: 'Problem' }], usable_by: [] });
const MAC = mc.j?.data?.id || mc.j?.data?.macro?.id; out.macro = mc.s + ' ' + (MAC || mc.t.slice(0, 300)); if (MAC) ledger(`macro "QA WF IN04 macro" ${MAC}`);
R.IN04 = (await mkRule('IN04x', { kind: 'RecordUpdated' }, [FU({ qa_ndc_company_name: 'MACRO-EDIT' })], { criteria: changed('classification') })).id;
await sleep(2000);
for (const k of ['AC15teamT', 'AC15contT', 'AC16agentToContact', 'AC15agentT']) if (R[k]) await tk(k, k);
await tk('IN04', 'IN04x');
await sleep(8000);
if (MAC) out.apply = (await api('POST', '/desk/tickets/bulk/macro', { ticket_ids: [TK.IN04], macro_id: MAC })).t.slice(0, 250);
// PS-09 bin with longer wait + any app key
const pr = await mkRule('PS09y', { kind: 'RecordCreated' }, [FU({ qa_ndc_agency_code: 'x' })]); out.ps09 = { del: (await api('DELETE', '/workflow/rules/' + pr.id)).s };
let bi = null; for (let i = 0; i < 8 && !bi; i++) { await sleep(5000); const items = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data); bi = items.find(x => x.record_id === pr.id) || items.find(x => /QA WF PS09y/.test(x.record_label || '')); }
out.ps09.inBin = bi ? (bi.record_label + ' / ' + bi.module_label) : false;
if (bi) { out.ps09.restore = (await api('POST', '/audit/recycle-bin/restore', { ids: [bi.id] })).s; await sleep(6000); const back = (await allRules()).find(x => x.id === pr.id || x.name === 'QA WF PS09y'); out.ps09.after = back ? { name: back.name, active: back.isActive } : 'not back'; if (back) { await api('DELETE', '/workflow/rules/' + back.id); await sleep(6000); const b2 = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).find(x => /QA WF PS09y/.test(x.record_label || '')); out.ps09.purge = b2 ? (await api('POST', '/audit/recycle-bin/delete', { ids: [b2.id] })).s : 'not in bin 2'; } }
await sleep(25000);
for (const k of ['AC15teamT', 'AC15contT', 'AC16agentToContact', 'AC15agentT']) if (TK[k]) out[k] = await disp(k, k);
if (MAC) { const g = await getTicket(TK.IN04); out.IN04 = { cls: g.classification, company: g.qa_ndc_company_name, run: await disp('IN04', 'IN04') }; }
return out;
