const rb = await page.getByText('Lookup Contacts', { exact: true }).first().boundingBox(); await page.mouse.move(rb.x + 100, rb.y + 5); await sleep(600);
const rm = page.locator('button[aria-label="Remove from Layout"]:visible'); let k = -1; for (let i = 0; i < await rm.count(); i++) { const bb = await rm.nth(i).boundingBox(); if (bb && Math.abs(bb.y - rb.y) < 30) { k = i; break; } }
await rm.nth(k).click({ force: true }); await sleep(1500);
const d = page.locator('[role=dialog], [role=alertdialog]').last(); await shot('1863-02-remove-dialog');
return done({ text: (await d.innerText()).slice(0, 600), buttons: await d.locator('button, [role=radio], label').evaluateAll(b => b.map(x => x.innerText.trim()).filter(Boolean)) });
