await sleep(2000); await shot('2281-00-leads');
return done({ url: page.url(), btns: await page.locator('button').evaluateAll(b => b.map(x => (x.innerText || x.getAttribute('aria-label') || '').trim()).filter(Boolean).slice(0, 60)) });
