const MODE='hierarchy';
const SCOPE='departments'; const PEERS=[];
const r = await api('PUT', '/modules/' + TM + '/record-visibility', { mode: MODE }); out.r = r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 300) : JSON.stringify(D(r.j)).match(/"(record_?[vV]isibility|mode|visibility)[^,]*/g));
if (typeof SCOPE !== 'undefined') { const s = await api('PUT', '/desk/ticket-access/settings', { public_scope: SCOPE, peer_sharing_role_ids: PEERS }); out.s = s.s + ' ' + s.t.slice(0, 200); }
return fin({ out });
