const o = { inv: [], purge: [] };
const u = arr((await api('o', 'GET', '/iam/users?status=invited')).j?.data).find(z => z.email === 'qa.rt12.2773@example.com');
if (u) for (const [m, p] of [['DELETE', `/iam/users/invitations/${u.invitationId}`], ['POST', `/iam/users/invitations/${u.invitationId}/revoke`], ['POST', `/iam/users/invitations/${u.invitationId}/cancel`]]) { const r = await api('o', m, p, m === 'POST' ? {} : undefined); o.inv.push(m + ' ' + p.replace(/[0-9a-f-]{36}/, '{id}') + ' ' + r.s + ' ' + (r.t || '').slice(0, 100)); if (r.s < 300) break; }
o.stillInvited = arr((await api('o', 'GET', '/iam/users?status=invited')).j?.data).filter(z => /qa\.rt1/.test(z.email)).map(z => z.email + ' ' + z.invitationStatus);
const bin = []; let cur = ''; for (let i = 0; i < 30; i++) { const r = await api('o', 'GET', `/audit/recycle-bin/items?app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200${cur ? '&cursor=' + cur : ''}`); bin.push(...arr(r.j?.data)); cur = r.j?.meta?.next_cursor; if (!cur) break; }
const ids = bin.filter(x => /^QA RT1[12] /.test(x.record_label || '')).map(x => x.id); o.binTotal = bin.length; o.toPurge = ids.length; o.labels = bin.filter(x => /^QA RT1[12] /.test(x.record_label || '')).map(x => x.record_label);
for (let i = 0; i < ids.length; i += 25) { const r = await api('o', 'POST', '/audit/recycle-bin/delete', { ids: ids.slice(i, i + 25) }); o.purge.push(r.s); }
return o;
