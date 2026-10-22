const MID = 'c0394292-52a2-446d-a326-06733fe289ba', LID = '83c29e1a-37f1-4a43-b6b2-33a47cb4b666';
await builder(MID, LID); for (let i = 0; i < 30 && !(await page.getByText('QA MF rx', { exact: true }).count()); i++) await sleep(1500);
await page.getByRole('button', { name: 'Layout settings' }).click(); await sleep(800);
await page.getByText('Field Dependency', { exact: true }).click(); await sleep(2500);
const d0 = (await page.locator('[role=dialog]').allInnerTexts()).join('|').slice(0, 600);
await shot('2245-01-two-rules');
const del = page.locator('[role=dialog] button[aria-label*="elete" i], [role=dialog] button[title*="elete" i], [role=dialog] button:has(svg.lucide-trash-2), [role=dialog] button:has(svg.lucide-trash)');
const n0 = await del.count(); for (let i = 0; i < n0; i++) { await del.first().click(); await sleep(700); const cf = page.getByRole('button', { name: /^(Delete|Remove|Yes)/ }).last(); if (await cf.count() && await cf.isVisible()) { await cf.click(); await sleep(500); } }
const d1 = (await page.locator('[role=dialog]').allInnerTexts()).join('|').slice(0, 400);
await shot('2245-02-deleted');
const c = capOn();
const sr = page.getByRole('button', { name: /Save Rules/ }); if (await sr.count()) { await sr.click(); await sleep(1500); }
const sv = page.getByRole('button', { name: /^Save$/ }); if (await sv.isEnabled()) { await sv.click(); for (let i = 0; i < 15; i++) { await sleep(1500); if (!/Saving/.test(await txt())) break; } }
c();
const after = (await getLayout(MID, LID)).dependencies;
return done({ n0, d0, d1, cap: cap.map(x => x.slice(0, 120) + (x.includes('"dependencies":[]') ? ' [deps:[]]' : x.includes('dependencies') ? ' [deps present]' : '')), depsAfter: (after || []).length });
