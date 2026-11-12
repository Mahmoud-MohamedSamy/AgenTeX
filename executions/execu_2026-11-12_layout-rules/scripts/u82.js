async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  for (const [k, id] of [['partner', '2ca6bc00-4cbd-4d73-9f0c-08805e783556'], ['question', 'b0820d1f-bf72-4699-b121-0c2dbf0458a9']]) { await openRec(mid, id); await page.mouse.wheel(0, 3000); await sleep(2000); R[k] = await page.evaluate(() => [...document.querySelectorAll('h2,h3,h4,button')].map(e => e.innerText.trim()).filter(s => /^(Customers|Transactions|Agency Code|Related)/.test(s)).slice(0, 8)); await shot('crm-F21-' + k); }
  return R; }
