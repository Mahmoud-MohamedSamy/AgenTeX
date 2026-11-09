const ev = page.getByText('QA W4 Reminder task UI', { exact: false }).first();
await ev.scrollIntoViewIfNeeded(); await page.waitForTimeout(800); const b = await ev.boundingBox();
const heads = await page.locator('text=/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/').evaluateAll(es => es.map(e => { const r = e.getBoundingClientRect(); return { t: e.innerText.replace(/\s+/g, ' '), x: r.x, w: r.width, y: r.y }; }));
let colW = 0; const xs = heads.map(h => h.x).sort((a, c) => a - c); for (let i = 1; i < xs.length; i++) if (xs[i] - xs[i - 1] > 40) { colW = xs[i] - xs[i - 1]; break; }
if (!b || !colW) return { box: b, heads: heads.slice(0, 8) };
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down();
await page.mouse.move(b.x + b.width / 2 + colW / 2, b.y + b.height / 2, { steps: 8 }); await page.mouse.move(b.x + b.width / 2 + colW, b.y + b.height / 2, { steps: 8 }); await page.mouse.up();
await page.waitForTimeout(5000);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave4/evidence/raw/t-calendar-after-drag.png' });
const t = await call('GET', `/modules/${MODS.tasks}/records/e317b07b-d193-42af-803a-62c16b8f6ccc`);
const f = t.j.data.data.find(e => e.field === 'due_date');
return { colW, box: b, dueNow: f && f.value && f.value.value, toast: (await page.innerText('body')).match(/(moved|rescheduled|updated|couldn't|could not)[^.]{0,60}/gi) };
