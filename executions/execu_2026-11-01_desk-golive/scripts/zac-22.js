const A2 = '1499272000000432034', TE = '1499272000000006907', TC = '1499272000000432293', CEO = '1499272000000008337';
out.ag2 = (await api(page, 'PATCH', 'agents/' + A2, { rolePermissionType: 'AgentPublic', roleId: CEO, associatedDepartmentIds: [TE, TC] })).s;
out.peers = (await api(page, 'PATCH', 'roles/' + CEO, { shareDataWithPeers: true })).s;
out.ds = (await api(page, 'PATCH', 'dataSharingRules', { tickets: 'public' })).s;
const a = (await api(page, 'GET', 'agents/' + A2)).j; out.ag2now = [a.rolePermissionType, a.roleId, JSON.stringify(a.associatedDepartmentIds)].join(' ');
out.dsNow = (await api(page, 'GET', 'dataSharingRules')).t.slice(0, 120); out.ceo = (await api(page, 'GET', 'roles/' + CEO)).j?.shareDataWithPeers;
// delete QA AC tickets + contact
const s = (await api(page, 'GET', 'tickets/search?subject=' + encodeURIComponent('QA AC*') + '&limit=50')).j; const ids = ((s && s.data) || []).filter(x => /^QA AC/.test(x.subject)).map(x => x.id); out.n = ids.length;
if (ids.length) out.trash = (await api(page, 'POST', 'tickets/moveToTrash', { ticketIds: ids })).s;
const cs = (await api(page, 'GET', 'contacts/search?lastName=' + encodeURIComponent('QA AC Zoho') + '&limit=20')).j; const cids = ((cs && cs.data) || []).map(x => x.id); out.nc = cids.length;
if (cids.length) out.ctrash = (await api(page, 'POST', 'contacts/moveToTrash', { contactIds: cids })).s;
await page.waitForTimeout(4000);
const rb = await api(page, 'GET', 'recycleBin?limit=100'); const items = ((rb.j && rb.j.data) || []).filter(x => /QA AC/.test(x.name || x.displayName || x.subject || ''));
out.bin = items.length; if (items.length) out.purge = (await api(page, 'POST', 'recycleBin/delete', { ids: items.map(x => x.id) })).s;
await page.waitForTimeout(3000); const rb2 = await api(page, 'GET', 'recycleBin?limit=100'); out.binLeft = ((rb2.j && rb2.j.data) || []).filter(x => /QA AC/.test(x.name || x.displayName || x.subject || '')).length;
const s2 = (await api(page, 'GET', 'tickets/search?subject=' + encodeURIComponent('QA AC*') + '&limit=50')).j; out.left = ((s2 && s2.data) || []).length;
