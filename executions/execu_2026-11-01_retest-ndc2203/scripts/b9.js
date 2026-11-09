const CA = '1e963fa0-0f0c-442f-97e3-4b1dd4332288'; const out = {};
for (const [m, p, b] of [['POST', `/workflow/custom-actions/${CA}/activate`, {}], ['POST', `/workflow/custom-actions/${CA}/publish`, {}], ['PATCH', `/workflow/custom-actions/${CA}`, { status: 'active' }]]) { const r = await api(m, p, b); out[m + ' ' + p.split('/').pop()] = r.s + ' ' + r.t.slice(0, 160); if (r.s < 300) break; }
const g = (await api('GET', `/workflow/custom-actions/${CA}`)).j?.data; out.status = g?.status;
if (g?.status === 'active') { out.rule = await mkRule('B09', { kind: 'RecordCreated' }, [{ type: 'RunCustomAction', customActionId: CA, customActionInputs: {} }]); const t = (await mkTicket('B09')).id; out.t = t; await sleep(15000);
  out.disp = arr((await api('GET', `/workflow/executions?recordId=${t}`)).j?.data).flatMap(e => (e.dispatches || []).map(x => x.actionType + ' ' + x.status + ' ' + x.responseStatus + ' ' + (x.responseBodyTruncated || '').slice(0, 150))); }
return fin(out);
