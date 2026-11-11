// NDC-2136/2137 timing reference: Leads list (1 warm-up + 5) and Deals Kanban (1 warm-up + 3). navigation → first real row / card.
const fs = require('fs');
module.exports = async ({ page, log, shot, RUN }) => {
  const res = { leads: [], kanban: [] };
  const time = async (url, ready) => { const t0 = Date.now(); await page.goto(url, { waitUntil: 'commit', timeout: 90000 }).catch(() => {});
    for (let i = 0; i < 300; i++) { await page.waitForTimeout(100); if (await ready().catch(() => false)) return (Date.now() - t0) / 1000; } return null; };
  await require('./view.js')(page, 'All Leads');
  const leadsUrl = page.url(); log('leads url', leadsUrl);
  const rowReady = async () => /Total Records\s+\d+/.test(await page.innerText('body')) && (await page.locator('text=/\\(Sample\\)|QA RT15/').locator('visible=true').count()) > 0;
  for (let k = 0; k < 6; k++) { const s = await time(leadsUrl, rowReady); if (k) res.leads.push(s); log('leads', k, s); }
  await shot('c-2136-leads');
  // Deals Kanban: open Deals, switch to Kanban via the view-type icon, then time reloads of that URL
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Potentials', { waitUntil: 'commit', timeout: 90000 }).catch(() => {});
  for (let i = 0; i < 50; i++) { await page.waitForTimeout(1500); if (/Total Records|Deals/.test(await page.innerText('body').catch(() => ''))) break; }
  await page.waitForTimeout(3000); await page.mouse.click(464, 115); await page.waitForTimeout(8000); await shot('c-2137-kanban-first');
  const kUrl = page.url(); log('kanban url', kUrl, ((await page.innerText('body')) || '').replace(/\s+/g, ' ').slice(0, 300));
  const cardReady = async () => (await page.locator('text=/\\(Sample\\)|Benton|Chanay|Chemel|King|Feltz/').locator('visible=true').count()) > 0;
  for (let k = 0; k < 4; k++) { const s = await time(kUrl, cardReady); if (k) res.kanban.push(s); log('kanban', k, s); }
  await shot('c-2137-kanban');
  fs.writeFileSync(RUN + '/out/zoho-timing.json', JSON.stringify(res));
};
