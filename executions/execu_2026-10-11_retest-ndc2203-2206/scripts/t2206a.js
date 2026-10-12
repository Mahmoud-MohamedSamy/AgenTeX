const out = {};
await go('/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d', 4000);
for (let i = 0; i < 30; i++) { if ((await txt()).includes('EXECUTE BASED ON')) break; await sleep(1000); }
await page.getByText(/This rule will be executed when/).first().click(); await sleep(1500); await page.getByText('A Date-Time field', { exact: true }).first().click(); await sleep(1500);
const t = await txt(); out.when = t.slice(t.indexOf('WHEN'), t.indexOf('CONDITION')).slice(0, 1500);
out.layouts = (await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/layouts')).t.slice(0, 600);
out.tags = (await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/tags?include_inactive=true')).t.slice(0, 800);
await shot('x-2206-when');
return done(out);
