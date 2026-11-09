const o = {}; await page.setViewportSize({ width: 1600, height: 2200 });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=a01a53e7-cec9-4794-b91b-b177cbac2ee8', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 90; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && /QA NDC Agent id/.test(t)) break; }
const ed = page.locator('button, a', { hasText: /Edit Page Layout/ }).first(); if (await ed.count()) await ed.click().catch(() => {});
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC Agent id/.test(t) && !/Loading/.test(t)) break; }
await sleep(2500);
o.rows = await page.evaluate(() => [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /^QA NDC (Agent id|Agency code|TKT number)\s*\*?$/.test(e.textContent.trim())).map(e => { const r = e.getBoundingClientRect(); return [e.textContent.trim(), Math.round(r.x), Math.round(r.y), e.parentElement.innerText.replace(/\s+/g, ' ').slice(0, 40)]; }));
o.shot = await shot('a6/tavi-cc-editor-full');
const cancel = page.locator('button', { hasText: /^Cancel$/ }).first(); if (await cancel.count()) await cancel.click().catch(() => {});
await page.setViewportSize({ width: 1600, height: 900 });
return JSON.stringify(o);
