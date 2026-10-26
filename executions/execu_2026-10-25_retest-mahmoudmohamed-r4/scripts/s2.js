const col = () => page.evaluate(() => [...document.querySelectorAll('div')].find(e => /overflow-y-auto/.test(e.className) && /flex-1 min-w-0/.test(e.className))?.scrollTop);
const lab = page.getByText('Quality', { exact: true }).first(); await lab.scrollIntoViewIfNeeded(); await sleep(600);
const inp = lab.locator('xpath=ancestor::label[1]//input[@type="checkbox"]').first();
const st = async () => inp.isChecked().catch(() => null);
const b = await lab.boundingBox(); const before = await col(); const st0 = await st();
await page.mouse.click(b.x + 302, b.y + b.height / 2); await sleep(1500); const mid = await col(); const st1 = await st();
await shot('1333-03-after-click');
await page.mouse.click(b.x + 302, b.y + b.height / 2); await sleep(1500); const after = await col(); const st2 = await st();
return done({ before, mid, after, st0, st1, st2, toasts: await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast]')].map(t => t.innerText.trim())) });
