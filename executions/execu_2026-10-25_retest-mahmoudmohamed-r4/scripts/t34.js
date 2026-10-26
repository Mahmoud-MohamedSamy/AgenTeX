await page.getByRole('button', { name: 'Close' }).click().catch(() => {}); await sleep(600);
const xs = async () => page.evaluate(() => [...document.querySelectorAll('*')].filter(e => e.childElementCount === 0 && /^(meetings|subscriptions|tasks|leads)$/.test(e.textContent.trim()) && e.offsetParent).map(el => { let c = el; for (let k = 0; k < 5; k++) { c = c.parentElement; const bs = c.querySelectorAll('button'); if (bs.length) { const x = bs[bs.length - 1].getBoundingClientRect(); return { t: el.textContent.trim(), x: x.x + x.width / 2, y: x.y + x.height / 2 }; } } return null; }).filter(Boolean));
for (let i = 0; i < 6; i++) { const l = await xs(); if (!l.length) break; await page.mouse.click(l[0].x, l[0].y); await sleep(900); const c = page.getByRole('button', { name: /^(Remove|Delete|Confirm|Yes)/ }).last(); if (await c.count()) { await c.click().catch(() => {}); await sleep(700); } }
const left = (await txt()).match(/Associate Modules to your Teamspace[\s\S]{0,200}Permissions/)?.[0];
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await sleep(500);
const save = page.getByRole('button', { name: 'Save', exact: true }).last();
const out = { left, saveEnabled: await save.isEnabled().catch(() => null), hint: (await txt()).split('\n').filter(l => /at least one module/i.test(l)) };
await shot('1689-02-emptied');
return done(out);
