const RID = '1499272000000517100';
const d = await api(page, 'DELETE', 'directAssignmentRules/' + RID); out.ruleDel = d.s + ' ' + (d.s >= 300 ? d.t.slice(0, 150) : '');
if (d.s >= 300) { const p = await api(page, 'PATCH', 'directAssignmentRules/' + RID, { status: 'INACTIVE' }); out.ruleInactive = p.s + ' ' + p.t.slice(0, 150); }
const l = await api(page, 'GET', 'directAssignmentRules?limit=20'); out.rulesLeft = (l.j && l.j.data || []).map(r => r.name + ' ' + r.status);
out.t = (await api(page, 'POST', 'tickets/moveToTrash', { ticketIds: ['1499272000000533001', '1499272000000527001'] })).s;
out.c = (await api(page, 'POST', 'contacts/moveToTrash', { contactIds: ['1499272000000517104'] })).s;
await page.waitForTimeout(5000);
const rb = await api(page, 'GET', 'recycleBin?limit=100');
const items = (rb.j && rb.j.data || []).filter(x => ['1499272000000533001', '1499272000000527001', '1499272000000517104'].includes(String(x.id)) || /QA RT22/.test(JSON.stringify(x)));
out.found = items.length; if (items.length) out.purge = (await api(page, 'POST', 'recycleBin/delete', { ids: items.map(x => x.id) })).s;
await page.waitForTimeout(3000);
const rb2 = await api(page, 'GET', 'recycleBin?limit=100'); out.binLeft = (rb2.j && rb2.j.data || []).filter(x => /QA RT22/.test(JSON.stringify(x))).length;
out.status = (await api(page, 'GET', 'directAssignmentRules/executionStatus')).j;
