// NDC-2294 follow-up: custom-action results (items 4, 8), lead_source values + blueprint (9), review functions on the 2nd layout (6), else stored (12).
const out = {}; const G = 'QA RT 2294 '; const CA = 'eb47bade-d582-4fb7-b110-909637eca279';
const ex = async id => (await X.executions(id)).map(e => ({ kind: e.triggerKind, src: e.source || e.processKind || e.ruleId?.slice(0, 8), outcome: e.outcome, d: (e.dispatches || []).map(d => d.actionType + ':' + d.status + ' ' + String(d.responseStatus ?? '') + ' ' + String(d.responseBodyTruncated || d.errorMessage || '').slice(0, 200)) }));
out['4 executions'] = await ex('7aee5dce-abf3-494c-bb41-0bc228170231');
out['8 executions'] = await ex('a95b04c3-a398-41a0-a861-6fdba7bd744d');
const fl = await api('o', 'GET', `/modules/${T.LEADS}/fields`); const f = arr(fl.j?.data).find(x => (x.apiName || x.api_name || x.key) === 'lead_source');
out['9 field'] = fl.s + ' ' + JSON.stringify(f ? { type: f.datatypeKey || f.dataType, opts: (f.options || f.pickListValues || f.config?.options || f.properties?.options || []).slice(0, 4) } : Object.keys(arr(fl.j?.data)[0] || {})).slice(0, 500);
const vals = (f?.options || f?.pickListValues || f?.config?.options || f?.properties?.options || []).map(o => o.value ?? o.apiValue ?? o.key ?? o.label ?? o).map(String);
if (vals.length >= 2) {
  const after = [{ kind: 'convertLead' }, { kind: 'addTags', tags: ['QA RT 2294'] }, { kind: 'createRecord', targetModuleId: T.TASKS, fieldValues: { subject: 'QA RT 2294 bp task' } }, { kind: 'customAction', customActionId: CA, inputs: {} }];
  const bp = await api('o', 'POST', `/modules/${T.LEADS}/blueprints`, X.blueprint('leads', T.LEADS_STD, null, 'lead_source', G + 'item9 after-actions', X.bpCrit('first_name', G + 'BP'), vals.slice(0, 2), after));
  out['9 create'] = bp.s + ' ' + (bp.j?.data?.id || bp.t.slice(0, 500));
  if (bp.j?.data?.id) { ledger(`blueprint ${bp.j.data.id} "${G}item9 after-actions" (inactive)`); out['9 stored'] = JSON.stringify((await api('o', 'GET', `/modules/${T.LEADS}/blueprints/${bp.j.data.id}`)).j?.data?.definition?.transitions?.[0]?.after?.actions); }
}
const rp = X.review(T.LEADS, 'b3ab6751-e26a-4641-9dbc-f8737f26c908', G + 'item6 review fns', X.startsWith('first_name', G + 'REV'), ['manual'], { email: 'email' }, [T.OWNER]);
rp.eventFunctions = ['submitted', 'approved', 'rejected', 'resubmitted'].map(e => ({ event: e, customActionId: CA, inputs: {} }));
const r6 = await X.made('o', '/workflow/review-processes', rp, 'review process'); out['6 create'] = r6.s + ' ' + (r6.j?.data?.id || r6.t.slice(0, 300));
if (r6.j?.data?.id) out['6 stored'] = JSON.stringify(((await api('o', 'GET', '/workflow/review-processes/' + r6.j.data.id)).j?.data?.eventFunctions || []).map(x => x.event + ':' + (x.customActionId === CA)));
const rules = arr((await api('o', 'GET', '/workflow/rules?take=200')).j?.data).filter(x => /^QA RT 2294 item12 with else/.test(x.name));
if (rules[0]) out['12 else stored'] = JSON.stringify(((await api('o', 'GET', '/workflow/rules/' + rules[0].id)).j?.data?.conditions || []).map(c => ({ isElse: c.isElse, crit: c.criteria?.stringValue ?? null, n: c.actions?.length })));
return out;
