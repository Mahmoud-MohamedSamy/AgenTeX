const d = page.locator('[role=dialog]').first();
await d.locator('button', { hasText: '← Back' }).click(); await sleep(1500);
const boxes = d.locator('input[type=checkbox]');
const n = await boxes.count(); const st = [];
for (let i = 0; i < n; i++) { const b = boxes.nth(i); const lab = await b.evaluate(e => (e.closest('label') || e.parentElement).innerText.replace(/\s+/g, ' ').trim()); st.push(i + ':' + lab + '=' + (await b.isChecked())); }
// uncheck all, check QA R2W5 Module only
for (let i = 0; i < n; i++) { const b = boxes.nth(i); const lab = await b.evaluate(e => (e.closest('label') || e.parentElement).innerText.replace(/\s+/g, ' ').trim()); const want = /^QA R2W5 Module qa_r2w5_mod$/.test(lab); if ((await b.isChecked()) !== want && /qa_|leads|contacts|deals|accounts|tasks|calls|meetings|subscriptions|agency|services|daily_move|cases|orders|ndc_/.test(lab)) await b.click(); }
const st2 = []; for (let i = 0; i < n; i++) if (await boxes.nth(i).isChecked()) st2.push(i);
await shot('i02-modules-picked');
await d.locator('button', { hasText: /^Next$/ }).click(); await sleep(2500);
return { st: st.slice(0, 25), checked: st2, t: (await d.innerText()).replace(/\s+/g, ' ').slice(0, 600) };
