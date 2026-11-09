const o = {}; const dlg = page.locator('[role=dialog]');
await dlg.locator('label', { hasText: /^QA NDC Accounting$/ }).first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(800);
o.checked = await dlg.locator('label', { hasText: /^QA NDC Accounting$/ }).locator('input').isChecked().catch(() => null);
await dlg.locator('button', { hasText: /^Save$/ }).click().catch(e => o.e2 = e.message.slice(0, 60));
let t = ''; for (let i = 0; i < 10; i++) { await sleep(700); t = (await txt()).replace(/\s+/g, ' '); if (/already|only one|taken|use one/i.test(t)) break; }
o.msg = t.match(/.{0,120}(already|only one|taken)[^.]{0,120}/i)?.[0];
o.shot = await shot('m17/tavi-adm-refused');
o.dialogOpen = await dlg.count();
return JSON.stringify(o);
