const r = await api('GET', '/workflow/approval-processes'); const l = arr(r.j.data);
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const out = { n: l.length, list: l.map(p => p.name + ' | mod=' + (p.moduleId === D ? 'Deals' : p.moduleId.slice(0, 8)) + ' | active=' + (p.isActive ?? p.active ?? p.status)).slice(0, 15) };
const d = l.find(p => p.moduleId === D) || l[0]; const g = await api('GET', '/workflow/approval-processes/' + d.id);
out.sampleKeys = Object.keys(g.j.data || {}); out.sample = JSON.stringify(g.j.data).slice(0, 2500);
return done(out);
