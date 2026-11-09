const o = {};
const mr = page.locator('[role=menuitem], button, div', { hasText: /^Mark as Required$/ }).last(); o.mr = await mr.count(); if (o.mr) { await mr.click().catch(e => o.e1 = e.message.slice(0, 60)); await sleep(2000); }
o.dialog = (await page.$$eval('[role=dialog], [role=alertdialog]', d => d.map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 300)))).slice(0, 2);
o.shotMarked = await shot('a6/tavi-layout-marked');
const ok = page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /^(OK|Confirm|Yes|Mark|Save|Continue)$/ }).first(); if (await ok.count()) { await ok.click().catch(() => {}); await sleep(1500); }
const save = page.locator('button', { hasText: /^Save$/ }).last(); await save.click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(5000);
o.after = (await txt()).replace(/\s+/g, ' ').match(/.{0,80}(saved|Saved|error|Error|required).{0,80}/g)?.slice(0, 5);
o.shotSaved = await shot('a6/tavi-layout-saved');
return JSON.stringify(o);
