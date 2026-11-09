const o = {}; await page.mouse.click(371, 777); await sleep(800);
await page.locator('button', { hasText: /^\s*Save\s*$/ }).last().click({ timeout: 10000 }).catch(e => o.e = e.message.slice(0, 60)); await sleep(4000);
o.msg = (await txt()).replace(/\s+/g, ' ').match(/.{0,60}(saved|updated|Error|error)[^.]{0,60}/i)?.[0];
await page.reload({ waitUntil: 'commit' }); for (let i = 0; i < 30; i++) { await sleep(1500); const t = await txt(); if (/WHEN/.test(t) && /QA RT 2793/.test(t)) break; }
await sleep(1500); o.when = (await txt()).replace(/\s+/g, ' ').match(/This rule will be executed[^.]{0,200}/)?.[0];
await page.locator('text=/This rule will be executed/').first().click().catch(() => {}); await sleep(3000);
o.checkedAfterReload = await page.evaluate(() => { const l = [...document.querySelectorAll('label')].find(x => /Also run when a record is created/.test(x.innerText)); const i = l && (l.querySelector('input') || document.getElementById(l.htmlFor)); return i ? i.checked : null; });
o.shot = await shot('rt/2793-reloaded');
return JSON.stringify(o);
