await go('/views/all/tickets', 9000);
await page.getByRole('button', { name: /All Tickets/ }).first().click().catch(() => {}); await sleep(2000);
out.views = (await page.locator('[role=menu],[role=listbox],[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' | ').slice(0, 1200); await shot('access/c-views');
const sv1 = page.getByText(/^Shared Tickets$|^Shared with my department|^Shared$/).first(); out.hasShared = await sv1.count();
if (out.hasShared) { await sv1.click(); await sleep(6000); out.sharedList = [...new Set(((await mtxt()).match(/QA AC [A-Z0-9]+/g) || []))].join(','); out.sharedUrl = page.url(); await shot('access/c-shared-view');
  const cb = page.locator('input[type=checkbox]').first(); await cb.click().catch(() => {}); await sleep(1500); out.bulkBar = (await mtxt()).slice(0, 300); }
const q = await api('GET', '/desk/queues/agents'); out.agentQ = q.s + ' ' + JSON.stringify(D(q.j)).slice(0, 500);
const tq = await api('GET', '/desk/queues/teams'); out.teamQ = tq.s + ' ' + JSON.stringify(D(tq.j)).slice(0, 500);
const tm = await api('GET', '/desk/teams'); out.teams = tm.s + ' ' + ((D(tm.j).items || D(tm.j) || []).map?.(t => t.name).join(',') || '').slice(0, 400);
return fin({ out });
