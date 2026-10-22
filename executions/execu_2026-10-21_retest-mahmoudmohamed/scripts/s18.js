const MID = 'c0394292-52a2-446d-a326-06733fe289ba', LID = '83c29e1a-37f1-4a43-b6b2-33a47cb4b666';
await builder(MID, LID); for (let i = 0; i < 30 && !(await page.getByText('QA MF rx', { exact: true }).count()); i++) await sleep(1500);
await page.getByRole('button', { name: 'Layout settings' }).click(); await sleep(800);
await page.getByText('Field Dependency', { exact: true }).click(); await sleep(2500);
const row = page.getByText(/When .*QA MF pl/).first(); await row.locator('xpath=ancestor::div[.//button][1]').locator('button').last().click(); await sleep(1500); const ruleBody = (await txt()).match(/Field Dependency[sS]{0,120}/)?.[0];
const t1 = (await txt()).match(/Field Dependency[\s\S]{0,200}/)?.[0];
await shot('2245-04-all-deleted');
const c = capOn();
await page.getByRole('button', { name: 'Save Rules' }).click(); await sleep(1500);
const sv = page.getByRole('button', { name: /^Save$/ }); const en = await sv.isEnabled(); if (en) { await sv.click(); for (let i = 0; i < 15; i++) { await sleep(1500); if (!/Saving/.test(await txt())) break; } }
c();
const after = (await getLayout(MID, LID)).dependencies;
await page.reload({ waitUntil: 'commit' }).catch(() => {}); for (let i = 0; i < 30 && !(await page.getByText('QA MF rx', { exact: true }).count()); i++) await sleep(1500);
await page.getByRole('button', { name: 'Layout settings' }).click(); await sleep(800); await page.getByText('Field Dependency', { exact: true }).click(); await sleep(2500);
const t2 = (await txt()).match(/Field Dependency[\s\S]{0,200}/)?.[0];
await shot('2245-05-after-reload-empty');
return done({ ruleBody, t1, en, cap: cap.map(x => x.slice(0, 100) + (x.includes('"dependencies":[]') ? ' [deps:[]]' : x.includes('"dependencies"') ? ' [deps present]' : ' [no deps key]')), depsAfter: (after || []).length, t2 });
