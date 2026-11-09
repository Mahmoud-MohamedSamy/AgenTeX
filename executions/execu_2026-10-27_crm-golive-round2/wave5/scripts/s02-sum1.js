await page.goto(H + '/reports/view/564a6465-eba0-4bea-97d2-7bab1412f6fc', { waitUntil: 'domcontentloaded' }); await sleep(9000);
await page.locator('main button[aria-label="Report actions"]').first().click(); await sleep(800);
await page.locator('[role=menuitem]', { hasText: /^Edit design$/ }).first().click(); await sleep(6000);
const rg = page.locator('xpath=//*[normalize-space(text())="No group selected"]/ancestor::div[.//button][1]//button').first();
await rg.click(); await sleep(1500);
await shot('s02-rowgroup-editor');
const d = page.locator('[role=dialog]').first();
return { txt: (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 1500), url: page.url().replace(H, '') };
