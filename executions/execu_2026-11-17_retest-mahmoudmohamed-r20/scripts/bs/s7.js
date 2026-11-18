const id = '5392f456-66f9-4bc7-aa95-99bad990f4d5'; const o = {}; const pick = d => (d?.states || []).map(s => [s.id, s.slaMinutes, s.slaPreExpiryMinutes, s.autoTransitionAfterMinutes]);
for (const p of ['/draft', '/versions/draft', '/drafts', '/versions?include=definition']) { const r = await api('GET', `/modules/${TK}/blueprints/${id}${p}`); o[p] = r.s + ' ' + (r.s < 300 ? JSON.stringify(pick(r.j?.data?.definition || L(r.j?.data)[0]?.definition)) + ' ' + Object.keys(r.j?.data || {}).slice(0, 12).join(',') : ''); }
const b = await getBp(id); o.hasDraft = b.hasDraft; o.draftVersion = b.draftVersion; o.live = JSON.stringify(pick(b.definition));
return o;
