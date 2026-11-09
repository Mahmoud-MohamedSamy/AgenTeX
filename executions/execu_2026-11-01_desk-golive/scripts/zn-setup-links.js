// READ-ONLY: open Setup home, list every setup link (text + href). Writes ndc-zoho/setup-links.json.
async (page, ctx, blocked) => {
  const fs = require('fs'); const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/ndc-zoho';
  await page.goto('https://desk.zoho.com/agent/wondertravel/all/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {}); await page.waitForTimeout(12000); const nn = page.locator('text=/^Not Now$/').first(); if (await nn.count()) await nn.click().catch(() => {}); const g = page.locator('[data-id=setupIcon], [aria-label=Setup], [data-title=Setup], [title=Setup]').first(); if (await g.count()) { await g.click().catch(() => {}); } await page.waitForTimeout(12000);
  const frames = page.frames().map(f => f.url().slice(0, 120));
  const links = [];
  for (const f of page.frames()) { const l = await f.$$eval('a', as => as.map(a => [a.innerText.trim().replace(/\s+/g, ' '), a.getAttribute('href')]).filter(x => x[0] && x[1])).catch(() => []); links.push(...l); }
  const txt = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 3000);
  await page.screenshot({ path: D + '/setup-home.png' });
  fs.writeFileSync(D + '/setup-links.json', JSON.stringify({ frames, links, txt }, null, 1));
  return { url: page.url(), frames, n: links.length, setupLinks: links.filter(x => /setup/.test(x[1])).slice(0, 150), txt: txt.slice(0, 1500), blocked: blocked.length };
}
