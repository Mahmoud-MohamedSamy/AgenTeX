await page.mouse.move(258, 372); await page.mouse.down(); await sleep(200);
for (let i = 1; i <= 25; i++) { await page.mouse.move(258 + (580 - 258) * i / 25, 372 + (470 - 372) * i / 25); await sleep(40); }
await sleep(300); await page.mouse.up(); await sleep(2500);
const side = (await txt()).includes('Field Properties') ? (await txt()).split('Field Properties')[1]?.slice(0, 1200) : null;
await shot('1586-01-after-drop');
return done({ side, dirty: await page.getByRole('button', { name: 'Save', exact: true }).isEnabled() });
