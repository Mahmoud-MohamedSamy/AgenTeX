const o = {}; const T5 = 'e2703099-5639-4265-afe4-8598c2bc3f38';
await page.goto(H + '/views/all/tickets/' + T5, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 50; i++) { await sleep(3000); if (/t5 own dept/.test(await text()) && /QA alt/.test(await text())) break; } await sleep(3000);
await page.getByRole('button', { name: /QA alt/ }).first().click(); for (let i = 0; i < 20; i++) { await sleep(2000); if (/Add department/.test(await text())) break; }
await page.getByRole('button', { name: /Add department/ }).first().click(); await sleep(1500);
await page.getByText('Choose a department').first().click(); await sleep(2500); await shot('b4-admin-dept-options.png');
const opts = await page.locator('[role=option], [role=listbox] li, [cmdk-item]').evaluateAll(a => a.map(x => x.innerText.trim()));
o.n = opts.length; o.hasOwn = opts.some(x => /QA RT13 2754 Dept A/.test(x)); o.hasB = opts.some(x => /QA RT13 2754 Dept B/.test(x)); o.sample = opts.slice(0, 8);
const s = page.locator('input[placeholder*=earch]').last(); if (await s.count()) { await s.fill('QA RT13'); await sleep(1500); await shot('b5-admin-dept-search.png'); o.search = await page.locator('[role=option]').evaluateAll(a => a.map(x => x.innerText.trim())); }
return o;
