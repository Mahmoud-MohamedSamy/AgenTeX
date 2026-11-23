// Batch 2c: TR-09 merge, RM-04 rule edited, API-04 comment, CF-11 values.
const out = {}; const R = {}; const TK = {};
const mark = FU({ qa_ndc_agency_code: 'WF' });
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; return t.id; };
const h = await hook();
R.TRM = (await mkRule('TRM', { kind: 'RecordDeleted' }, [WH(h, '{"ev":"delete","s":"${subject}"}')])).id;
R.RM04 = (await mkRule('RM04y', { kind: 'RecordUpdated' }, [mark], { mode: 'OneTime' })).id;
R.API04 = (await mkRule('API04y', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', commentBody: "<b>bold</b> <script>alert('x')</script> <img src=x onerror=alert(1)> ${subject} ${nonexistent_zz} '; DROP TABLE tickets;--", commentPublic: false }])).id;
R.CF11 = (await mkRule('CF11y', { kind: 'RecordCreated' }, [mark], { criteria: ex('sla_name', 'IsNull') })).id;
await tk('m1', 'TRM', {}, 'master'); await tk('m2', 'TRM', {}, 'child'); await tk('RM04', 'RM04y'); await tk('API04', 'API04y'); await tk('CF11', 'CF11y');
await sleep(10000);
const mg = await api('POST', '/desk/tickets/merge', { master_ticket_id: TK.m1, source_ticket_ids: [TK.m2] }); out.merge = mg.s + ' ' + mg.t.slice(0, 200);
await patchTicket(TK.RM04, { classification: 'problem' }); await sleep(8000);
const g = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === R.RM04);
const pa = await api('PATCH', '/workflow/rules/' + R.RM04, { moduleId: T, name: g.name, description: 'edited', isActive: true, mode: g.mode, trigger: g.trigger, criteria: g.criteria, actions: g.actions.map(a => ({ ...a, id: undefined })), departmentIds: g.departmentIds, version: g.version });
out.rm04patch = pa.s + (pa.s >= 300 ? ' ' + pa.t.slice(0, 200) : '');
await patchTicket(TK.RM04, { classification: 'question' }); await sleep(12000);
const c = await getTicket(TK.CF11);
await sleep(20000);
out.v = {
  merge: { hooks: (await hookReqs(h)).map(x => x.content), child: (await getTicket(TK.m2)), runsChild: (await execs(TK.m2, R.TRM)).map(outcome) },
  RM04: { runs: (await execs(TK.RM04, R.RM04)).map(outcome) },
  API04: (await api('GET', `/desk/tickets/${TK.API04}/comments`)).t.slice(0, 600), API04run: (await execs(TK.API04, R.API04)).map(e => outcome(e) + ' ' + (e.dispatches || []).map(d => d.status).join(',')),
  CF11: { sla_name: c.sla_name, sla_violated: c.sla_violated, sla_escalated: c.sla_escalated, response_due: c.response_due, fired: await fired(TK.CF11, R.CF11) },
};
out.v.merge.child = { status: out.v.merge.child.status, s: out.v.merge.child._s, merged: out.v.merge.child.is_merged };
fs.writeFileSync(RUN + '/out/b2c.json', JSON.stringify(out, null, 1));
return out;
