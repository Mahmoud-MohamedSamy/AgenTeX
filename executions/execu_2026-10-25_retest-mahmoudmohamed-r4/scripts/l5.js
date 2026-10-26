await page.mouse.click(357, 82); await sleep(1500);
const dlg = await page.evaluate(() => (document.querySelector('[role=dialog]') || document.querySelector('[data-radix-popper-content-wrapper]'))?.innerText.slice(0, 400) || null);
const inputs = await page.evaluate(() => [...document.querySelectorAll('input')].filter(i => i.offsetParent).map(i => (i.getAttribute('aria-label') || i.placeholder || i.name) + '=' + i.value).slice(0, 10));
await shot('1335-04-layout-settings');
return done({ dlg, inputs, fieldsShown: (await txt()).split('Basic Information')[1]?.slice(0, 200) });
