const o = {};
await go('/settings/automation/workflow-rules'); await page.getByText('Execution History').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(3000);
await page.getByText('Execution History', { exact: true }).first().click(); await sleep(8000);
o.url = page.url();
const search = page.getByPlaceholder(/search/i).first(); if (await search.count()) { await search.fill('QA WF 3186'); await sleep(5000); }
o.text = (await page.locator('main').first().innerText().catch(() => '')).slice(0, 2500);
await shot('ui16-O-exec-history');
o.rows = await page.locator('main tr, main [role=row]').evaluateAll(es => es.filter(e => /3186/.test(e.innerText)).map(e => { const r = e.getBoundingClientRect(); return { y: Math.round(r.y), h: Math.round(r.height), x: Math.round(r.x), w: Math.round(r.width), t: e.innerText.replace(/\s+/g, ' ').slice(0, 200) }; }));
return o;
