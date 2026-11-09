const o = {}; await page.setViewportSize({ width: 1600, height: 2000 });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=a01a53e7-cec9-4794-b91b-b177cbac2ee8', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 90; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && /QA NDC Agent id/.test(t)) break; }
await sleep(2000);
o.box = await page.evaluate(() => { const el = [...document.querySelectorAll('label')].find(e => /QA NDC Agent id/.test(e.textContent)); if (!el) return null; const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height), getComputedStyle(el).visibility, el.offsetParent ? 'shown' : 'hidden']; });
o.form = await shot('a6/tavi-cc-form-full');
await page.setViewportSize({ width: 1600, height: 900 });
return JSON.stringify(o);
