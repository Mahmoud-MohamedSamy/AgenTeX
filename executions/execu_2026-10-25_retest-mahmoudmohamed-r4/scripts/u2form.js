const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
await page.goto(H + `/modules/${L}/records/new?layout=${LT}`, { waitUntil: 'commit', timeout: 120000 });
let t = ''; for (let i = 0; i < 90; i++) { await sleep(1000); t = await page.evaluate(() => document.body.innerText).catch(() => ''); if (/Full Name|First Name|Lead Information/.test(t)) break; } await sleep(3000);
t = await page.evaluate(() => document.body.innerText);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-25_retest-mahmoudmohamed-r4/screenshots/raw/1337-04-u2-create-form.png' });
return { hasFP: t.includes('QA RT FP'), sample: t.split('\n').filter(l => /QA RT|Address 2|isTrue|Date1/.test(l)).slice(0, 8) };
