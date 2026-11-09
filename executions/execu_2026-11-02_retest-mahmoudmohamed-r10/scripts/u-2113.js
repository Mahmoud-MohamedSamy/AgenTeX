// NDC-2113: Leads kanban by Lead Status. First drop after load: card B (Interested) → Unaccounted must be refused; card A (Unaccounted) → Busy must move and set the value.
const st = {}; const V = 'f24a7fd3-e04d-4f56-ad87-a587920396b2';
await page.goto(H + '/modules/' + T.LEADS + '?view=' + V, { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); const t = await text(); if (/QA RT r10 2113 B/.test(t) && /Unaccounted/i.test(t)) break; } await sleep(5000);
await page.mouse.click(1463, 165); for (let i = 0; i < 30; i++) { await sleep(2000); if (/Unaccounted/i.test(await text())) break; } await sleep(4000); st.kanbanName = ((await text()).match(/QA RT r10 2113 kanban|Lead Status/) || [])[0]; await shot('2113-1-board.png'); if (!/Unaccounted/i.test(await text())) return { st, note: 'no kanban board', t: (await text()).slice(0, 600) };
const card = n => page.getByText(n, { exact: false }).first();
const colHead = n => page.getByText(new RegExp('^' + n + '$', 'i')).first();
const drag = async (fromEl, toEl) => { const a = await fromEl.boundingBox(); const b = await toEl.boundingBox(); if (!a || !b) return 'no box';
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.down(); await page.mouse.move(a.x + a.width / 2 + 10, a.y + a.height / 2 + 10, { steps: 5 });
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2 + 60, { steps: 25 }); await sleep(600); await page.mouse.up(); return 'ok'; };
await card('QA RT r10 2113 B').scrollIntoViewIfNeeded(); await sleep(1000);
const un = colHead('Unaccounted'); await un.scrollIntoViewIfNeeded().catch(() => {});
st.drag1 = await drag(card('QA RT r10 2113 B'), un); await sleep(4000); await shot('2113-2-after-first-drop.png');
st.dialog = (await page.getByRole('dialog').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
if (st.dialog) { await page.getByRole('dialog').getByRole('button', { name: /Cancel/i }).click().catch(() => {}); await sleep(2000); }
st.toast = ((await text()).match(/(can't|cannot|not allowed|Unaccounted)[^\n]{0,100}/i) || [])[0];
// second: A from Unaccounted to Busy
const busy = colHead('Busy'); await busy.scrollIntoViewIfNeeded().catch(() => {});
st.drag2 = await drag(card('QA RT r10 2113 A'), busy); await sleep(5000); await shot('2113-3-after-drag-out.png');
st.dialog2 = (await page.getByRole('dialog').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
return st;
