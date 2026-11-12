async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  for (const [k, id] of [['partner', '2ca6bc00-4cbd-4d73-9f0c-08805e783556'], ['question', 'b0820d1f-bf72-4699-b121-0c2dbf0458a9']]) { await openRec(mid, id); const t = await bodyText(); R[k] = { customers: (t.match(/Customers[^.]{0,40}/g) || []).slice(0, 4), tabs: (await page.getByRole('tab').allInnerTexts()).slice(0, 12) }; await shot('crm-F21-' + k); }
  return R; }
