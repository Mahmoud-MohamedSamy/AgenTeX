await go('/hq', 12000);
const side = (await txt()).includes('QA RT Closed') ? 'QA RT Closed visible in page text' : 'not in page text';
await shot('2220-04-samy-hq');
const plus = page.getByRole('button', { name: /^New$|Create/ }).first(); let menu = [];
if (await plus.count()) { await plus.click(); await sleep(1500); menu = await page.locator('[role=menu],[role=dialog],[role=listbox]').allInnerTexts(); await shot('2220-05-samy-plus'); await page.keyboard.press('Escape'); }
await go('/settings/modules-and-fields', 10000);
const inSettings = (await txt()).includes('QA RT Closed');
await shot('2220-06-samy-settings');
return done({ side, menu: menu.map(x => x.slice(0, 500)), inSettings });
