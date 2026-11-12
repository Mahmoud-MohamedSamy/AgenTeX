const mid = await modId(); const g = await getLayout(mid, '602826bb-1d89-4aaf-82a9-1ab5e469c628');
const out = { layoutKeys: Object.keys(g), views: Object.keys(g.views) };
const f = []; for (const [vk, v] of Object.entries(g.views)) for (const s of v.layout.sections || []) for (const c of s.columns) for (const e of c.fields) if (/transaction_type|ancillary|subject/.test(e.fieldName)) f.push(vk + ' ' + e.fieldName + ' ' + JSON.stringify(e.config));
out.f = f.slice(0, 8);
out.hcKeys = Object.entries(g).filter(([k]) => /help/i.test(k)).map(([k, v]) => k + '=' + JSON.stringify(v).slice(0, 300));
return out;
