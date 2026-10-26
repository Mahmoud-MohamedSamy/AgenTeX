const TS = 'c7bb126d-0c55-489f-8924-5fd6f2a98507';
const leaf = t => page.evaluate(t => { const el = [...document.querySelectorAll('*')].filter(e => e.childElementCount === 0 && e.textContent.trim() === t && e.offsetParent).pop(); if (!el) return null; const r = el.getBoundingClientRect(); let row = el; for (let k = 0; k < 4; k++) { row = row.parentElement; } const rr = row.getBoundingClientRect(); return { x: r.x, y: r.y + r.height / 2, rowX: rr.x, rowY: rr.y + rr.height / 2, rowW: rr.width }; }, t);
for (const f of ['QA RT Folder A2', 'QA RT Folder B']) { const vis = await leaf(f === 'QA RT Folder A2' ? 'tasks' : 'meetings'); if (!vis) { await page.getByText(f, { exact: true }).first().click(); await sleep(900); } }
await page.evaluate(() => window.scrollTo(0, 0));
const drag = async (fromText, toPoint, name) => { const a = await leaf(fromText); const hx = a.x - 35, hy = a.y; await page.mouse.move(hx, hy); await page.mouse.down(); await sleep(150); const steps = 25; for (let i = 1; i <= steps; i++) { await page.mouse.move(hx + (toPoint.x - hx) * i / steps, hy + (toPoint.y - hy) * i / steps); await sleep(30); } await sleep(400); await shot(name); await page.mouse.up(); await sleep(1200); };
const fb = await leaf('QA RT Folder B');
await drag('tasks', { x: fb.x + 60, y: fb.y }, '1691-01-dragging-tasks');
const card1 = (await txt()).match(/QA RT Folder A2[\s\S]{0,120}/)?.[0];
const sub = await leaf('subscriptions');
await drag('meetings', { x: sub.x + 60, y: sub.y + 40 }, '1691-02-dragging-meetings');
const card2 = (await txt()).match(/QA RT Folder A2[\s\S]{0,140}/)?.[0];
await shot('1691-03-after-drags');
return done({ card1, card2 });
