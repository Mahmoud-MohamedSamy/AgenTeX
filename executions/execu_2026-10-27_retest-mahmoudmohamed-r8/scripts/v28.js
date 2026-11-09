const out = {}; const rb = await page.getByText('Active statues', { exact: true }).first().boundingBox();
await page.mouse.click(1098, rb.y + rb.height / 2); await sleep(1200); await shot('v28-checkbox-clicked');
out.checkedNames = await page.evaluate(() => [...document.querySelectorAll('input[type=checkbox],[role=checkbox],button[aria-checked]')].filter(c => (c.checked || c.getAttribute('aria-checked') === 'true') && c.getBoundingClientRect().y > 120 && c.getBoundingClientRect().y < 420).map(c => (c.closest('label,li,div[class]')?.innerText || '').split('\n')[0].trim()));
out.bar = (await txt()).split('\n').filter(l => /unsaved|Save|Discard|Cancel/i.test(l)).slice(0, 4);
await page.mouse.click(1098, rb.y + rb.height / 2); await sleep(1000);
out.afterUndo = await page.evaluate(() => [...document.querySelectorAll('input[type=checkbox],[role=checkbox],button[aria-checked]')].filter(c => (c.checked || c.getAttribute('aria-checked') === 'true') && c.getBoundingClientRect().y > 120 && c.getBoundingClientRect().y < 420).map(c => (c.closest('label,li,div[class]')?.innerText || '').split('\n')[0].trim()));
return done(out);
