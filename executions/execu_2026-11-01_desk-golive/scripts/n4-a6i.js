const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=a01a53e7-cec9-4794-b91b-b177cbac2ee8', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 90; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && /QA NDC Agent id/.test(t)) break; }
await sleep(1500);
o.found = await page.evaluate(() => { const el = [...document.querySelectorAll('label, span, div')].find(e => e.children.length <= 2 && /QA NDC Agent id/.test(e.textContent) && e.textContent.length < 40); if (!el) return false; el.scrollIntoView({ block: 'center' }); return el.textContent; });
await sleep(1200); const c = page.locator('button', { hasText: /^Set up now$/ }); if (await c.count()) { await page.locator('text=Set up two-factor authentication').locator('xpath=..').locator('..').locator('button').last().click().catch(()=>{}); }
await sleep(600); o.form = await shot('a6/tavi-cc-form-agentid');
return JSON.stringify(o);
