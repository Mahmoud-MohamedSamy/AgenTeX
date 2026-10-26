// G4 / G7 / G8 reminder states, and pop-up presence on any page
const L = await api('GET', `/modules/${M.tasks}/records?page=1&per_page=60&sort_by=created_at&sort_dir=desc`); const list = ((L.j.data.records || L.j.data.items || L.j.data) || []).map(fl);
const by = s => list.find(x => x.subject === s);
const out = { now: new Date().toISOString() };
for (const s of ['QA ACT G task', 'QA ACT G7 task', 'QA ACT G8 task']) { const t = by(s); if (!t) { out[s] = 'not found'; continue; } const r = await api('GET', `/desk/activities/${t.id}/reminders`); out[s] = { due: t.due_date, status: t.status, rem: r.s + ' ' + JSON.stringify(((r.j && r.j.data && r.j.data.reminders) || []).map(x => ({ timing: x.timing, state: x.state || x.status, sent: x.sent_at, skip: x.skipped_reason || x.skip_reason, at: x.remind_at || x.fire_at || x.next_at }))) }; }
await go('/hq', 8000); out.popup = (await page.$$eval('[aria-label="Activity reminders"], [role=region]', rs => rs.map(r => r.innerText.replace(/\s+/g, ' ')).join(' | '))).slice(0, 400);
out.shot = await shot('ACT-G4-popup');
const n = await api("GET", "/notifications?unread_only=true&limit=10&category=general&modules=desk&apps=desk"); out.notifs = n.t.slice(0, 900);
return JSON.stringify(out);
