const o = {};
const r = await api('GET', `/modules/${M.leads}/records/6ef84830-8152-4f59-abfa-a49c52b2ef3a`); const d = r.j?.data || {}; const v = d.values || d.data || d;
o.lead = { first: v.first_name, last: v.last_name, company: v.company, src: v.lead_source };
const F = arr((await api('GET', `/modules/${M.leads}/fields`)).j?.data);
o.nFields = F.length; o.keys = Object.keys(F[0] || {});
o.recent = F.filter(f => (f.created_at || f.createdAt || '') > '2026-11-25').map(f => ({ id: f.id, label: f.label || f.display_label, key: f.api_name || f.key, type: f.type || f.data_type, at: f.created_at || f.createdAt }));
o.match = F.filter(f => JSON.stringify(f).includes('CRUD')).map(f => ({ id: f.id, label: f.label || f.display_label, key: f.api_name || f.key }));
const W = await api('GET', '/workflow/rules/fdce92b3-daa7-45cf-a96f-8390570939b9'); o.rule = JSON.stringify(W.j?.data || W.t).slice(0, 500);
return o;
