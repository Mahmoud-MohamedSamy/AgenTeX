// OB test rule, SA saved actions, MR chains/loops/order, API security.
const mark = v => FU({ qa_ndc_company_name: v }); const out = {};
// ---------- OB Test rule
const rT = await mkRule('OBtest', { kind: 'RecordCreated' }, [mark('T')], { criteria: cmp('priority', 'Equal', S('high')), active: false });
const tT = await mkTicket('OBtest', { priority: 'high' });
const e0 = await api('POST', `/workflow/rules/${rT.id}/execute`, {});
const e1 = await api('POST', `/workflow/rules/${rT.id}/execute`, { recordId: tT.id });
const e2 = await api('POST', `/workflow/rules/${rT.id}/execute`, { recordId: tT.id, fieldValues: { priority: S('low') } });
const ev = await api('POST', '/workflow/rules/evaluate', { rule: rT.body, recordId: tT.id });
await sleep(8000);
out.OB = { emptyBody: e0.s + ' ' + e0.t.slice(0, 250), withRecord: e1.s + ' ' + e1.t.slice(0, 400), withValuesLow: e2.s + ' ' + e2.t.slice(0, 300), evaluate: ev.s + ' ' + ev.t.slice(0, 300), ticketUnchanged: (await getTicket(tT.id)).qa_ndc_company_name || 'unchanged' };
// ---------- SA saved actions
const sa = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA WF saved FU', description: 'x', isActive: true, action: { type: 'FieldUpdate', order: 0, fieldUpdates: { qa_ndc_company_name: S('SAVED1') } } });
const saId = sa.j?.data?.id; if (saId) ledger('saved action QA WF saved FU ' + saId);
const saDup = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA WF saved FU', description: 'x', isActive: true, action: { type: 'FieldUpdate', order: 0, fieldUpdates: { qa_ndc_company_name: S('SAVED1') } } });
const saDupId = saDup.j?.data?.id; if (saDupId) await api('DELETE', '/workflow/actions/' + saDupId);
const ruse1 = await mkRule('SAuse1', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', standaloneActionId: saId }]);
const ruse2 = await mkRule('SAuse2', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', standaloneActionId: saId }]);
const us = await api('GET', `/workflow/actions/${saId}/usage`);
const ta1 = await mkTicket('SAuse1'); await sleep(20000); const v1 = (await getTicket(ta1.id)).qa_ndc_company_name;
const sav = (await api('GET', '/workflow/actions/' + saId)).j?.data;
const pa = await api('PATCH', '/workflow/actions/' + saId, { name: sav.name, description: sav.description, isActive: true, moduleId: T, action: { ...sav.action, fieldUpdates: { qa_ndc_company_name: S('SAVED2') } } });
const ta2 = await mkTicket('SAuse2'); await sleep(20000); const v2 = (await getTicket(ta2.id)).qa_ndc_company_name;
const de = await api('PATCH', '/workflow/actions/' + saId, { name: sav.name, description: sav.description, isActive: false, moduleId: T, action: { ...sav.action, fieldUpdates: { qa_ndc_company_name: S('SAVED2') } } });
const ta3 = await mkTicket('SAuse1', {}, 'inactive'); await sleep(20000); const v3 = (await getTicket(ta3.id)).qa_ndc_company_name;
const dl = await api('DELETE', '/workflow/actions/' + saId);
out.SA = { create: sa.s, dupName: saDup.s + ' ' + (errOf(saDup) || 'accepted'), usage: us.s + ' ' + us.t.slice(0, 200), run1: v1, patch: pa.s + ' ' + (errOf(pa) || ''), run2afterEdit: v2, deactivate: de.s, run3inactive: v3 || null, dispatch3: (await execs(ta3.id, ruse1.id)).flatMap(e => (e.dispatches || []).map(x => x.status + ' ' + (x.lastError || ''))), deleteInUse: dl.s + ' ' + dl.t.slice(0, 200) };
// ---------- MR chains / loops / order
const rA = await mkRule('MRa', { kind: 'RecordCreated' }, [FU({ priority: 'urgent' })]);
const rB = await mkRule('MRa', { kind: 'SpecificFieldChanged', fieldName: 'priority', fieldNames: ['priority'], fieldMatch: 'any', alsoOnCreate: false }, [mark('CHAIN')], { extra: { name: 'QA WF MRa B' } });
const rLoop = await mkRule('MRloop', { kind: 'RecordUpdated' }, [FU({ qa_ndc_agent_id: I(1) }), mark('LOOP')]);
const rO1 = await mkRule('MRord', { kind: 'RecordCreated' }, [FU({ qa_ndc_agency_code: 'FIRST' })]);
const rO2 = await mkRule('MRord', { kind: 'RecordCreated' }, [FU({ qa_ndc_agency_code: 'SECOND' })], { extra: { name: 'QA WF MRord 2' } });
const tA = await mkTicket('MRa'); const tL = await mkTicket('MRloop'); const tO = await mkTicket('MRord');
await sleep(10000); await patchTicket(tL.id, { classification: 'others' });
await sleep(40000);
out.MR = { chain: { priority: (await getTicket(tA.id)).priority, ruleA: await fired(tA.id, rA.id), ruleB_fieldChanged: rB.id ? await fired(tA.id, rB.id) : rB.err, mark: (await getTicket(tA.id)).qa_ndc_company_name || null },
  loop: { runs: await fired(tL.id, rLoop.id) },
  order: { value: (await getTicket(tO.id)).qa_ndc_agency_code, r1: await fired(tO.id, rO1.id), r2: rO2.id ? await fired(tO.id, rO2.id) : rO2.err } };
// reorder: put rO2 before rO1 then new ticket
const ordered = arr((await api('GET', '/workflow/rules?moduleId=' + T + '&take=300')).j.data).sort((a, b) => a.position - b.position).map(r => r.id);
const pos = { r1: ordered.indexOf(rO1.id), r2: ordered.indexOf(rO2.id) };
const re = ordered.filter(id => id !== rO2.id); re.splice(re.indexOf(rO1.id), 0, rO2.id);
const ro = await api('PUT', '/workflow/rules/reorder', { moduleId: T, orderedRuleIds: re });
const tO2 = await mkTicket('MRord', {}, 'after'); await sleep(25000);
out.MR.reorder = { before: pos, put: ro.s + ' ' + (errOf(ro) || ''), valueAfter: (await getTicket(tO2.id)).qa_ndc_agency_code };
// ---------- API security
const x = await mkRule('API<script>alert(1)</script>', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', commentBody: '<img src=x onerror=alert(1)> ${subject}', commentPublic: false }], { active: false });
const xr = x.id ? arr((await api('GET', '/workflow/rules?moduleId=' + T + '&take=300')).j.data).find(r => r.id === x.id) : null;
const ssrf = {};
for (const u of ['http://169.254.169.254/latest/meta-data/', 'http://localhost:8080/', 'http://10.0.0.1/', 'http://127.0.0.1/', 'file:///etc/passwd']) { const r = await mkRule('APIssrf' + Object.keys(ssrf).length, { kind: 'RecordCreated' }, [{ type: 'Webhook', url: u, method: 'POST', bodyTemplate: '{}', timeoutSeconds: 5 }], { active: false }); ssrf[u] = r.s + ' ' + (r.err || '').slice(0, 120); if (r.id) await api('DELETE', '/workflow/rules/' + r.id); }
const other = await api('GET', '/workflow/rules/00000000-0000-0000-0000-0000000000aa'); const otherP = await api('PATCH', '/workflow/rules/00000000-0000-0000-0000-0000000000aa', { name: 'x' });
out.API = { xssName: x.s + ' stored=' + (xr ? JSON.stringify(xr.name) : '-'), ssrf, unknownId: other.s + '/' + otherP.s };
if (x.id) await api('DELETE', '/workflow/rules/' + x.id);
fs.writeFileSync(RUN + '/out/ob.json', JSON.stringify(out, null, 1));
return out;
