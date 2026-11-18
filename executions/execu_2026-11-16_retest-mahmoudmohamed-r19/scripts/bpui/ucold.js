const r = {};
let t0 = Date.now(); await page.goto(H + (process.env.FIRST || '/settings/automation/blueprints/cca267b4-989c-47e8-8fa2-70b9d5935626'), { waitUntil: 'domcontentloaded' }); r.dcl = Date.now() - t0;
await page.locator(process.env.SEL || '.react-flow__node').nth(+(process.env.NTH || 2)).waitFor({ timeout: 180000 }); r.coldMs = Date.now() - t0;
t0 = Date.now(); await page.goto(H + '/settings/automation/blueprints/d03c1921-889a-40bb-b8d4-55b269e595f8', { waitUntil: 'domcontentloaded' }); await page.locator('.react-flow__node').nth(29).waitFor({ timeout: 180000 }); r.largeAfterMs = Date.now() - t0;
return r;
