const o = {};
const c = await api.O('POST', '/desk/data/backups', { scope: 'custom', from: '2026-11-24T00:00:00Z', until: '2026-11-26T00:00:00Z', include_attachments: false });
o.create = E(c) + ' ' + c.t.slice(0, 400); const id = c.j?.data?.id; ST.BK = id; saveState(); if (id) ledger('backup ' + id);
if (!id) return o;
for (let i = 0; i < 40; i++) { const g = (await api.O('GET', '/desk/data/backups/' + id)).j?.data; o.last = `${g?.status} parts ${g?.parts_done}/${g?.parts_total} restorable=${g?.restorable} reason=${g?.restore_unavailable_reason}`; if (/completed|failed/.test(g?.status)) { o.final = JSON.stringify({ status: g.status, restorable: g.restorable, reason: g.restore_unavailable_reason, record_count: g.record_count, expires_at: g.expires_at, completed_at: g.completed_at }); break; } await sleep(5000); }
return o;
