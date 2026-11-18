const P = process.env.PAGE === 'tickets' ? '/views/all/tickets' : '/settings/automation/blueprints/d03c1921-889a-40bb-b8d4-55b269e595f8';
const r = { page: process.env.PAGE || 'large-bp' }; const t0 = Date.now();
await page.goto(H + P, { waitUntil: 'commit', timeout: 180000 }); r.commit = Date.now() - t0;
await page.waitForLoadState('domcontentloaded', { timeout: 180000 }); r.dcl = Date.now() - t0;
await page.getByText('Knowledge Base').first().waitFor({ timeout: 180000 }); r.shell = Date.now() - t0;
if (r.page === 'tickets') { await page.getByText('All Tickets').first().waitFor({ timeout: 180000 }); r.content = Date.now() - t0; }
else { await page.locator('.react-flow__node').first().waitFor({ timeout: 180000 }); r.firstNode = Date.now() - t0; await page.locator('.react-flow__node').nth(29).waitFor({ timeout: 180000 }); r.designer30 = Date.now() - t0; }
const perf = await page.evaluate(() => { const res = performance.getEntriesByType('resource').map(e => ({ n: e.name.replace(location.origin, '').replace(/[0-9a-f-]{36}/g, '{id}').replace(/\?.*$/, '').slice(0, 60), d: Math.round(e.duration), kb: Math.round((e.transferSize || 0) / 1024), s: Math.round(e.startTime) })); const nav = performance.getEntriesByType('navigation')[0];
  return { navResponseEnd: Math.round(nav?.responseEnd || 0), resources: res.length, totalKB: res.reduce((a, b) => a + b.kb, 0), slow: res.sort((a, b) => b.d - a.d).slice(0, 4).map(x => x.n + ' ' + x.d + 'ms ' + x.kb + 'KB @' + x.s), lastEnd: Math.round(Math.max(...performance.getEntriesByType('resource').map(e => e.responseEnd))) }; });
Object.assign(r, perf); return r;
