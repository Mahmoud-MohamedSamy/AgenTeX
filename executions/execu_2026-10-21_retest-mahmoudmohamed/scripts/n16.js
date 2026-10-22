const all = await page.locator('select').evaluateAll(es => es.map(s => s.options[s.selectedIndex]?.text + ' :: ' + [...s.options].map(o => o.text).slice(0, 14).join('|')));
return done({ all, side: (await txt()).split('Field Properties')[1]?.slice(0, 900) });
