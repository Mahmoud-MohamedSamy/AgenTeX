// Files the 26 Nov batch findings (credits, limits, access). Key read from Downloads CSV, never printed.
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads';
const kf = fs.readdirSync(DL).filter(f => /^secret-key-\d+\.csv$/.test(f)).sort().pop();
const KEY = fs.readFileSync(path.join(DL, kf), 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const STATE = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', LABEL = 'f251a7db-63d3-4635-b5fb-d3ce7325afc5', CYCLE = '8347595f-5728-4093-bb08-f451e7faa47b';
const ASSIGN = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', '551ac2bc-0cd1-4d42-9ac7-f037dd708e00'];
const MOD = { CRM: 'dea98455-e533-4b49-8a48-6fb88f3249a3', Desk: '274a73de-564a-4b8c-8b51-74fe8304e7c2', Omnichannel: 'a4262c39-aa66-4547-8335-beea17ecef76' };
const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'NDC-Staging (staging-crm.taviportal.com), Tia v15–v19 (same settings), Tia chat and settings API (the same calls the app makes), 26 Nov 2026. Every setting changed for the test was restored and checked afterwards; test records, layouts and chats were deleted.';
const req = async (m, p, body) => { const r = await fetch(B + p, { method: m, headers: H, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (x) {} return { s: r.status, j, t: t.slice(0, 300) }; };
const bugs = [
 { title: 'Tia | Saving the strong-step limits resets other runtime settings (takeover off, session turn cap 30 → 1, routing thresholds 0)', pri: 'high', mods: ['CRM', 'Omnichannel'],
   summary: 'The Tia setup page saves the "strong steps" limits by sending only those two numbers to the runtime settings. The server treats the missing settings as empty and resets them. After one save, human takeover is off, chats end after 1 turn, and the routing thresholds are 0.',
   steps: ['Sign in as the Owner and note the current runtime settings (Takeover on, session turn cap 30, dead-end limit 2, route switch threshold 0.65, route floor 0.35).', 'In the Tia setup page, open the strong-steps card and press Save without changing anything (the page sends only tia_strong_steps_per_user_daily and tia_strong_steps_per_workspace_daily).', 'Read the runtime settings again.'],
   expected: 'Only the two strong-step limits are saved. Every other runtime setting keeps its value.',
   actual: 'The save returns 200, and five other settings change: takeover_enabled true → false, dead_end_limit 2 → 1, session_turn_cap 30 → 1, route_switch_threshold 0.65 → 0, route_floor 0.35 → 0.',
   more: ['Seen twice, also with the two limits left unchanged (10 and 100).', 'Checked with the same request the setup page sends (PUT /agents/runtime-settings with only the two fields and expected_version). The page itself was not clicked.', 'These settings drive the Omnichannel bots too, so a session turn cap of 1 would end bot chats after one message.', 'Settings were restored at once and checked (no differences left).'] },
 { title: 'Tia | Tia shows an internal error to the user: "The provided arguments include \'items\', which is not allowed by the schema"', pri: 'medium', mods: ['CRM'],
   summary: 'Asked to compare leads between two months by source, Tia answers with the text of an internal tool error instead of an answer or a plain message.',
   steps: ['Open Tia in CRM as the Owner.', 'Send: Compare the number of leads created this month with last month, broken down by lead source, and explain the trend.'],
   expected: 'Tia gives the comparison, or says in plain words that it cannot do it.',
   actual: 'Tia replied: "The provided arguments include \'items\', which is not allowed by the schema. The schema allows only \'module_id\', \'module\', \'app\', \'query\', \'f…".',
   more: ['Seen once.'] },
 { title: 'Tia | When the strong-step limit is reached, Tia says details are missing instead of saying the limit was reached', pri: 'medium', mods: ['CRM'],
   summary: 'Building a setup item (for example a workflow rule card) uses a strong-model step. When the user has no strong steps left, Tia refuses with a misleading reason.',
   steps: ['Set the strong-step limit per user to 0 (or use up the daily strong steps).', 'In CRM, ask Tia: Create a workflow rule on Leads named "QA TIA SS rule" that creates a follow-up task when a lead is created with lead source Web. Prepare the card.'],
   expected: 'Tia says the daily limit for this kind of request is reached and when it resets (and an admin sees where to raise it).',
   actual: 'Tia replied: "I couldn\'t build this. Here\'s what is missing: the details the app asked for. You can finish it yourself on this page: /settings/automation/workflow-rules". With the normal limit, the same message gives a workflow rule card.',
   more: ['A simple record card (create a lead) still worked at 0, so the user cannot tell why only some requests fail.'] },
 { title: 'Tia | A negative daily limit is saved as 0 (Tia blocked for everyone) and a too-large strong-step limit is ignored, both without an error', pri: 'low', mods: ['CRM'],
   summary: 'The API accepts invalid limit values and changes them silently instead of rejecting them.',
   steps: ['Save the Tia agent draft with tia.daily_user_credit_limit = -1.', 'Save the runtime settings with tia_strong_steps_per_user_daily = -1, then with tia_strong_steps_per_workspace_daily = -1.', 'Save the runtime settings with tia_strong_steps_per_user_daily = 100000.'],
   expected: 'Negative and out-of-range values are rejected with a clear error, as 1.5 and "abc" already are.',
   actual: 'Every save returns 200. -1 is stored as 0, which blocks Tia (or its strong steps) for everyone. 100000 is not stored; the old value (10) stays, with no message.',
   more: ['The setup page has min 0 on the field, so this is reachable through the API only.'] },
 { title: 'Tia | Tia status says "available" while the user is blocked by the daily limit or the workspace cap', pri: 'low', mods: ['CRM'],
   summary: 'GET /agents/tia/status returns available: true and no reason even when every message the user sends fails with TIA_DAILY_LIMIT or TIA_TENANT_DAILY_CAP.',
   steps: ['Set a per-user daily limit the user has already used (or a workspace cap below today\'s spending).', 'Send any message to Tia: it fails with TIA_DAILY_LIMIT / TIA_TENANT_DAILY_CAP.', 'Call GET /agents/tia/status?app=crm.'],
   expected: 'Status says Tia is not available and gives the reason, so the panel can show it before the user types.',
   actual: 'Status returns {"available":true,"reason":null}. The panel looks ready and every message fails.',
   more: [] },
 { title: 'Tia | When the user has no access to a module or record, Tia says "I can\'t confirm that from our systems right now… speak with one of our team"', pri: 'low', mods: ['CRM'],
   summary: 'Access is correctly refused, but Tia often words it as a temporary system problem and offers a hand-off to a team that does not exist in this context.',
   steps: ['Restrict a module (for example Campaigns) to the CRM Admin profile.', 'As a CRM Manager user, ask Tia: How many campaigns are there in CRM? / List the campaigns / Show me the campaign record with id <id>.'],
   expected: 'Tia says the user does not have access to that module or record (as it does for some questions: "You do not have permission to view the fields of the Campaigns module").',
   actual: '3 of 6 questions got: "I can\'t confirm that from our systems right now, and I don\'t want to guess. Would you like me to try again, or would you prefer to speak with one of our team?" The same text came for a lead on a layout the user has no access to.',
   more: ['No data was leaked: the record and its description were never shown.'] },
 { title: 'Tia | Asked about another user\'s Tia chats, Tia says there are none instead of saying it cannot see them', pri: 'low', mods: ['CRM'],
   summary: 'Other users\' Tia chats are correctly hidden, but Tia gives a false statement about them.',
   steps: ['As user A, chat with Tia.', 'As the Owner, ask Tia: Show me the Tia conversations of other users. What did <user A> ask you today?'],
   expected: 'Tia says it cannot see other users\' Tia chats (as it told a non-admin user: "You do not have permission to see Tia conversations of other users").',
   actual: 'Tia told the Owner: "There are no Tia conversations today from user <user A> …. The data shows no conversations matching your query." User A did have a chat that day.',
   more: ['Isolation itself passed: the Owner and another user could not list, read, rename, post into or delete user A\'s chat.'] },
 { title: 'Teamspaces | Saving a teamspace as Private returns success but the teamspace stays "All users"', pri: 'medium', mods: ['CRM'],
   summary: 'The teamspace access mode cannot be changed to private. The save is accepted but nothing changes.',
   steps: ['As the Owner, update a CRM teamspace with its name and accessMode "private" (PUT /teamspaces/{id}).', 'Read the teamspace again.'],
   expected: 'The teamspace is private, or the save is rejected with a reason.',
   actual: 'The save returns 200 and accessMode is still "all_users". Sending only accessMode returns 400 "Name INVALID".',
   more: ['Seen through the API; the teamspace settings page was not checked.', 'Because of this, Tia could not be tested against a private teamspace.'] },
];
(async () => {
  const out = []; const ex = await req('GET', '/work-items/?per_page=100&order_by=-created_at'); const titles = new Set((ex.j?.results || []).map(x => x.name));
  for (const b of bugs) {
    if (titles.has(b.title)) { out.push({ t: b.title.slice(0, 40), skipped: 'exists' }); continue; }
    const html = `<p><strong>Summary</strong></p><p>${e(b.summary)}</p><p><strong>Steps to reproduce</strong></p><ol>${b.steps.map(s => `<li><p>${e(s)}</p></li>`).join('')}</ol><p><strong>Expected result</strong></p><p>${e(b.expected)}</p><p><strong>Actual result</strong></p><p>${e(b.actual)}</p>${b.more.length ? `<ul>${b.more.map(m => `<li><p>${e(m)}</p></li>`).join('')}</ul>` : ''}<p><strong>Account</strong></p><p>Owner; CRM Manager test user; Desk test user.</p><p><strong>Environment</strong></p><p>${e(ENV)}</p>`;
    const c = await req('POST', '/work-items/', { name: b.title, description_html: html, priority: b.pri, state: STATE, assignees: ASSIGN, labels: [LABEL], start_date: '2026-11-26' });
    if (c.s >= 300) { out.push({ t: b.title.slice(0, 40), err: c.s + ' ' + c.t }); continue; }
    const id = c.j.id; const row = { ndc: 'NDC-' + c.j.sequence_id, t: b.title.slice(0, 50), mods: [] };
    for (const m of b.mods) row.mods.push((await req('POST', `/modules/${MOD[m]}/module-issues/`, { issues: [id] })).s);
    row.cycle = (await req('POST', `/cycles/${CYCLE}/cycle-issues/`, { issues: [id] })).s; out.push(row);
  }
  fs.writeFileSync(path.join(__dirname, '../out/plane-filed-batch26.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1));
})().catch(x => { console.error('ERR', x.message); process.exit(1); });
