// NDC-2620 / 2624: upload files to the QA lead "QA RT r8 control 1" (3b0b6ece) from the Overview Attachments section.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', id = '3b0b6ece-2f8c-4446-b13f-65df18bdd78d'; const out = {}; const bad = [];
page.on('response', r => { if (r.url().includes('/api/') && r.status() >= 400) bad.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(API, '').slice(0, 80)); });
await page.setViewportSize({ width: 1600, height: 900 }); await go(`/modules/${L}/records/${id}`, 6000); for (let j = 0; j < 45 && !/Attachments/i.test(await txt()); j++) await sleep(2000); await sleep(3000);
const att = page.getByText(/^Attachments/).first(); await att.scrollIntoViewIfNeeded(); await sleep(1000);
const box0 = await att.evaluate(e => { let p = e; for (let k = 0; k < 6; k++) { p = p.parentElement; if (p.getBoundingClientRect().height > 120) break; } return Math.round(p.getBoundingClientRect().height); }); out.heightEmpty = box0; await shot('v30-att-empty');
const input = page.locator('input[type=file]'); out.inputs = await input.count();
const dir = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_retest-mahmoudmohamed-r8/files/';
const files = Array.from({ length: 15 }, (_, i) => dir + 'QA RT r8 file ' + String(i + 1).padStart(2, '0') + '.png');
if (out.inputs) { const multi = await input.first().evaluate(e => e.multiple); out.multiple = multi; if (multi) { await input.first().setInputFiles(files); await sleep(25000); } else { for (const f of files) { await page.locator('input[type=file]').first().setInputFiles(f); await sleep(3500); } } }
await sleep(3000); await att.scrollIntoViewIfNeeded(); await sleep(1000); await shot('v30-att-15');
out.heightFull = await att.evaluate(e => { let p = e; for (let k = 0; k < 6; k++) { p = p.parentElement; if (p.getBoundingClientRect().height > 120) break; } return Math.round(p.getBoundingClientRect().height); });
out.scrollInside = await att.evaluate(e => { let p = e; for (let k = 0; k < 7; k++) { p = p.parentElement; const s = [...p.querySelectorAll('*')].find(x => x.scrollHeight > x.clientHeight + 10 && /auto|scroll/.test(getComputedStyle(x).overflowY)); if (s) return s.clientHeight + '/' + s.scrollHeight; } return 'none'; });
out.count = ((await txt()).match(/QA RT r8 file \d\d/g) || []).length; out.bad = bad.slice(0, 8);
return done(out);
