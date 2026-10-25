const out = {};
for (const tab of ['GENERAL', 'VALIDATION', 'ADVANCED']) { await page.getByText(tab, { exact: true }).click(); await sleep(900); out[tab] = await page.evaluate(() => [...document.querySelectorAll('input, textarea')].filter(i => i.getBoundingClientRect().left > 820).map(i => (i.getAttribute('aria-label') || i.placeholder || i.type) + '=' + i.value).slice(0, 20)); await shot('2120-02-tab-' + tab); }
return done(out);
