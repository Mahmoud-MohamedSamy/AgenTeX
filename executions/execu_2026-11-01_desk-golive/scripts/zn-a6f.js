async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/a6/';
  const f = page.frames().find(x => /ShowHomePage\.do/.test(x.url()));
  o.r = await f.evaluate(() => { const els = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /^Manual\s+Invoice$/.test(e.textContent.trim())); return els.map(e => { e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return [e.tagName, Math.round(r.x), Math.round(r.y), Math.round(r.width)]; }); });
  const it = f.getByText(/^Manual\s+Invoice$/); o.items = await it.count();
  for (let i = o.items - 1; i >= 0; i--) { const el = it.nth(i); if (await el.isVisible()) { await el.click({ timeout: 5000 }).catch(e => o.e2 = e.message.slice(0, 60)); o.clicked = i; break; } }
  await page.waitForTimeout(5000); o.text = (await f.innerText('body')).replace(/\s+/g, ' ').match(/Layouts Tickets.{0,250}/)?.[0];
  await page.screenshot({ path: D + 'zoho-layouts-mi.png' }); return o; }
