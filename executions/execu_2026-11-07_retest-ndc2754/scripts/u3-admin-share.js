const o = {}; const T5 = 'e2703099-5639-4265-afe4-8598c2bc3f38';
await page.goto(H + '/views/all/tickets/' + T5, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 50; i++) { await sleep(3000); if (/t5 own dept/.test(await text()) && /QA alt/.test(await text())) break; } await sleep(3000);
await page.getByRole('button', { name: /QA alt/ }).first().click(); await sleep(4000); await shot('b1-admin-alt-share-form.png');
const area = page.locator('text=QA alt').last().locator('xpath=ancestor::*[self::section or self::form or self::div][4]');
o.selects = await page.locator('select').evaluateAll(a => a.map(s => [...s.options].map(x => x.text).join(' | ')).filter(t => /Dept|Department|QA RT13/i.test(t)));
const combos = page.getByRole('combobox'); o.combos = await combos.count();
o.formText = ((await text()).match(/QA alt[\s\S]{0,500}/g) || []).pop()?.slice(0, 500);
return o;
