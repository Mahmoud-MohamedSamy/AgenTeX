if (!(await page.getByText('Edit Properties', { exact: true }).count())) { await page.mouse.click(1201, 617); await sleep(1000); }
await page.getByText('Edit Properties', { exact: true }).first().click(); await sleep(1500);
const d = await page.evaluate(() => { const x = document.querySelector('[role=dialog]'); return x ? { text: x.innerText.slice(0, 900), btns: [...x.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.innerText).trim()).slice(0, 30), inputs: [...x.querySelectorAll('input')].map(i => (i.getAttribute('aria-label') || i.placeholder) + '=' + i.value).slice(0, 15) } : null; });
await shot('2120-01-props');
return done({ d });
