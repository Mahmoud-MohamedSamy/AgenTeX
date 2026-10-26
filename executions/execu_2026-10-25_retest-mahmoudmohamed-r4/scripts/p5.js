await page.keyboard.press('Escape'); await sleep(400);
const lab = page.getByText('Stage', { exact: true }).first(); await lab.scrollIntoViewIfNeeded(); await sleep(500);
const b = await lab.boundingBox();
await shot('1302-03b-stage-row');
return done({ b, val: await page.getByPlaceholder('Deal name').inputValue() });
