out.r = [];
for (let k = 0; k < 3; k++) { await go('/analytics/reports', 10000);
  const row = page.locator('tr, [role=row]').filter({ hasText: /QA GL W5 (report|probe)/ }).first(); if (!(await row.count())) break;
  out.r.push((await row.innerText()).replace(/\s+/g, ' ').slice(0, 80));
  await row.getByRole('button').last().click().catch(() => {}); await sleep(1200);
  const del = page.getByRole('menuitem', { name: /Delete/ }); if (!(await del.count())) { out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); break; }
  await del.first().click(); await sleep(1500); const cd = page.locator('[role=alertdialog], [role=dialog]').last(); out['c' + k] = (await cd.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 150);
  const n0 = NET.length; await cd.getByRole('button', { name: /Delete|Move/ }).last().click().catch(() => {}); await sleep(3000); out['n' + k] = NET.slice(n0).filter(x => /report/.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s); }
await go('/analytics/reports', 10000); out.left = (await mtxt()).includes('QA GL W5');
return fin({ out });
