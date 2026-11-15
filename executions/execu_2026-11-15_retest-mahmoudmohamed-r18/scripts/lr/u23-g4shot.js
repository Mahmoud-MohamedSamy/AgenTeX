const R = {};
await openRec(MID, I.massA); const row = page.locator('div.group', { has: page.getByText('QA RT18 type', { exact: true }) }).first(); await row.scrollIntoViewIfNeeded(); await sleep(800);
const ord = page.getByText('QA RT18 G4 order').first(); R.ordN = await ord.count(); if (R.ordN) await ord.scrollIntoViewIfNeeded(); await sleep(600);
await shot('2975-4-saved.png'); R.bType = await box(row); R.bOrder = await box(ord); R.bTypeVal = await box(page.getByText('Refund', { exact: true }).first());
R.tl = await grab(/QA RT18 (type|order) was updated[^.]{0,80}/g, 4);
return R;
