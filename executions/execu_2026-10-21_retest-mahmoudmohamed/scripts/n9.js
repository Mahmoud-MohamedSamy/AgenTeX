const src = page.locator('aside, nav, div').getByText('Formula', { exact: true }).first();
const tgt = page.getByText('Phone Permission', { exact: true }).first();
await src.dragTo(tgt); await sleep(2500);
const dl = await page.locator('[role=dialog]').allInnerTexts();
const side = (await txt()).includes('Field Properties') ? (await txt()).split('Field Properties')[1]?.slice(0, 800) : null;
await shot('1586-01-after-drop');
return done({ dl: dl.map(x => x.slice(0, 600)), side });
