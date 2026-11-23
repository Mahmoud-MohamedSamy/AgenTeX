eval(require('fs').readFileSync('zlib.js', 'utf8'));
for (let a = 0; a < 3; a++) { try { await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 120000 }); break; } catch (e) {} } await sleep(12000);
const L = JSON.parse(require('fs').readFileSync('zledger.json', 'utf8'));
out.rules = []; for (const id of L.rules) out.rules.push((await api('DELETE', B + 'directAssignmentRules/' + id)).s);
out.fu = []; for (const id of ['1499272000000572001', '1499272000000571061']) out.fu.push((await api('DELETE', B + 'automationFieldUpdates/' + id)).s);
const left = JSON.parse((await api('GET', B + 'automationAlerts?departmentId=' + D)).t || '[]');
out.tickets = (await api('POST', B + 'tickets/moveToTrash', { ticketIds: L.tickets })).s;
out.contacts = (await api('POST', B + 'contacts/moveToTrash', { contactIds: L.contacts })).s;
await sleep(5000);
const rb = await api('GET', B + 'recycleBin?limit=50'); out.recycleList = rb.s + ' ' + rb.t.slice(0, 300); let items = []; try { items = (JSON.parse(rb.t).data || []).filter(x => /QA ZWF|qa zwf/i.test(JSON.stringify(x))); } catch {}
out.binQa = items.length; if (items.length) { const ids = items.map(x => x.id); const d1 = await api('DELETE', B + 'recycleBin?ids=' + ids.join(',')); out.purge = d1.s + ' ' + d1.t.slice(0, 200); if (d1.s >= 300) { const d2 = await api('POST', B + 'recycleBin/permanentDelete', { ids }); out.purge2 = d2.s + ' ' + d2.t.slice(0, 200); } }
const rb2 = await api('GET', B + 'recycleBin?limit=50'); try { out.binQaAfter = (JSON.parse(rb2.t).data || []).filter(x => /QA ZWF|qa zwf/i.test(JSON.stringify(x))).length; } catch { out.binQaAfter = rb2.s; }
out.daLeft = JSON.parse((await api('GET', B + 'directAssignmentRules?departmentId=' + D)).t).data.map(r => r.name);
require('fs').writeFileSync('zclean.json', JSON.stringify(out, null, 1));
