const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const out = {};
await page.goto(H + '/views/all/tickets/9c67edad-61c9-467c-9f31-38dc86680c8b', { waitUntil: 'domcontentloaded' });
await page.getByText('View configured actions').first().waitFor({ timeout: 90000 }).catch(() => {}); await sleep(3000);
const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/Steps/); out.card4168 = t.slice(i, i + 220);
await page.screenshot({ path: RAW + '3056-4168-card.png' });
await page.getByText('View configured actions').first().click().catch(e => out.click = String(e).slice(0, 80)); await sleep(3000);
out.popup4168 = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900);
await page.screenshot({ path: RAW + '3056-4168-popup.png' }); await page.keyboard.press('Escape'); await sleep(500);
// run QA onlyA on #4174 as the agent, through the API with this browser's session
out.run4174 = await page.evaluate(async () => { const tok = (document.cookie.match(/aw_staging_access_token=([^;]+)/) || [])[1]; const r = await fetch('/api/v1/desk/tickets/c3a5d3af-76ee-4aea-8a3c-ff71d954e03f/blueprint-transitions/onlyA', { method: 'POST', headers: { 'content-type': 'application/json', 'x-app-key': 'desk', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', authorization: 'Bearer ' + tok }, body: JSON.stringify({ run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {} }) }); return r.status + ' ' + (await r.text()).slice(0, 200); });
return out;
