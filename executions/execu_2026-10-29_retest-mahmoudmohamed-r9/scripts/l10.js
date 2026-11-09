const s = await page.locator('select:visible').evaluateAll(a => a.map(x => ({ sel: x.options[x.selectedIndex]?.text, opts: [...x.options].map(o => o.text).slice(0, 15) })));
return done({ s: s.slice(4) });
