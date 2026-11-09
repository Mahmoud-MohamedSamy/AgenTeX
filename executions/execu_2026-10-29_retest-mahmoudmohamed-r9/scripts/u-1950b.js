// NDC-1950 screen, second pass: History rows for the QA leads (attempt #1 rejected + #2 pending; deleted lead marked, no link);
// tab counts. Run as owner and as U1 (WHO env sets the label only). Read-only.
const out = {};
await page.goto(H + '/my-requests', { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('[role=tab]', { timeout: 120000 }); await sleep(5000);
out.tabs = await page.$$eval('[role=tab]', els => els.map(e => e.innerText.replace(/\s+/g, ' ').trim()));
await page.locator('[role=tab]', { hasText: /History/ }).first().click(); await sleep(6000);
const search = await page.$('input[placeholder*="record name" i], input[aria-label*="record name" i]'); if (search) { await search.fill('QA RT 1950'); await sleep(5000); }
await shot('1950-5-history-' + (await page.evaluate(() => document.querySelector('[aria-label*="account" i], header')?.innerText?.slice(0, 2) || 'x')) + '.png');
out.rows = await page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => ({ text: r.innerText.replace(/\s+/g, ' ').trim().slice(0, 200), link: !!r.querySelector('td a[href*="/records/"]') })).filter(x => /QA RT 1950/.test(x.text)));
out.filters = await page.$$eval('button, select', els => els.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()).filter(t => /^(Module|Type|Process|Status|Date type|Date range|Submitted by|Decided by|Attempt|SLA|Export CSV)$/.test(t)));
return out;
