const b = page.getByRole('button', { name: 'Criteria field' }).first(); const id = await b.getAttribute('aria-controls');
return done(await page.evaluate(id => document.getElementById(id)?.innerText.split('\n').map(x => x.trim()).filter(Boolean), id));
