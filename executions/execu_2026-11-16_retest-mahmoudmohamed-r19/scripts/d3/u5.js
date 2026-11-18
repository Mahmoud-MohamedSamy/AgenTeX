const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const C = JSON.parse(require('fs').readFileSync('d3/2850.json', 'utf8')); const res = {};
await ctx.route(u => /\/api\//.test(u.href), async r => { const m = r.request().method(); if (m !== 'GET' && /sla\/policies/.test(r.request().url())) { res.blocked = (res.blocked || 0) + 1; return r.abort(); } return r.continue(); });
for (const [k, dept, name, tag] of [['P', C.D, 'QA RT19 D3 2850 takeover ' + C.tag, '2850-4-policy-takeover'], ['PB', C.DB, 'QA RT19 D3 2850 unassigned ' + C.tag, '2850-5-policy-unassigned']]) {
  await page.goto(H + '/settings/automation/sla?department=' + dept, { waitUntil: 'domcontentloaded' });
  await page.getByRole('tab', { name: /Inactive/ }).first().click().catch(async () => page.getByText(/^Inactive/).first().click()); await sleep(2500);
  await page.getByText(name).first().waitFor({ timeout: 90000 }); await sleep(1500);
  await page.getByText(name).first().click(); await sleep(6000);
  const btn = page.getByRole('button', { name: /Next/ }); if (await btn.count()) { await btn.first().click(); await sleep(3000); }
  const esc = page.getByText(/Escalat/).first(); if (await esc.count()) { await esc.scrollIntoViewIfNeeded().catch(() => {}); }
  await sleep(1500); await page.screenshot({ path: RAW + tag + '.png' });
  const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/Escalation/);
  res[k] = { url: page.url(), t: t.slice(Math.max(0, i - 200), i + 1800) };
}
return res;
