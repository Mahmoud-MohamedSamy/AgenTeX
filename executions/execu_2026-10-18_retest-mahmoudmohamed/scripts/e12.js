const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const R = 'd802f26e-3cdc-410d-b1ab-735917a64024'; const U1 = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2'; const out = {};
const SHOT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-18_retest-mahmoudmohamed/screenshots/raw/';
await page.goto(H + '/modules/' + D + '/records/' + R, { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(1000); if (await page.getByRole('tab', { name: 'Timeline' }).count() || await page.getByText('Timeline', { exact: true }).count()) break; }
await page.getByText('Timeline', { exact: true }).first().click(); await sleep(6000);
out.timeline = ((await page.locator('main').last().innerText()).match(/[^\n]*(approv|lock|overrid|Amount|submitted)[^\n]*/gi) || []).slice(0, 14);
await page.screenshot({ path: SHOT + 'NDC-1234-owner-timeline.png' });
const r = await api('PATCH', '/modules/' + D + '/records/' + R, { data: [{ field: 'owner', value: { kind: 'string', value: U1 } }] });
out.ownerChange = r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 250) : '');
return out;
