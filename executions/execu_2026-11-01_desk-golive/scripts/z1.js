(async (page, frame) => { await page.waitForTimeout(40000);
  const m = page.getByText('Company', { exact: true }).first(); await m.click().catch(() => {}); await page.waitForTimeout(30000);
  const out = { url: page.url(), frames: page.frames().map(f => f.url().slice(0, 90)) };
  for (const f of page.frames()) { const t = await f.innerText('body').catch(() => ''); if (/Company|Organization Name|Website/i.test(t) && f !== page.mainFrame()) { out.ftext = t.replace(/\s+/g, ' ').slice(0, 1500); out.furl = f.url().slice(0, 100); } }
  await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/zoho-company-view.png' }); return out; })
