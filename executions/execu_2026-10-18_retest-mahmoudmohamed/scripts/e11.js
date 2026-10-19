const out = {};
const p = await api('GET', '/iam/me/permissions'); out.approvalPerms = (p.t.match(/"[^"]*(approval|lock)[^"]*"/gi) || []).slice(0, 12); out.isOwnerHint = (p.t.match(/"(is_owner|isOwner|tenant_owner|role)[^,]{0,60}/gi) || []).slice(0, 5);
const me = await api('GET', '/iam/me'); out.me = (me.t.match(/"(roles?|profile[^"]*|is_owner|isOwner|tenant_role)":[^,\]]{0,80}/gi) || []).slice(0, 6);
const R = 'd802f26e-3cdc-410d-b1ab-735917a64024';
for (const pth of ['/timeline?record_id=' + R, '/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/records/' + R + '/timeline', '/records/' + R + '/timeline', '/audit/logs?record_id=' + R + '&limit=20', '/audit/entries?record_id=' + R]) { const r = await api('GET', pth); out[pth.slice(0, 60)] = r.s + ' ' + (r.s === 200 ? (r.t.match(/"(title|summary|message|action|event[^"]*)":"[^"]{0,90}"/gi) || []).slice(0, 10).join(' | ') : ''); }
return out;
