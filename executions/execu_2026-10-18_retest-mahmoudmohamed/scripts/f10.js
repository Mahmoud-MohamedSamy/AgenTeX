// NDC-1819 item 11 follow-up: Overdue (exact), Completed rows inside Today & Overdue, badge counts after a longer wait, On a specific date.
const out = {}; const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065'; const ME = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const v = (r, f) => ((r.data || []).find(x => x.field === f) || { value: {} }).value.value;
let all = []; for (let p = 1; p <= 3; p++) { const r = await api('GET', '/modules/' + T + '/records?page=' + p + '&per_page=100'); all = all.concat(arr(r.j && r.j.data)); if (arr(r.j && r.j.data).length < 100) break; }
const mine = all.filter(r => v(r, 'owner') === ME).map(r => ({ due: (v(r, 'due_date') || '').slice(0, 10), st: v(r, 'status') }));
out.expected = { overdueOpen: mine.filter(m => m.due && m.due < '2026-10-19' && m.st !== 'Completed').length, overdueCompleted: mine.filter(m => m.due && m.due < '2026-10-19' && m.st === 'Completed').length, on17open: mine.filter(m => m.due === '2026-10-17' && m.st !== 'Completed').length, on17all: mine.filter(m => m.due === '2026-10-17').length };
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^Tasks\b/ }).count()); i++) await sleep(1000); await sleep(2000);
const sel = page.getByRole('button', { name: 'Which open activities to count and list' });
const choose = async o => { await sel.click(); await sleep(800); await page.locator('[role=listbox] [role=option], [role=menu] [role^=menuitem]').filter({ hasText: new RegExp('^\\s*' + o + '\\s*$') }).first().click(); await sleep(9000); };
const side = async () => ((await page.locator('main').first().innerText().catch(() => '')).replace(/\s+/g, ' ').match(/My Open Activities.{0,60}/) || [''])[0];
const statusCol = async () => { const h = await page.locator('main thead th').allInnerTexts(); const i = h.findIndex(s => s.trim() === 'Status'); return i < 0 ? 'no Status column: ' + h.join(',') : page.locator('main tbody tr').evaluateAll((rs, i) => rs.map(r => r.children[i].innerText.trim()), i); };
const setRows = async n => { const s = page.locator('main select').last(); if (await s.count()) { await s.selectOption(String(n)); await sleep(4000); } };
for (const o of ['Overdue', 'Today & Overdue']) { await choose(o); out[o + ' side'] = await side(); await page.getByRole('button', { name: /^Tasks\b/ }).first().click(); await sleep(5000);
  out[o + ' total'] = ((await txt()).match(/Total Records\s*\d+/) || [''])[0]; await setRows(200); const st = await statusCol(); out[o + ' statuses'] = Array.isArray(st) ? st.reduce((a, s) => (a[s] = (a[s] || 0) + 1, a), {}) : st; }
await shot('NDC-1819-f-period-overdue-completed');
await setRows(10);
await choose('All open'); out.allOpenSide = await side();
// On a specific date
await sel.click(); await sleep(800); await page.locator('[role=listbox] [role=option], [role=menu] [role^=menuitem]').filter({ hasText: /specific/i }).first().click(); await sleep(1500);
out.picker = (await page.locator('[role=dialog], [role=grid], [data-radix-popper-content-wrapper]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await shot('NDC-1819-f-specific-date-picker');
const day = page.locator('[role=gridcell] button, button[name="day"], [role=grid] button').filter({ hasText: /^17$/ }).first(); out.day17 = await day.count();
if (out.day17) { await day.click(); await sleep(6000); out.specificSide = await side(); await page.getByRole('button', { name: /^Tasks\b/ }).first().click(); await sleep(4000); out.specificTotal = ((await txt()).match(/Total Records\s*\d+/) || [''])[0]; await shot('NDC-1819-f-specific-date-17'); }
await choose('All open');
return done(out);
