await shot('_peek'); const b = []; for (const e of await page.locator('button, [role=combobox], input').all()) { const l = (await e.getAttribute('aria-label')) || (await e.getAttribute('placeholder')) || (await e.innerText().catch(() => '')).trim(); if (l && l.length < 60) b.push(l); }
return done({ url: page.url(), b: [...new Set(b)].slice(0, 60) });
