const t1 = 'd3139b2c-1702-4b51-8ff9-c143a1e7f0f0';
const a = await api('GET', `/desk/tickets/${t1}`);
const d = a.j && a.j.data || {};
const keys = Object.keys(d).filter(k => /follow|watch|share|owner|tag/i.test(k));
const rec = (await api('GET', `/modules/${T}/records/${t1}`)).j.data.data.filter(x => /follow/.test(x.field));
const ca = await api('GET', '/workflow/custom-actions/runs/5e4a70eb-b9af-42a3-830e-5f42eb190880');
const ca2 = await api('GET', '/workflow/custom-action-runs/5e4a70eb-b9af-42a3-830e-5f42eb190880');
return { s: a.s, keys, vals: Object.fromEntries(keys.map(k => [k, JSON.stringify(d[k]).slice(0, 200)])), recFollow: JSON.stringify(rec).slice(0, 300), caRun: ca.s + ' ' + ca.t.slice(0, 500), caRun2: ca2.s + ' ' + ca2.t.slice(0, 500) };
