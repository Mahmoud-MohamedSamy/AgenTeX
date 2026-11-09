await page.getByText(/assign owner to/i).first().scrollIntoViewIfNeeded(); await page.mouse.wheel(0, 250); await sleep(1200); await shot('d1-owner-card-team');
const t = (await txt()).split('\n').filter(l => l.trim()); const i = t.findIndex(l => /assign owner to/i.test(l));
return fin({ seg: t.slice(i, i + 14) });
