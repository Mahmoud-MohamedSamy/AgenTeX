const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const o = {};
for (const t of ['7812c9e6-3aad-4b52-a58d-7616f3df8667', '143e6bf5-cde2-47d2-9d82-a359d6df3824']) o[t.slice(0, 8)] = (await api('DELETE', `/modules/${TK}/records/${t}`)).s;
o.qaBpBlueprints = arr((await api('GET', `/modules/${TK}/blueprints?includeInactive=true`)).j?.data).filter(b => /^QA BP/.test(b.name || '')).length;
o.bh = (await api('GET', '/desk/business-hours')).j?.data?.preset; log(JSON.stringify(o));
