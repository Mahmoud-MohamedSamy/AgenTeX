await page.getByText('Fields', { exact: true }).first().click().catch(() => {}); await sleep(2000);
await page.getByText('Field Listing', { exact: true }).first().click(); await sleep(3000);
const tb = await page.evaluate(() => [...document.querySelectorAll('main button, main select, main [role=combobox], main input, #main-content button, #main-content input, #main-content select')].filter(e => e.offsetParent && e.getBoundingClientRect().top < 330).map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || e.placeholder || '') + ' | ' + (e.innerText || e.value || '').trim()).slice(0, 60)));
const rows = await page.locator('tbody tr').count();
await shot('1598-01-field-listing');
return done({ tb, rows });
