await page.keyboard.press('Escape');
await page.goto(H + '/settings/modules-and-fields/b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', { waitUntil: 'domcontentloaded' }); await sleep(6000);
await shot('c02-140-disabled');
return { b: await page.locator('button[aria-label="Toggle QA R2W5 Layout B status"]').getAttribute('aria-checked') };
