const out = {}; const RID = 'de65ddbb-8b4d-46a8-afa5-7bdacda4ebc5';
const all = arr((await api('GET', `/workflow/rules?moduleId=${T}&limit=200`)).j?.data); out.api = { total: all.length, active: all.filter(r => r.isActive).length };

out.deact = (await api('POST', `/workflow/rules/${RID}/deactivate`, {})).s;
const all2 = arr((await api('GET', `/workflow/rules?moduleId=${T}&limit=200`)).j?.data); out.api2 = { total: all2.length, active: all2.filter(r => r.isActive).length, inactive: all2.filter(r => !r.isActive).map(r => r.name) };
await go('/settings/automation/workflow-rules', 10000);
out.tabs = await page.getByRole('tab').allInnerTexts();
const inact = page.getByRole('tab', { name: /Inactive/ }); if (await inact.count()) { await inact.first().click(); await sleep(2500); await shot('f3-list-inactive'); out.inactRows = (await txt()).split('\n').filter(l => /QA WF|^test|Tag/.test(l)).slice(0, 10); }
const act = page.getByRole('tab', { name: /^Active/ }); if (await act.count()) { await act.first().click(); await sleep(2500); await shot('f3-list-active'); out.actHasA2 = (await txt()).includes('QA WF A2'); }
return done(out);
