const ev = page.getByText('QA W4 Reminder task UI', { exact: false }).first();
await ev.scrollIntoViewIfNeeded();
const info = await ev.evaluate(e => { const out = []; let n = e; for (let i = 0; i < 5 && n; i++, n = n.parentElement) out.push(n.tagName + ' draggable=' + n.getAttribute('draggable') + ' role=' + n.getAttribute('role') + ' class=' + String(n.className).slice(0, 60)); return out; });
const b = await ev.boundingBox();
const target = await page.evaluate(([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName + ' ' + String(el.className).slice(0, 60) + ' ' + (el.innerText || '').slice(0, 40) : null; }, [b.x + b.width / 2 + 154, b.y + 4]);
let dragTo = null;
try { await ev.dragTo(page.locator('body'), { targetPosition: { x: Math.round(b.x + b.width / 2 + 154), y: Math.round(b.y + 4) }, timeout: 8000 }); dragTo = 'done'; } catch (e) { dragTo = e.message.slice(0, 120); }
await page.waitForTimeout(4000);
const t = await call('GET', `/modules/${MODS.tasks}/records/e317b07b-d193-42af-803a-62c16b8f6ccc`);
const f = t.j.data.data.find(e => e.field === 'due_date');
return { info, target, dragTo, dueNow: f && f.value && f.value.value };
