const ids = { MK2: '0f728e32-c972-4721-b3c4-05f407ab7f59', HR1: 'fc755356-fb4e-4530-887a-7a1aa4029836', CSU: 'd2dcb7fb-faf9-4d59-97cb-3edb5ccc2715', CST: '51010fcc-7f0f-4c31-8906-c336abc18841' };
out.r = {};
for (const [k, id] of Object.entries(ids)) { let g = await get(TM, id); const before = g.owner; let s = '';
  if (g.owner) { const r = await api('POST', '/desk/tickets/' + id + '/assign', { owner_id: null, assignee_id: null, team_id: k === 'CST' ? '9e444340-ef59-455b-80a1-16b321592447' : null }); s = 'assign ' + r.s + ' ' + r.t.slice(0, 150);
    g = await get(TM, id); if (g.owner) { const p = await api('PATCH', '/modules/' + TM + '/records/' + id, { data: [{ field: 'owner', value: null }] }); s += ' | patch ' + p.s + ' ' + p.t.slice(0, 150); g = await get(TM, id); } }
  out.r[k] = (before || '-') + ' -> ' + (g.owner || '-') + ' team ' + (g.team || '-') + ' #' + (g.ticket_number || '?') + ' ' + s; }
const c = await api('POST', '/desk/tickets/43d637c7-140c-4e70-8033-16bd2a4f4cf9/comments', { body_html: '<p>QA AC private comment on MK1</p>', is_private: true }); out.cmt = c.s + ' ' + c.t.slice(0, 200);
return fin({ out });
