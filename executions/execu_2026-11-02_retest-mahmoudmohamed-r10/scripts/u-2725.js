// NDC-2725: lead with a call activity (2728 lead) → Activities section: View all? → Calls tab: call logs vs repeated activities; its View all.
const id = 'fdef9e44-d6d0-4d21-9071-3092c5a47755'; const st = {};
const load = async () => { for (let i = 0; i < 50; i++) { await sleep(3000); const t = await text(); if (t.includes('QA RT r10 2728 lead') && !/Loading\.\.\./.test(t) && /ACTIVITIES/i.test(t)) break; } await sleep(4000); };
await page.goto(H + '/modules/' + T.LEADS + '/records/' + id, { waitUntil: 'commit', timeout: 120000 }); await load();
const act = page.getByText(/^activities\s*\(\d+\)$/i).first(); await act.evaluate(e => e.scrollIntoView({ block: 'start' })); await page.mouse.wheel(0, -80); await sleep(2000);
const sec = act.locator('xpath=ancestor::*[.//*[contains(text(),"QA RT r10 2728")]][1]');
st.activities = (await sec.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
st.activitiesViewAll = await sec.getByText('View all', { exact: true }).count();
await shot('2725-1-activities.png');
await page.mouse.wheel(0, -5000); await sleep(1000); await page.getByText('Overview', { exact: true }).first().locator('xpath=ancestor::*[.//*[normalize-space()="Files"]][1]').getByText('Calls', { exact: true }).first().click(); await sleep(6000); await shot('2725-2-calls-tab.png');
const t = await text(); const i = t.lastIndexOf('Calls'); st.callsTab = t.slice(t.indexOf('Overview'), t.indexOf('Overview') + 1200).replace(/\s+/g, ' ');
st.callLogsSection = /Call Logs/i.test(t); st.repeatsActivity = (t.match(/QA RT r10 2728 call from saved action/g) || []).length;
st.callsViewAll = await page.getByText('View all', { exact: true }).count();
if (st.callsViewAll) { await page.getByText('View all', { exact: true }).first().click(); for (let k = 0; k < 40; k++) { await sleep(3000); if (!/records\/fdef9e44/.test(page.url()) && !/Loading\.\.\./.test(await text())) break; } await sleep(4000); st.viewAllUrl = decodeURIComponent(page.url()).replace(H, ''); await shot('2725-3-view-all.png'); st.viewAllText = (await text()).match(/\d+ records?/)?.[0]; }
return st;
