// L6: audit events for this run's QA module changes (read-only).
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const ev = await api('GET', '/audit/events?page_size=100'); const t = ev.t || '';
const all = JSON.stringify(ev.j || {}); const mentions = (all.match(new RegExp(QA.id, 'g')) || []).length + (all.match(/QA MF/g) || []).length;
const kinds = [...new Set((all.match(/"(entity_type|entityType|resource_type|action)":"[^"]+"/g) || []))].slice(0, 15);
await go('/settings/security/audit-log', 9000); const page1 = await txt(); const ui = /QA MF/.test(page1);
const s = await shot('L6-audit-log');
rec('L6', mentions > 0 || ui ? 'PASS' : 'FAIL', `GET /audit/events → ${ev.s}; entries mentioning the QA module: ${mentions}; entity/action kinds seen: ${kinds.join(', ')}; Audit Log page shows QA MF: ${ui}`, { shot: s, severity: 'Medium' });
return done();
