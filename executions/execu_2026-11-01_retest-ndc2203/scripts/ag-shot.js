const SH = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_retest-ndc2203-r7/screenshots/raw/';
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto(H + '/views/all/tickets/' + '', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
await page.screenshot({ path: SH + 'i1-agent-duplicates.png' });
const t = (await page.innerText('body')).split('\n').filter(l => /QA WF Y|#67/.test(l)).slice(0, 14);
return t;
