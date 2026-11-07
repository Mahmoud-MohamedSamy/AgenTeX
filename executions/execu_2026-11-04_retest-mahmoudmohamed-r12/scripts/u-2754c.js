const o = {};
await page.goto(H + '/settings/automation/blueprints/26fe5891-2d81-4743-8802-9cb63d133a36', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Save and Publish/.test(await text())) break; } await sleep(5000);
await page.getByRole('button', { name: 'Edit', exact: true }).first().click(); await sleep(4000);
await shot('2754-c-edit.png'); const d = page.getByRole('dialog').last(); o.edit = (await d.innerText().catch(async () => (await text()).slice(-2500))).slice(0, 2500);
await page.keyboard.press('Escape'); await sleep(1500);
await page.getByRole('button', { name: 'QA end', exact: true }).first().click(); await sleep(4000);
await shot('2754-d-transition.png'); o.tr = (await text()).slice(-2500);
return o;
