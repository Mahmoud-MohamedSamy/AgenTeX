async (page) => { const R = {}; const dm = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
  await openRec(dm, '17c034c8-e25c-42de-996e-2501ae196764'); R.btns = (await page.getByRole('button').allInnerTexts()).map(s => s.trim()).filter(s => /qualif|negotiat|needs|proposal|stage|closed/i.test(s)).slice(0, 15); await shot('crm-G9-record', false); return R; }
