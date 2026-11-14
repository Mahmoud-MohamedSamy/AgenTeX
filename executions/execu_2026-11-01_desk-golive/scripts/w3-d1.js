const AS = '/desk/tickets/archive/settings', SS = '/desk/tickets/spam/settings';
out.arch = {}; for (const d of [6, 7, 1095, 1096, 0, -1]) { const r = await api('PUT', AS, { enabled: false, inactive_days: d, closed_only: true }); out.arch[d] = r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 200) : JSON.stringify(D(r.j))); }
out.archClosedOnlyOff = (await api('PUT', AS, { enabled: false, inactive_days: 120, closed_only: false })).s;
out.archRestore = (await api('PUT', AS, { enabled: false, inactive_days: 120, closed_only: true })).t.slice(0, 150);
out.spam = {}; for (const d of [6, 366]) { const r = await api('PUT', SS, { enabled: true, retention_days: d, auto_spam_contacts_enabled: false, auto_spam_contacts_threshold: 3 }); out.spam[d] = r.s + ' ' + r.t.slice(0, 200); }
for (const d of [7, 365]) { const r = await api('PUT', SS, { enabled: false, retention_days: d, auto_spam_contacts_enabled: false, auto_spam_contacts_threshold: 3 }); out.spam['off_' + d] = r.s + ' ' + r.t.slice(0, 150); }
for (const t of [0, 51, 1, 50]) { const r = await api('PUT', SS, { enabled: false, retention_days: 30, auto_spam_contacts_enabled: false, auto_spam_contacts_threshold: t }); out.spam['thr_' + t] = r.s + ' ' + r.t.slice(0, 150); }
out.spamRestore = (await api('PUT', SS, { enabled: true, retention_days: 30, auto_spam_contacts_enabled: false, auto_spam_contacts_threshold: 3 })).t.slice(0, 200);
// screen messages
await go('/settings/tickets/archiving', 10000); const MC = page.locator('#main-content');
out.nums = await MC.locator('input[type=number]').evaluateAll(es => es.map(e => [e.value, e.min, e.max, e.disabled ? 'DIS' : ''].join('|')));
const n0 = MC.locator('input[type=number]').first(); if (!(await n0.isDisabled())) { await n0.fill('6'); await n0.blur(); await sleep(800); out.ui6 = ((await MC.innerText()).match(/[^.\n]*(between 7|7 and 1095|at least 7)[^.\n]*/gi) || []).slice(0, 2); await shot('w3/W3-25-archive-6'); }
out.uiNote = 'auto-archive switch left off';
return fin({ out });
