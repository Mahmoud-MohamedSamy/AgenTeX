async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/a6/';
  await page.locator('text=Desktop Notification').locator('xpath=../..').locator('[class*=close], svg, span').first().click({ timeout: 2000 }).catch(() => {});
  for (let i = 0; i < 12; i++) { await page.mouse.move(630, 500); await page.mouse.wheel(0, 500); await page.waitForTimeout(700);
    const hit = await page.evaluate(() => { const e = [...document.querySelectorAll('label, span, div')].find(x => x.children.length <= 1 && /^Agent id\s*\*?$/i.test(x.textContent.trim()) && x.offsetParent); if (!e) return null; const r = e.getBoundingClientRect(); return r.y > 120 && r.y < 800 ? [e.textContent.trim(), Math.round(r.y)] : null; });
    if (hit) { o.hit = hit; break; } }
  o.text = (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,80}Agent id.{0,80}/i)?.[0];
  await page.screenshot({ path: D + 'zoho-new-cc-agent.png' }); return o; }
