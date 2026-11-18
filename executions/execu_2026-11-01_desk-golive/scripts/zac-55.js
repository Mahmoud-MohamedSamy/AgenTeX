await page.mouse.click(1555, 315); await page.waitForTimeout(3000); out.d1 = (await body(page)).replace(/\s+/g, ' ').match(/.{0,100}(Delete|Reassign).{0,300}/)?.[0]; await shotZ(page, 'ac2-team-del');
const b = page.getByText(/Reassign and Delete|^Delete$|Yes, Delete/).last(); out.nb = await b.count(); if (out.nb) { await b.click().catch(() => {}); await page.waitForTimeout(4000); }
out.left = (await body(page)).includes('QA AC2 Control Team');
