await page.locator('button', { hasText: /^Add component$/ }).first().click(); await sleep(2500);
await shot('s03-add-component');
const t = (await page.locator('[role=dialog], [role=menu]').first().innerText().catch(() => page.innerText('main'))).replace(/\s+/g, ' ');
return { text: t.slice(0, 2000) };
