const ID = '0f472a78-e303-4644-9cd7-ef35c013382d', CID = 'c857d003-b625-4a8d-b9bd-44500ad30f0a';
const t = await api('GET', '/desk/email-templates/' + ID); out.tpl = t.s + ' ' + JSON.stringify((D(t.j) && { name: D(t.j).name, active: D(t.j).is_active, dep: D(t.j).department_id }) || t.t.slice(0, 100));
if (t.s === 200) { const d = await api('DELETE', '/desk/email-templates/' + ID); out.tplDel = d.s + ' ' + d.t.slice(0, 200); }
const cg = await api('GET', '/desk/community/categories/' + CID); out.cat = cg.s + ' ' + JSON.stringify(D(cg.j) && { n: D(cg.j).name, dis: D(cg.j).disabled }).slice(0, 100);
if (cg.s === 200) { const d = await api('DELETE', '/desk/community/categories/' + CID); out.catDel = d.s + ' ' + d.t.slice(0, 200); }
const dm = await api('GET', '/desk/channels/domains'); const doms = arr(D(dm.j)); out.doms = doms.map(x => [x.id, x.domain || x.name, x.status || x.state, x.retired_at || x.is_retired || '']);
for (const x of doms) if (/x\.com|exa mple/.test(x.domain || x.name || '')) { const d = await api('DELETE', '/desk/channels/domains/' + x.id); out['domDel ' + (x.domain || x.name)] = d.s + ' ' + d.t.slice(0, 200); }
const dm2 = await api('GET', '/desk/channels/domains'); out.domsAfter = arr(D(dm2.j)).map(x => [x.domain || x.name, x.status || x.state]);
return fin({ out });
