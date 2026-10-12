await go('/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d', 4000);
for (let i = 0; i < 40; i++) { if ((await txt()).includes('EXECUTE BASED ON')) break; await sleep(1000); }
await page.getByText(/This rule will be executed when/).first().click(); await sleep(1200);
await page.getByText('A Date-Time field', { exact: true }).first().click(); await sleep(1500);
return 'ok';
