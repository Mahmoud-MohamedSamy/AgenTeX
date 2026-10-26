await sleep(50000);
const B = '/desk/integrations/crm', DC = '43004ce2-577f-4eda-b00a-0750fe40c3d4', D = 'f0de6428-14f4-414a-b333-5f27fa6b0f7a';
const links = arr((await api('GET', `${B}/links?kind=contact&limit=200`)).j?.data).filter(l => /d9a7b0fa|f0de6428/.test(JSON.stringify(l))).map(l => ({ id: l.id, status: l.sync_status, src: l.match_source, at: l.created_at }));
const d = Object.fromEntries(((await api('GET', `/modules/${DC}/records/${D}`)).j?.data?.data || []).map(e => [e.field, e.value?.value]));
const out = { linksAfter: links, deskTitle: d.title ?? null };
if (!links.length) { const r = await api('POST', `${B}/links`, { kind: 'contact', crm_record_id: 'd9a7b0fa-2f75-449c-997c-c94f2cde243c', desk_record_id: D }); out.relink = r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 150)); }
return done(out);
