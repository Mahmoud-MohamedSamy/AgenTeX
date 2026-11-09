const o = as(OWNER); const t = Date.now() % 100000; const N = v => ({ kind: 'number', value: v }); out.created = { leads: [], po: [] };
const l = await o.post(`/modules/${MODS.leads}/records`, { layout_id: LAY.leads, data: enc({ first_name: 'QA R2W2 DEC ' + t, phone: '0101' + String(5000000 + t).slice(0, 7), single_line_3_9: 'QA R2W2', decimal: N(2.75), average_time_spent_minutes: N(3.5), annual_revenue: N(1234.56) }) });
out.leadCreate = l.s + (l.s >= 300 ? ' ' + l.t.slice(0, 200) : '');
if (l.s < 300) { out.created.leads.push(l.j.data.id); const g = await o.get(`/modules/${MODS.leads}/records/${l.j.data.id}`); out.leadDecimals = ['decimal', 'average_time_spent_minutes', 'annual_revenue'].map(f => f + '=' + JSON.stringify(val(g.j, f))).join('; '); }
const p = await o.post(`/modules/${MODS.po}/records`, { layout_id: LAY.po, data: enc({ name: 'QA R2W2 DEC PO ' + t, subject: 'QA R2W2 DEC PO ' + t, exchange_rate: N(1.25), tax: N(7.5) }) });
if (p.s < 300) { out.created.po.push(p.j.data.id); const g = await o.get(`/modules/${MODS.po}/records/${p.j.data.id}`); out.poDecimals = 'exchange_rate=' + JSON.stringify(val(g.j, 'exchange_rate')) + '; tax=' + JSON.stringify(val(g.j, 'tax')); }
const f = await o.get(`/modules/${MODS.po}/fields`); const fs = Array.isArray(f.j.data) ? f.j.data : f.j.data.fields; const er = fs.find(x => x.apiName === 'exchange_rate'); out.exchangeRateField = er && JSON.stringify({ type: er.datatypeKey, opts: er.datatypeOptions, cfg: er.config }).slice(0, 300);
// NDC-2388: conversion targets
const c = await o.get(`/modules/${MODS.leads}/conversion/config`); out.conversionTargets = (c.j.data.targets || []).map(x => x.moduleKey + (x.gatingFieldApiName ? '(gate ' + x.gatingFieldApiName + ')' : '(always)') + (x.enabled === false ? ' off' : ''));
const mods = await o.get('/modules'); out.moduleCount = (mods.j.data || []).length;
// NDC-2382: pipeline field allowed values + create with id
const df = await o.get(`/modules/${MODS.deals}/fields`); const dfs = Array.isArray(df.j.data) ? df.j.data : df.j.data.fields; out.pipelineField = JSON.stringify((dfs.find(x => x.apiName === 'pipeline') || {}).datatypeOptions).slice(0, 200);
const d = await o.post(`/modules/${MODS.deals}/records`, { layout_id: LAY.deals, data: enc({ name: 'QA R2W2 PL ' + t, deal_name: 'QA R2W2 PL ' + t, pipeline: '5170500c-b335-479c-96d1-ed138965c345', stage: 'qualification' }) });
out.dealWithPipelineId = d.s + (d.s >= 300 ? ' ' + d.t.slice(0, 200) : ''); out.created.deals = d.s < 300 ? [d.j.data.id] : [];
