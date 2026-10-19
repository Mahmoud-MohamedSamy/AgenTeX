// NDC-1819 item 11: each My Open Activities period vs tasks computed from the API (owner = me, due_date in Cairo local time).
const out = { ui: {} }; const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065'; const ME = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const v = (r, f) => ((r.data || []).find(x => x.field === f) || { value: {} }).value.value;
let all = []; for (let p = 1; p <= 3; p++) { const r = await api('GET', '/modules/' + T + '/records?page=' + p + '&per_page=100'); all = all.concat(arr(r.j && r.j.data)); if (arr(r.j && r.j.data).length < 100) break; }
const mine = all.filter(r => v(r, 'owner') === ME).map(r => ({ due: v(r, 'due_date'), st: v(r, 'status') }));
out.tasks = { all: all.length, mine: mine.length, statuses: [...new Set(mine.map(m => m.st))], noDue: mine.filter(m => !m.due).length };
const open = mine.filter(m => m.st !== 'Completed' && m.due); const d = s => s.slice(0, 10);
const today = '2026-10-19'; const add = n => { const x = new Date(Date.UTC(2026, 9, 19 + n)); return x.toISOString().slice(0, 10); };
const cnt = (f, set) => set.filter(m => f(d(m.due))).length;
out.expected = { set: 'open (status != Completed) / all', today: [cnt(x => x === today, open), cnt(x => x === today, mine.filter(m => m.due))], tomorrow: [cnt(x => x === add(1), open)], overdue: [cnt(x => x < today, open)], todayOverdue: [cnt(x => x <= today, open)],
  thisWeekSun: [cnt(x => x >= add(-1) && x <= add(5), open)], thisWeekMon: [cnt(x => x >= today && x <= add(6), open)], nextWeekSun: [cnt(x => x >= add(6) && x <= add(12), open)], nextWeekMon: [cnt(x => x >= add(7) && x <= add(13), open)],
  thisMonth: [cnt(x => x.startsWith('2026-10'), open)], nextMonth: [cnt(x => x.startsWith('2026-11'), open)], next7: [cnt(x => x > today && x <= add(7), open), cnt(x => x >= today && x <= add(6), open)], allOpen: [open.length], completedWithDue: mine.filter(m => m.st === 'Completed').length };
// UI
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^Tasks, / }).count()); i++) await sleep(1000); await sleep(2000);
const sel = page.getByRole('button', { name: 'Which open activities to count and list' });
await sel.click(); await sleep(1000); const opts = await page.locator('[role=listbox] [role=option], [role=menu] [role^=menuitem]').allInnerTexts(); await page.keyboard.press('Escape'); out.options = opts.map(s => s.trim());
for (const o of out.options) { if (/specific/i.test(o)) continue;
  await sel.click(); await sleep(800); await page.locator('[role=listbox] [role=option], [role=menu] [role^=menuitem]', { hasText: o }).first().click(); await sleep(4000);
  const side = (await page.locator('main').first().innerText().catch(() => '')).replace(/\s+/g, ' ').match(/My Open Activities.{0,120}/);
  const tb = page.getByRole('button', { name: /^Tasks\b/ }).first(); let tot = '';
  if (await tb.count()) { await tb.click(); await sleep(4000); tot = (((await txt()).match(/Total Records\s*\d+/) || [''])[0]); }
  out.ui[o] = (side && side[0]) + ' | ' + tot; if (o === 'Today') await shot('NDC-1819-f-period-today'); if (/This week/.test(o)) await shot('NDC-1819-f-period-week'); }
await sel.click(); await sleep(800); await page.locator('[role=listbox] [role=option], [role=menu] [role^=menuitem]', { hasText: 'All open' }).first().click(); await sleep(2000);
return done(out);
