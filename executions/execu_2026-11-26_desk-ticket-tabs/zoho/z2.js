eval(require('fs').readFileSync(require('path').join(process.cwd(), 'zlib.js'), 'utf8'));
await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {}); await sleep(10000);
for (const p of ['timeTrackSettings?depId=' + D, 'timeTrackingSettings?depId=' + D, 'settings/timeTrack?depId=' + D]) { const r = await api('GET', B + p); out[p] = r.s + ' ' + r.t.slice(0, 500); if (r.s === 200) break; }
const t = await api('GET', B + 'tickets?limit=5&departmentId=' + D); const tl = JSON.parse(t.t || '{}').data || []; out.tickets = tl.map(x => x.ticketNumber + ':' + x.id).join(', ');
if (tl[0]) { const te = await api('GET', B + 'tickets/' + tl[0].id + '/timeEntry'); out.timeEntries = te.s + ' ' + te.t.slice(0, 400); }
