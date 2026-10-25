const th = page.locator('thead th').nth(3);
const html = await th.evaluate(e => e.outerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '<svg/>').replace(/class="[^"]{60,}"/g, m => m.slice(0, 70) + '"').slice(0, 1200));
const handles = await page.locator('thead [role=separator], thead [data-resize-handle], thead [class*=resize]').count();
await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); const menu = (await page.locator('[role=menu],[role=dialog]').allInnerTexts()).join('|'); await page.keyboard.press('Escape');
return done({ html, handles, menu });
