const o = { hits: [] }; const b = await page.evaluate(() => [...document.querySelectorAll('script[src]')].map(s => s.src));
for (const src of b) { const t = await (await fetch(src)).text().catch(() => ''); const m = t.match(/.{0,90}(signature|Signature).{0,90}/g) || []; o.hits.push(...m.filter(x => /\/mail|\/desk|company|required|tenant|org/i.test(x)).slice(0, 40)); }
o.hits = [...new Set(o.hits)].slice(0, 40); return done(o);
