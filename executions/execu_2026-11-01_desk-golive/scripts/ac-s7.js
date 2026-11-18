const srcs = await page.evaluate(() => [...document.scripts].map(s => s.src).filter(Boolean)); out.hits = [];
for (const u of srcs) { const t = await (await page.context().request.get(u)).text(); for (const m of t.matchAll(/.{0,200}record_visibility.{0,200}/g)) out.hits.push(m[0].replace(/\s+/g, ' ')); }
out.hits = [...new Set(out.hits)].slice(0, 8);
return fin({ out });
