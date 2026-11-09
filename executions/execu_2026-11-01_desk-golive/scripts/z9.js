(async (page) => { const box = await page.getByText('Marketing', { exact: true }).nth(1).boundingBox().catch(() => null);
  const cands = await page.$$eval('[title], [aria-label], svg, i, span', els => els.filter(e => e.offsetParent !== null).map(e => { const r = e.getBoundingClientRect(); return { t: (e.getAttribute('title') || e.getAttribute('aria-label') || e.className && e.className.baseVal || e.className || '').toString().slice(0, 40), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }; }).filter(o => o.y > 130 && o.y < 165 && o.x > 540 && o.x < 600));
  await page.mouse.click(568, 146); await page.waitForTimeout(4000);
  const inputs = await page.$$eval('input, textarea', els => els.filter(e => e.offsetParent !== null).map(e => (e.placeholder || e.name || e.id) + '|' + e.type + '|' + String(e.value).slice(0, 40)));
  const btns = await page.$$eval('button, [role=button]', els => els.filter(e => e.offsetParent !== null).map(e => (e.innerText || '').trim()).filter(x => x && x.length < 25));
  await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/zoho-dept-edit.png' });
  return { box, cands: cands.slice(0, 8), inputs, btns: btns.slice(-10) }; })
