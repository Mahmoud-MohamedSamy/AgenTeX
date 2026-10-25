const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const p = await api('POST', `/modules/${L}/views`, { name: 'QA RT 2098 foreign', kind: 'list', visibility: 'private', settings: { criteria: { conditions: [{ field: 'lead_source', operator: 'equals', value: 'web' }] } } });
return { s: p.s, id: p.j?.data?.id, err: p.s >= 300 ? p.t.slice(0, 200) : undefined };
