await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases', { waitUntil: 'commit', timeout: 60000 }).catch(()=>{});
await page.waitForTimeout(10000);
const cand = await page.$$eval('[data-title],[aria-label],[title]', es => es.map(e => (e.getAttribute('data-title')||e.getAttribute('aria-label')||e.getAttribute('title'))).filter(t => /setup|setting/i.test(t||'')));
out.cand = [...new Set(cand)];
