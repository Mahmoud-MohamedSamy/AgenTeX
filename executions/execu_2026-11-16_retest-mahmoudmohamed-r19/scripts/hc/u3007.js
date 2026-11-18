const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/'; const out = {};
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(H + '/views/all/tickets/4f632116-cc82-4644-b0c8-e7ea4727f88e', { waitUntil: 'domcontentloaded' });
await page.getByText('test00').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(6000);
const t = (await text()).replace(/\s+/g, ' '); out.ticketHits = (t.match(/.{0,60}(forum|Forum|community|Community|topic|Topic).{0,60}/g) || []).slice(0, 8);
await page.screenshot({ path: RAW + '3007-1-ticket.png' });
const links = await page.locator('a').evaluateAll(as => as.map(a => a.href).filter(h => /communit|topic|forum/.test(h))); out.links = links.slice(0, 5);
for (const u of ['/community/topics/5becb270-7705-4622-9994-44f82280d0ce', '/community']) {
  await page.goto(H + u, { waitUntil: 'domcontentloaded' }); await sleep(8000); const x = (await text()).replace(/\s+/g, ' '); out[u] = x.slice(0, 100) + ' … ' + ((x.match(/.{0,80}(4671|Ticket).{0,80}/g) || []).slice(0, 5).join(' | '));
  if (/test00/.test(x)) { await page.screenshot({ path: RAW + '3007-2-topic.png' }); out.topicUrl = page.url(); break; }
}
return out;
