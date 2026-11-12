const mid = await modId(); const L = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data).map(l => l.name + ' ' + l.id.slice(0, 8));
const all = (await rules(mid)).map(r => r.name + ' ' + r.layoutId.slice(0, 8));
const fq = (await fieldsOf(mid)).filter(f => f.fieldName.startsWith('qa_lr')).map(f => f.fieldName);
const audits = []; for (const p of ['/audit/logs?limit=15', '/audit-logs?limit=15', '/settings/audit-log?limit=15', '/audit?limit=15']) { const a = await api('GET', p); audits.push(p + ' ' + a.s + ' ' + (a.t || '').replace(/"[0-9a-f-]{36}"/g, '"<id>"').slice(0, 1200)); if (a.s === 200) break; }
const rb = await api('GET', '/recycle-bin?limit=10'); 
return { L, all, fq, audits, rb: rb.s + ' ' + (rb.t || '').replace(/"[0-9a-f-]{36}"/g, '"<id>"').slice(0, 800) };
