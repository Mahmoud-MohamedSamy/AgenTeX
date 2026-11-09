async (page, ctx, blocked) => {
  const reqs = []; const on = r => { const u = r.url(); if (/desk\.zoho\.com\/(supportapi|api)/.test(u)) { const h = r.headers(); reqs.push({ m: r.method(), u: u.replace(/\?.*/, '').slice(0, 140), hk: Object.keys(h).filter(k => !/cookie|csrf|token|auth/i.test(k)).join(','), hasCsrf: Object.keys(h).some(k => /csrf/i.test(k)), orgId: h.orgid || h.orgId || null }); } };
  page.on('request', on); await page.goto('https://desk.zoho.com/agent/wondertravel/all', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {}); await page.waitForTimeout(20000); page.off('request', on);
  const t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 600);
  await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/ndc-zoho/home.png' });
  return { url: page.url(), t, n: reqs.length, reqs: reqs.slice(0, 40), blocked: blocked.slice(-15) };
}
