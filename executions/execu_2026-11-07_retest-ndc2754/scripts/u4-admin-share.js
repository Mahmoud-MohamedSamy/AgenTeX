const o = {}; const T5 = 'e2703099-5639-4265-afe4-8598c2bc3f38';
await page.goto(H + '/views/all/tickets/' + T5, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 50; i++) { await sleep(3000); if (/t5 own dept/.test(await text()) && /QA alt/.test(await text())) break; } await sleep(3000);
await page.getByRole('button', { name: /QA alt/ }).first().click(); for (let i = 0; i < 20; i++) { await sleep(2000); if (!/Loading the ticket's shares/.test(await text())) break; } await sleep(2000);
o.form = ((await text()).match(/Moves the ticket to Closed[\s\S]{0,500}/) || [''])[0];
o.selects = await page.locator('select').evaluateAll(a => a.map(s => [...s.options].map(x => x.text).join(' | ')));
o.btns = await page.locator('button, [role=combobox]').evaluateAll(a => a.map(b => b.innerText.trim()).filter(x => /share|department|add/i.test(x)).slice(0, 10));
await shot('b2-admin-share-form.png');
const add = page.getByRole('button', { name: /Add (a )?department|Share with|Add share|Choose department/i }).first(); if (await add.count()) { await add.click(); await sleep(2000); await shot('b3-admin-share-picker.png'); o.picker = (await page.locator('[role=listbox], [role=menu], [role=dialog]').last().innerText().catch(() => '')).slice(0, 600); }
return o;
