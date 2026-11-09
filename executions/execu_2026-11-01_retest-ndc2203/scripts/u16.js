await go('/views/all/tickets/ba4b6f09-10fa-41be-bc02-e23054259046', 12000);
await page.getByText(/^history$/i).first().click({ force: true }); await sleep(3500);
let found = ''; for (let i = 0; i < 12 && !found; i++) { await page.mouse.move(950, 500); await page.mouse.wheel(0, 400); await sleep(700); const t = await txt(); const k = t.indexOf('Workflow rule ran'); if (k >= 0) found = t.slice(k - 120, k + 260); }
await shot('f4-history-rule-ran');
return fin({ found });
