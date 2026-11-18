// env TID, TAG, SUBJ: open ticket, shot card, open History tab, shot. Returns History text.
const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const TID = process.env.TID, TAG = process.env.TAG;
await page.goto(H + '/views/all/tickets/' + TID, { waitUntil: 'domcontentloaded' });
await page.getByText(process.env.SUBJ).first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(5000);
await page.screenshot({ path: RAW + TAG + '-ticket.png' });
const body = (await text()).replace(/\s+/g, ' '); const si = body.search(/Steps|Blueprint/);
log('card', body.slice(Math.max(0, si - 100), si + 500));
const tab = page.getByRole('tab', { name: /History/i }).first(); if (await tab.count()) await tab.click(); else await page.getByText(/^History$/).first().click();
await sleep(5000);
await page.screenshot({ path: RAW + TAG + '-history.png' });
const ht = (await text()).replace(/\s+/g, ' '); const hi = ht.search(/History/);
return { history: ht.slice(hi, hi + 2500), raw: /BlueprintStateChanged|\|entered\|/.test(ht) };
