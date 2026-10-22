await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(1500);
await shot('1444-06-save-click');
const alerts = await page.locator('[role=alert], [role=status], [data-sonner-toast], .text-red-500, [aria-invalid=true]').evaluateAll(es => es.map(e => (e.innerText || e.getAttribute('aria-label') || '').slice(0, 200)).filter(Boolean));
const errs = await page.evaluate(() => [...document.querySelectorAll('*')].filter(e => e.childElementCount === 0 && /required|cannot|must|error|invalid/i.test(e.textContent) && e.offsetParent).map(e => e.textContent.trim().slice(0, 160)).slice(0, 15));
return done({ alerts, errs });
