const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', out = {};
for (const p of ['validation-rules', 'layout-rules', 'dependency-maps', 'buttons', 'links']) { const r = await call('POST', `/modules/${M}/${p}`, {}); out[p] = r.s + ' ' + r.t.slice(0, 700); }
return out;
