const R = {};
// G9 deal stage bar
await openRec(DM, I.dealRec); R.stageBtns = (await page.getByRole('button').allInnerTexts()).map(s => s.trim()).filter(s => /qualif|negotiat|proposal|closed|needs/i.test(s)).slice(0, 12);
await shot('2976-0-deal.png');
const nb = page.getByRole('button', { name: /^Negotiation/ }).first(); R.nb = await nb.count(); R.bNb = await box(nb);
if (R.nb) { await nb.click(); await sleep(3500); const d = page.locator('[role=dialog],[role=alertdialog]').first(); R.dlg = await d.count(); if (R.dlg) { R.dlgTxt = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 500); R.bDlg = await box(d); } R.toast = await grab(/[^.]{0,60}(required|Review|updated|approval note)[^.]{0,80}/gi); await shot('2976-1-click-negotiation.png'); }
return R;
