const rows = page.locator('table tbody tr'); const out = [];
for (let i = 0; i < await rows.count(); i++) { const r = rows.nth(i); out.push({ col: (await r.locator('td').first().innerText()).trim(), sel: await r.locator('select').first().evaluate(x => x.options[x.selectedIndex].text), opts: (await r.locator('select').first().evaluate(x => [...x.options].map(o => o.text))).filter(o => /name|phone|percent/i.test(o)).slice(0, 12) }); }
return done(out);
