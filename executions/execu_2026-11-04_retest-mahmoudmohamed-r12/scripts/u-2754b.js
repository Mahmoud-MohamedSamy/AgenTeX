const o = {};
await page.goto(H + '/settings/automation/blueprints/26fe5891-2d81-4743-8802-9cb63d133a36', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Save and Publish/.test(await text())) break; } await sleep(5000);
await shot('2754-b-designer.png');
o.buttons = (await page.getByRole('button').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 60);
o.aria = await page.locator('button[aria-label]').evaluateAll(els => els.map(e => e.getAttribute('aria-label')).slice(0, 60));
return o;
