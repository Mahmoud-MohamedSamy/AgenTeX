// Files drafts P4-1..3 and posts comments C1..C5. Key read from Downloads CSV, never printed.
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads';
const kf = fs.readdirSync(DL).filter(f => /^secret-key-\d+\.csv$/.test(f)).sort().pop();
const KEY = fs.readFileSync(path.join(DL, kf), 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const STATE = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', LABEL = 'f251a7db-63d3-4635-b5fb-d3ce7325afc5', CYCLE = '8347595f-5728-4093-bb08-f451e7faa47b';
const ASSIGN = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', '551ac2bc-0cd1-4d42-9ac7-f037dd708e00'];
const MOD = { CRM: 'dea98455-e533-4b49-8a48-6fb88f3249a3', Omnichannel: 'a4262c39-aa66-4547-8335-beea17ecef76' };
const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'NDC-Staging (staging-crm / staging-omnichannel.taviportal.com), Tia v23–v25 (same settings as the baseline), Edge and the Tia chat API, 26 Nov 2026, Owner account. Every setting changed for the test was restored; test chats were deleted.';
const req = async (m, p, body) => { const r = await fetch(B + p, { method: m, headers: H, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (x) {} return { s: r.status, j, t: t.slice(0, 300) }; };
const bugs = [
 { title: 'Tia | In Omnichannel, "Summarise this conversation" fails on an open chat and leaves out the visitor', pri: 'medium', mods: ['Omnichannel'],
   summary: 'With a chat open in Omnichannel, Tia cannot reliably summarise it: on an open chat it says there is no data, and on another chat it does not say who the visitor is.',
   steps: ['Sign in to Omnichannel as the Owner and open an open chat (for example the chat with visitor Karim Tallat).', 'Open Tia and ask: Summarise this conversation: who is the visitor and what is the status?', 'Repeat on a missed chat (for example the chat with visitor Moaz Adly).'],
   expected: 'Tia names the visitor, gives the status and says what the visitor asked, for any chat the user can open.',
   actual: 'Open chat: "There is no conversation data available for the conversation ID you referenced, so I cannot summarize who the visitor is or the status of the conversation." Missed chat: a summary of the messages ("a customer who interacted mostly in Arabic, requesting to cancel a booking…") with no visitor name.',
   more: ['When no conversation was passed at all, Tia did describe the open chat (Karim Tallat, open), so the data is reachable.', 'A made-up conversation id is handled correctly ("I could not retrieve the conversation messages…").', 'In Desk, "Summarise this ticket" was right 3 of 3 times.'] },
 { title: 'Tia | After rolling back to an older version, the draft keeps the newer settings, so the next Deploy brings them back', pri: 'low', mods: ['CRM', 'Omnichannel'],
   summary: 'Redeploying an older Tia version works at once for users, but the draft is left with the change that was rolled back.',
   steps: ['On the Tia setup page, change a setting (for example set the daily credit limit per user to 1 credit) and deploy it.', 'In the version history, redeploy the previous version.', 'Look at the setup page and the draft.'],
   expected: 'The draft matches the version that is now live, or the page clearly warns that the draft still holds the change that was rolled back.',
   actual: 'Users get the old version at once (the limit is gone, even in an open chat), but the draft still has the limit of 1 and the page shows undeployed changes. The next Deploy would put the rolled-back change live again without any warning.',
   more: ['Rollback itself works: an open chat that was blocked by the limit answered again straight after the redeploy.'] },
 { title: 'Tia | "Your session has ended" in the Tia panel has no way to sign in again', pri: 'low', mods: ['CRM'],
   summary: 'When the session has ended, the Tia panel shows a message but offers no action.',
   steps: ['Open CRM and the Tia panel.', 'End the session (sign out in another tab, or let it expire).', 'Send a message to Tia.'],
   expected: 'The message has a Sign in button or link that takes the user to the sign-in page.',
   actual: 'The panel shows "Your session has ended. Please sign in again." with no button or link; the user has to reload the page to sign in.',
   more: [] },
];
const comments = [
 ['NDC-3346', ['More cases seen on 26 Nov:', '• "Show me deal amounts by stage as a chart" → "Missing valid UUID for \'report_id\'. Cannot correct without the exact UUID from the list."', '• "Run the NDC wallet balance action" → "Missing valid UUID for \'action_id\'…" (also in NDC-3355).', '• "Build a new report of deals grouped by owner and save it" → Tia lists its internal recipe names: \'assignment_by_lead_source\', \'approval_above_amount\', \'task_on_lead_created\', \'sla_by_priority\'.']],
 ['NDC-3286', ['Seen again on 26 Nov: asked for the company of the lead "QA AEO SH H-02 lead", Tia answered "the company is QA AEO". The lead has no company field; "QA AEO" is the value of the field "Single Line Permission" (single_line_3_9).']],
 ['NDC-3358', ['Checked against the report itself on 26 Nov: the report "test" covers 73 deals with a grand total of 5,533,912,086,090. Tia said "at least 17 rows, with more rows available" and "amounts ranging from 10,000 to over 55 billion", so it neither gave the total nor described the amounts correctly.']],
 ['NDC-3283', ['Checked on 26 Nov: the limit error (TIA_DAILY_LIMIT) carries no reset time, and GET /agents/tia/status still returns available: true for the blocked user. The message says "It resets tomorrow" but nothing says when tomorrow starts (UTC or the workspace time zone).']],
 ['NDC-3360', ['Correction after a check with a virtual screen reader (Guidepup) on 26 Nov: Tia\'s answers ARE announced. They go to a polite live region outside the panel, which the first check missed because it only looked inside the panel. Please drop the first point (answers are not announced).', 'Still open: each message is not marked as from the user or from Tia (the question is read as bare text), the "Thinking…" state is not announced, and the card content and the next message are not separated.']],
];
(async () => {
  const out = { created: [], comments: [] };
  const recent = []; for (let p = 1; p <= 2; p++) { const r = await req('GET', `/work-items/?per_page=100&order_by=-created_at${p > 1 && recent.next ? '&cursor=' + recent.next : ''}`); recent.push(...(r.j?.results || [])); recent.next = r.j?.next_cursor; if (!r.j?.next_page_results) break; }
  const titles = new Set(recent.map(x => x.name)); const bySeq = Object.fromEntries(recent.map(x => ['NDC-' + x.sequence_id, x.id]));
  Object.assign(bySeq, { 'NDC-3283': '41983e8e-7880-47af-8723-a2f8d74998f5', 'NDC-3286': 'd2c7492b-5310-47b7-9f18-d366c5ad028a' });
  for (const b of bugs) {
    if (titles.has(b.title)) { out.created.push({ t: b.title.slice(0, 40), skipped: 'exists' }); continue; }
    const html = `<p><strong>Summary</strong></p><p>${e(b.summary)}</p><p><strong>Steps to reproduce</strong></p><ol>${b.steps.map(s => `<li><p>${e(s)}</p></li>`).join('')}</ol><p><strong>Expected result</strong></p><p>${e(b.expected)}</p><p><strong>Actual result</strong></p><p>${e(b.actual)}</p>${b.more.length ? `<ul>${b.more.map(m => `<li><p>${e(m)}</p></li>`).join('')}</ul>` : ''}<p><strong>Account</strong></p><p>Owner.</p><p><strong>Environment</strong></p><p>${e(ENV)}</p>`;
    const c = await req('POST', '/work-items/', { name: b.title, description_html: html, priority: b.pri, state: STATE, assignees: ASSIGN, labels: [LABEL], start_date: '2026-11-26' });
    if (c.s >= 300) { out.created.push({ t: b.title.slice(0, 40), err: c.s + ' ' + c.t }); continue; }
    const id = c.j.id; const row = { ndc: 'NDC-' + c.j.sequence_id, id, t: b.title.slice(0, 50), mods: [] };
    for (const m of b.mods) row.mods.push((await req('POST', `/modules/${MOD[m]}/module-issues/`, { issues: [id] })).s);
    row.cycle = (await req('POST', `/cycles/${CYCLE}/cycle-issues/`, { issues: [id] })).s; out.created.push(row);
  }
  for (const [ndc, paras] of comments) {
    const id = bySeq[ndc]; if (!id) { out.comments.push({ ndc, err: 'id not found' }); continue; }
    const r = await req('POST', `/work-items/${id}/comments/`, { comment_html: paras.map(p => `<p>${e(p)}</p>`).join('') }); out.comments.push({ ndc, s: r.s });
  }
  fs.writeFileSync(path.join(__dirname, '../out/plane-filed-p4.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1));
})().catch(x => { console.error('ERR', x.message); process.exit(1); });
