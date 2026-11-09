// UI evidence: rules list tabs, ticket history naming a rule (nothing saved).
page.on('dialog', d => d.accept().catch(() => {}));
await api('GET', '/desk/departments');
await go('/settings/automation/workflow-rules', 10000); await shot('f3-list-all');
const tabs = await page.getByRole('tab').allInnerTexts();
const inact = page.getByRole('tab', { name: /Inactive/ }); if (await inact.count()) { await inact.first().click(); await sleep(2500); await shot('f3-list-inactive'); }
const inactRows = (await txt()).split('\n').filter(l => /QA WF|Date-Time|On Create|On Edit|test|Tag/.test(l)).slice(0, 10);
const act = page.getByRole('tab', { name: /^Active/ }); if (await act.count()) { await act.first().click(); await sleep(2500); await shot('f3-list-active'); }
const actRows = (await txt()).split('\n').filter(l => /QA WF/.test(l)).slice(0, 10);
await go('/views/all/tickets/ba4b6f09-10fa-41be-bc02-e23054259046', 12000); await shot('f4-ticket');
const hist = page.getByRole('tab', { name: /History|Activity/ }); if (await hist.count()) { await hist.first().click(); await sleep(3000); }
await shot('f4-ticket-history');
const h = (await txt()).split('\n').filter(l => /QA WF|workflow|rule/i.test(l)).slice(0, 12);
return fin({ tabs, inactRows, actRows, h });
