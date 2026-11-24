const M = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = [];
for (const k of ['QA TIA Lead 1', 'QA TIA Lead 2', 'QA TIA Lead 3']) { const r = await api('PATCH', `/modules/${M}/records/${CRMIDS[k]}`, { data: [{ field: 'name', value: { kind: 'string', value: k } }] }); out.push(k + ':' + r.s + ' ' + (r.j?.error?.code || '')); }
return out;
