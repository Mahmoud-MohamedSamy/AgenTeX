const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
out.tries = [];
for (const c of [
  { criteria: [{ field: 'name', operator: 'starts_with', value: 'QA R2SC MD' }] },
  { criteria: { pattern: '1', conditions: [{ field: 'name', operator: 'starts_with', value: 'QA R2SC MD' }] } },
  { criteria: { filters: [{ field: 'name', operator: 'starts_with', value: 'QA R2SC MD' }] } },
]) { const r = await api('POST', `/modules/${L}/records/mass-delete`, c); out.tries.push({ body: JSON.stringify(c).slice(0, 120), s: r.s, t: r.t.slice(0, 300) }); if (r.s === 200) break; }
