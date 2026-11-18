const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const C = JSON.parse(require('fs').readFileSync('d3/2850.json', 'utf8')); const res = {};
await ctx.route(u => /\/api\//.test(u.href), async r => { const m = r.request().method(); if (m !== 'GET' && /sla\/policies/.test(r.request().url())) { res.blocked = (res.blocked || 0) + 1; return r.abort(); } return r.continue(); });
for (const [k, id, tg, tag] of [['P', C.P, 't ' + C.tag, '2850-4-policy-takeover'], ['PB', C.PB, 't ' + C.tag + 'B', '2850-5-policy-unassigned']]) {
  await page.goto(H + '/settings/automation/sla/' + id, { waitUntil: 'domcontentloaded' });
  await page.getByText('Ticket Create').first().waitFor({ timeout: 90000 }); await sleep(1500); await page.getByText(/^TARGETS$/i).first().click(); await sleep(3000);
  await page.getByText(tg, { exact: true }).first().waitFor({ timeout: 90000 }); await sleep(1500);
  await page.getByText(tg, { exact: true }).first().click(); await sleep(4000);
  const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/Escalation/i);
  res[k] = t.slice(Math.max(0, i - 100), i + 2500);
  const e = page.getByText(/Response escalation|Escalations?/i).first(); if (await e.count()) await e.scrollIntoViewIfNeeded().catch(() => {});
  await sleep(1000); await page.screenshot({ path: RAW + tag + '.png' });
  const lv = page.getByText(/Level 1/).first(); if (await lv.count()) { await lv.evaluate(x => x.scrollIntoView({ block: 'start' })); await sleep(800); await page.screenshot({ path: RAW + tag + '-levels.png' }); }
}
await page.goto(H + '/views/all/tickets/' + C.E.id, { waitUntil: 'domcontentloaded' });
await page.getByText(/QA RT19 D3 2850/).first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(4000);
await page.getByRole('tab', { name: /History/i }).first().click().catch(async () => page.getByText(/^History$/).first().click()); await sleep(5000);
await page.screenshot({ path: RAW + '2850-6-ticket-4725-history.png' });
const ht = (await text()).replace(/\s+/g, ' '); const hi = ht.search(/Ticket History/); res.hist = ht.slice(hi, hi + 1800);
return res;
