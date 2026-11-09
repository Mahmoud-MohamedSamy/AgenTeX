const srcs = await page.evaluate(() => [...document.scripts].map(s => s.src).filter(Boolean));
const out = []; const seen = new Set();
const fetchJs = async u => (await page.context().request.get(u)).text();
const q = [...srcs];
for (let i = 0; i < q.length && i < 400; i++) { const u = q[i]; if (seen.has(u)) continue; seen.add(u); let t = ''; try { t = await fetchJs(u); } catch (e) { continue; }
  for (const m of t.matchAll(/["'](\.?\.?\/?[\w./-]*?\.js)["']/g)) { if (/assets|chunk|\.js$/.test(m[1]) && m[1].length < 120) { try { const nu = new URL(m[1], u).href; if (nu.startsWith(H) && !seen.has(nu)) q.push(nu); } catch (e) {} } }
  let k = 0; for (const m of t.matchAll(/private_?[tT]hread/g)) { if (k++ > 6) break; out.push(u.split('/').pop() + ' :: ' + t.slice(Math.max(0, m.index - 220), m.index + 260).replace(/\s+/g, ' ')); } }
return done({ scanned: seen.size, hits: out.filter(x => /incoming|outgoing|direction/i.test(x)).slice(0, 8) });
