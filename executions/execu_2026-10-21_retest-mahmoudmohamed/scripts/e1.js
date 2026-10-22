const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await go(`/modules/${D}/import`, 10000);
const t0 = (await txt()).split('Meetings')[1]?.slice(0, 900);
await shot('1517-01-upload-step-deals');
await page.locator('input[type=file]').setInputFiles('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-21_retest-mahmoudmohamed/files/QA-RT-1323-deals.xlsx'); await sleep(5000);
const t1 = (await txt()).split('Meetings')[1]?.slice(0, 1200);
return done({ t0, t1 });
