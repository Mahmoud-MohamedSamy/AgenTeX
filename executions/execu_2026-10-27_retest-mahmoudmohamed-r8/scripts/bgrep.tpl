// Bundle search (read-only): returns code around each match of PAT in the app's JS.
const PAT = new RegExp(__PAT__, 'g'); const W = __W__;
const srcs = await page.evaluate(() => [...document.querySelectorAll('script[src],link[rel=modulepreload]')].map(s => s.src || s.href));
const seen = new Set(), q = [...srcs], hits = [];
for (let i = 0; i < q.length && i < 400; i++) { const u = q[i]; if (!u || seen.has(u)) continue; seen.add(u); let t = ''; try { t = await (await page.context().request.get(u)).text(); } catch (e) { continue; }
  for (const m of t.matchAll(/import\(["'`]([^"'`]+\.js)["'`]\)|from["'`]([^"'`]+\.js)["'`]|["'`](\.\/[\w.-]+\.js)["'`]/g)) { const p = m[1] || m[2] || m[3]; try { const nu = new URL(p, u).href; if (!seen.has(nu)) q.push(nu); } catch (e) {} }
  for (const m of t.matchAll(PAT)) { if (hits.length < 12) hits.push(u.split('/').pop() + ' :: ' + t.slice(Math.max(0, m.index - W), m.index + W).replace(/\s+/g, ' ')); } }
return done({ scanned: seen.size, hits });
