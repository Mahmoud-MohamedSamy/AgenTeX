await openT(page, T109);
await more(page, 'Apply Macro'); await page.waitForTimeout(3000); out.macro = (await body(page)).match(/.{0,40}[Mm]acro.{0,300}/g)?.slice(-1)[0]; await shotZ(page, 'macro');
await page.keyboard.press('Escape');
// Print / Copy link / layout / archive / merge controls anywhere on the detail page
out.ctrls = await page.locator('[data-title],[title],[aria-label]').evaluateAll(es => [...new Set(es.filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-title') || e.getAttribute('title') || e.getAttribute('aria-label')).filter(s => /print|copy|link|layout|archive|merge|permalink/i.test(s || '')))]);
