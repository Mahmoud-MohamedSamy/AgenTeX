await page.getByRole('button', { name: 'Cancel', exact: true }).first().click().catch(() => {}); await sleep(800);
await page.locator('button').filter({ hasText: /^Default$/ }).first().click().catch(async () => { await page.getByText('Default', { exact: true }).first().click(); }); await sleep(1200);
const pop = await page.locator('[role=menu],[role=listbox],[role=dialog]').allInnerTexts();
await shot('2254-01-layout-switcher');
return done({ pop: pop.map(x => x.slice(0, 400)) });
