await go('/hq', 8000);
const srcs = await page.evaluate(() => [...document.scripts].map(s => s.src).filter(Boolean)); const seen = new Set(); const q = [...srcs]; const hits = new Set();
for (let i = 0; i < q.length && i < 300; i++) { const u = q[i]; if (seen.has(u)) continue; seen.add(u); let t = ''; try { t = await (await page.context().request.get(u)).text(); } catch (e) { continue; }
  for (const m of t.matchAll(/["'`](\.?\.?\/?[\w./-]*?\.js)["'`]/g)) { try { const nu = new URL(m[1], u).href; if (nu.startsWith(H) && !seen.has(nu)) q.push(nu); } catch (e) {} }
  for (const m of t.matchAll(/[`"'][^`"']{0,40}(unassign|pick-?up|\/assign|\/move)[^`"']{0,40}[`"']/g)) hits.add(m[0].slice(0, 90)); }
return done({ scanned: seen.size, hits: [...hits].slice(0, 40) });
