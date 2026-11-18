await page.waitForTimeout(60000);
for (const id of ['1499272000000533001', '1499272000000527001']) {
  const g = await api(page, 'GET', 'tickets/' + id); const h = await api(page, 'GET', 'tickets/' + id + '/History?limit=20');
  out[id.slice(-6)] = { owner: g.j && g.j.assigneeId, hist: (h.j && h.j.data || []).map(e => (e.actor && (e.actor.type + ':' + e.actor.name)) + ' ' + e.eventName + ' ' + JSON.stringify((e.eventInfo || []).map(x => x.propertyName)).slice(0, 80)) };
}
await openT(page, '1499272000000533001'); await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/z-163.png' });
await openT(page, '1499272000000527001'); await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/z-162.png' });
