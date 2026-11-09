async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/a6/';
  for (const [slug, name] of [['manual-invoice', 'mi'], ['client-complaints', 'cc']]) {
    await page.goto(`https://desk.zoho.com/agent/wondertravel/${slug}/tickets/new`, { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
    await page.waitForTimeout(18000);
    const t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
    o[name] = { url: page.url().slice(0, 100), agent: t.match(/.{0,40}Agent id.{0,40}/i)?.[0], head: t.slice(0, 200) };
    o[name].box = await page.evaluate(() => { const e = [...document.querySelectorAll('*')].find(x => x.children.length === 0 && /^Agent id\s*\*?$/i.test(x.textContent.trim())); if (!e) return null; e.scrollIntoView({ block: 'center' }); const p = e.closest('[class*="field"],[class*="Field"]') || e.parentElement; return [e.textContent.trim(), p.innerText.replace(/\s+/g, ' ').slice(0, 60), getComputedStyle(e).color]; });
    await page.waitForTimeout(1500); await page.screenshot({ path: D + `zoho-new-${name}.png` });
  }
  return o; }
