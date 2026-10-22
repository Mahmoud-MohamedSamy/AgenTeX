for (let i = 0; i < 40 && /Loading Leads/.test(await txt()); i++) await sleep(1500);
await shot('g9-leads');
const btn = page.locator('button:has(svg.lucide-ellipsis)').filter({ hasNot: page.locator('[aria-label]') });
const hdr = await page.locator('main button').evaluateAll(es => es.slice(0, 12).map(e => (e.getAttribute('aria-label') || e.innerText || '').slice(0, 30)));
return done({ t: (await txt()).split('Meetings')[1]?.slice(0, 300), hdr });
