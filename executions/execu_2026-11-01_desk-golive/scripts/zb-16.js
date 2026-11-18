await openT(page, T109); out.spamState = (await body(page)).includes('marked as spam');
if (out.spamState) { await page.getByText('Not Spam', { exact: true }).last().click(); await page.waitForTimeout(3000); out.after = (await body(page)).includes('marked as spam'); }
await more(page, 'Apply Macro'); await page.waitForTimeout(3000); out.macro = (await body(page)).match(/.{0,40}[Mm]acro.{0,300}/g)?.slice(-1)[0]; await shotZ(page, 'macro');
