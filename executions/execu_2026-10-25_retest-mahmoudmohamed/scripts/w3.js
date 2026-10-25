await page.getByRole('button', { name: 'Filter', exact: true }).click(); await sleep(2000);
const t0 = (await txt()).split('Refresh')[1]?.slice(0, 800);
await shot('1788-01-filter-open');
return done({ t0, inputs: await page.locator('input').evaluateAll(es => es.map(e => e.placeholder).filter(Boolean)), btns: await page.locator('main button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 30)).filter(Boolean).slice(10, 30)) });
