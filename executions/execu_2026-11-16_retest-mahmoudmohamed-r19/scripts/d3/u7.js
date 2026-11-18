const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const C = JSON.parse(require('fs').readFileSync('d3/2850.json', 'utf8')); const res = {};
await ctx.route(u => /\/api\//.test(u.href), async r => { const m = r.request().method(); if (m !== 'GET' && /sla\/policies/.test(r.request().url())) { res.blocked = (res.blocked || 0) + 1; return r.abort(); } return r.continue(); });
for (const [k, id, tg, tag] of [['P', C.P, 't ' + C.tag, '2850-4-policy-takeover'], ['PB', C.PB, 't ' + C.tag + 'B', '2850-5-policy-unassigned']]) {
  await page.goto(H + '/settings/automation/sla/' + id, { waitUntil: 'domcontentloaded' });
  await page.getByText('Ticket Create').first().waitFor({ timeout: 90000 }); await sleep(1500); await page.getByText(/^TARGETS$/i).first().click(); await sleep(3000);
  const card = page.getByText(tg, { exact: true }).first().locator('xpath=ancestor::*[.//button][1]');
  await card.locator('button').first().click(); await sleep(4000);
  const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/Escalat/i);
  res[k] = t.slice(Math.max(0, i - 100), i + 2500);
  const lv = page.getByText(/Level 1/).first(); if (await lv.count()) { await lv.evaluate(x => x.scrollIntoView({ block: 'center' })); await sleep(1000); }
  await page.screenshot({ path: RAW + tag + '.png' });
  const dlg = page.getByRole('dialog').last(); if (await dlg.count()) { const sc = await dlg.evaluate(d => { const s = [...d.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 20 && getComputedStyle(e).overflowY !== 'visible'); return !!s; }); res[k + 'dlg'] = sc; }
}
return res;
