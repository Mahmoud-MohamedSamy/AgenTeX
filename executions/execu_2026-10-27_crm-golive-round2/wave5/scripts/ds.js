const r = await call('GET', '/reporting/semantic-layer/datasets');
const d = r.j && r.j.data; const arr = Array.isArray(d) ? d : (d && (d.data || d.items || d.datasets)) || [];
const a2 = Array.isArray(arr) ? arr : (arr.items || arr.datasets || []);
return { s: r.s, keys: d && Object.keys(d), n: a2.length, sample: JSON.stringify(a2.find(x => /QA R2W5 Module/.test(JSON.stringify(x)))).slice(0, 600) };
