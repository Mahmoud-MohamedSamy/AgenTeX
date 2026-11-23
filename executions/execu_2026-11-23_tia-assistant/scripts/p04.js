const out = {};
for (const p of ['/agents/tia/status','/agents/tia/capabilities','/iam/me','/desk/departments','/desk/agents/me','/agents/tia/conversations']) { const r = await api('GET', p); out[p] = { s: r.s, body: r.j ?? r.t.slice(0,200) }; }
fs.writeFileSync('../out/p04-rst-' + (process.env.APP) + '.json', JSON.stringify(out, null, 1));
const c = out['/agents/tia/capabilities'].body?.data;
const deps = out['/desk/departments'].body?.data; 
return { status: out['/agents/tia/status'].body?.data, apps: c?.apps, modules: (c?.modules||[]).map(m => m.app+':'+(m.label||m.key)).slice(0,60), tools: (c?.tools||[]).length, areas: (c?.setup_areas||[]).length, codes: Object.fromEntries(Object.entries(out).map(([k,v])=>[k,v.s])), deps: Array.isArray(deps) ? deps.map(d=>d.name).slice(0,20) : JSON.stringify(deps).slice(0,200), me: JSON.stringify(out['/desk/agents/me'].body?.data||'').slice(0,400) };
