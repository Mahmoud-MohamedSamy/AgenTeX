async (page, ctx) => {
  const p = await zdPage(ctx); const L = '1475109000000439896'; const out = [];
  const lay = await zd(p, 'GET', '/layouts/' + L); const secs = lay.j?.sections || []; const fields = secs.flatMap(s => (s.fields || []).map(f => ({ id: f.id, api: f.apiName, type: f.type, name: f.name }))); 
  out.push('fields ' + fields.slice(0, 40).map(f => f.api + ':' + f.type + ':' + f.id).join(', ').slice(0, 1500));
  const ph = fields.find(f => f.api === 'phone'); const sub = fields.find(f => f.api === 'subject');
  const vars = [{ showFields: [ph?.id] }, { showFields: [{ id: ph?.id }] }, { showFields: [{ fieldName: 'phone' }] }];
  for (const a of vars) { const b = { name: 'QA LR1112 zd text primary', description: 'qa', fieldName: 'subject', layoutId: L, fieldConditions: [{ pattern: '1', conditions: [{ fieldName: 'subject', condition: 'is', value: ['QA'] }], actions: { mandatoryFields: [], showSections: [], ...a } }] }; const r = await zd(p, 'POST', '/layouts/' + L + '/layoutRules', b); out.push(JSON.stringify(a).slice(0, 60) + ' -> ' + r.s + ' ' + r.t.slice(0, 400)); if (r.s < 300) break; }
  return out;
}
