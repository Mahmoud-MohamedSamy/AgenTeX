const TK = 'e8e5e302-3873-4e32-b945-c9cd25c7659d'; const B = {};
B.blueprints = arr((await api('GET', `/modules/${TK}/blueprints?includeInactive=true`)).j?.data);
B.versions = {}; for (const b of B.blueprints) B.versions[b.id] = arr((await api('GET', `/modules/${TK}/blueprints/${b.id}/versions`)).j?.data).map(v => ({ n: v.versionNumber ?? v.number ?? v.version, at: v.createdAt || v.publishedAt }));
for (const p of ['/desk/ticket-statuses', '/desk/departments?take=100', '/desk/sla/policies', '/desk/business-hours', '/desk/happiness/settings']) B[p] = (await api('GET', p)).j?.data;
const fl = arr((await api('GET', `/modules/${TK}/fields?take=200`)).j?.data).find(f => f.apiName === 'status'); B.statusValues = fl?.datatypeOptions?.allowed_values;
fs.writeFileSync('../a6/baseline-anyware.json', JSON.stringify(B, null, 1));
log(JSON.stringify({ bps: B.blueprints.map(b => [b.name || b.definition?.name, b.isActive, b.departmentId?.slice(0, 8) || b.definition?.departmentId?.slice(0, 8), b.inProgressCount ?? b.in_progress_count]), qaBP: B.blueprints.filter(b => /^QA BP/.test(b.name || b.definition?.name || '')).length, statuses: (B.statusValues || []).map(v => v.value || v.label || v), bh: B['/desk/business-hours']?.preset, happiness: B['/desk/happiness/settings']?.is_enabled }));
