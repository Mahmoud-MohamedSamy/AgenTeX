const r = await api('GET', '/workflow/rules'); const other = arr(r.j.data).map(x => ({ name: x.name, active: x.isActive, layout: x.layoutId, crit: x.criteria && (x.criteria.field + ' ' + x.criteria.operator), upd: x.actions.map(a => Object.keys(a.fieldUpdates || {})) }));
await go('/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d', 4000);
for (let i = 0; i < 40; i++) { const t = await txt(); if (t.includes('EXECUTE BASED ON') || t.includes('Resume your draft')) break; await sleep(1000); }
const sf = page.getByRole('button', { name: 'Start fresh' }); if (await sf.count()) { await sf.click(); await sleep(2500); }
await page.getByText(/This rule will be executed/).first().click(); await sleep(1200);
return done({ other });
