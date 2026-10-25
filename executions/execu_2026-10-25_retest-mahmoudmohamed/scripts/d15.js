const r = await page.evaluate(() => [...document.querySelectorAll('[title]')].map(e => e.getAttribute('title')).filter(t => /no longer|Unaccounted|Qualification|Closed_lost|Proposal/.test(t)));
await page.setViewportSize({ width: 1280, height: 720 });
return done([...new Set(r)]);
