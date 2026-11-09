// NDC-2294 item 9: blueprint after-actions Convert / Tags / Create record / Function, run on a QA lead (lead_source chat → web). Blueprint deactivated after.
const out = {}; const G = 'QA RT 2294 '; const CA = 'eb47bade-d582-4fb7-b110-909637eca279';
const after = [{ kind: 'createRecord', targetModuleKey: 'tasks', fields: { subject: 'QA RT 2294 bp task' } }];
const fr = arr((await api('o', 'GET', `/modules/${T.LEADS}/fields`)).j?.data).find(x => x.apiName === 'rating'); const RV = fr?.config?.allowed_values || []; out.ratingValues = RV;
const body = X.blueprint('leads', T.LEADS_STD, null, 'rating', G + 'item9 createRecord', X.bpCrit('first_name', G + 'BP'), RV.slice(0, 2), after);
const bp = await api('o', 'POST', `/modules/${T.LEADS}/blueprints`, body);
out.create = bp.s + ' ' + (bp.j?.data?.id || bp.t.slice(0, 600)); const id = bp.j?.data?.id; if (!id) return out;
ledger(`blueprint ${id} "${G}item9 after-actions" on Leads`);
out.stored = JSON.stringify((await api('o', 'GET', `/modules/${T.LEADS}/blueprints/${id}`)).j?.data?.definition?.transitions?.[0]?.after?.actions);
const cur = (await api('o', 'GET', `/modules/${T.LEADS}/blueprints/${id}`)).j?.data;
const act = await api('o', 'PUT', `/modules/${T.LEADS}/blueprints/${id}`, { isActive: true, definition: cur.definition }); out.activate = act.s + ' ' + (act.s > 299 ? act.t.slice(0, 400) : '');
try {
  if (act.s < 300) {
    const l = (await X.lead('o', G + 'BP lead', { rating: RV[0] })).j?.data?.id; out.lead = l; await sleep(8000);
    const st = await X.bpState('o', T.LEADS, l); out.state = JSON.stringify({ states: (st?.states || []).map(s => s.blueprintName + ':' + JSON.stringify(s.activeStates)), tr: (st?.transitions || []).map(t => t.id + ' ' + t.name) });
    const tr = (st?.transitions || []).map(t => ({ id: t.id || t.transitionId, name: t.name || t.transitionName })).find(t => /^QA /.test(t.name));
    if (tr) {
      const r = await api('o', 'POST', `/modules/${T.LEADS}/records/${l}/blueprint-transitions/${tr.id}`, {}); out.transition = r.s + ' ' + r.t.slice(0, 300); await sleep(20000);
      const rec = (await api('o', 'GET', `/modules/${T.LEADS}/records/${l}`)).j?.data;
      out.after = { rating: (rec?.data || []).find(d => d.field === 'rating')?.value?.value, tags: JSON.stringify((rec?.data || []).find(d => /tag/i.test(d.field))?.value ?? rec?.tags ?? null), converted: JSON.stringify((rec?.data || []).filter(d => /convert/i.test(d.field)).map(d => d.field + '=' + JSON.stringify(d.value?.value ?? d.value))) };
      const tasks = arr((await api('o', 'GET', `/modules/${T.TASKS}/records?page=1`)).j?.data).filter(x => JSON.stringify(x.data).includes('QA RT 2294 bp task')); out.task = tasks.map(t => t.id);
      tasks.forEach(t => ledger(`task ${t.id} "QA RT 2294 bp task" (blueprint after-action)`));
      out.timeline = arr((await api('o', 'GET', `/timeline/records/leads/${l}/feed`)).j?.data).map(e => e.entry_type + ' ' + String(e.payload_json || '').slice(0, 150));
      out.exec = (await X.executions(l)).map(e => e.outcome + ' ' + JSON.stringify((e.dispatches || []).map(d => d.actionType + ':' + d.status)));
    }
  }
} finally { const c2 = (await api('o', 'GET', `/modules/${T.LEADS}/blueprints/${id}`)).j?.data; out.deactivate = (await api('o', 'PUT', `/modules/${T.LEADS}/blueprints/${id}`, { isActive: false, definition: c2.definition })).s; }
return out;
