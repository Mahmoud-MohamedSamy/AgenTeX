result('H-23', process.env.SAME === 'SAME' ? 'Pass' : 'Finding', `CRA past chats list from CRM and Desk API: ${process.env.SAME} (one history across apps)`);
result('H-07b', 'Blocked', 'CRM suggestions (pipeline / follow-ups) not seen in the CRM UI (CRM browser sign-in blocked); locale has them');
result('N-01', 'Pass', 'Median time to first streamed text over 10 simple questions: 1.6 s (target ≤ 5 s)');
result('N-02', 'Pass', 'Median full answer 2.1 s, max 4.0 s (target ≤ 20 s)');
result('N-03', 'Pass', 'Count/list questions: 4.2–6.2 s, no timeout; answers correct (41 open, 24 closed for RST)');
result('N-04', 'Pass', 'Past chats list (50 per page) returned in 0.8 s');
result('N-05', 'Inconclusive', 'Long chat with 40+ messages not built');
result('O-01', 'Pass', 'Lead QA TIA J01 made through Tia is in the Leads list (API list as CRA)');
result('O-02', 'Blocked', 'Needs an active workflow rule (J-18 blocked)');
result('O-03', 'Blocked', 'Private ticket comment cannot be proposed (J-06 Fail)');
result('O-04', 'Pass', 'KB drafts made through Tia are in Desk KB as status draft, category QA RT18 KB, author = the asker');
result('O-05', 'Pass', 'Audit log: records made through Tia logged as created by the user (actor_type user) with source_channel "tia" (QA TIA J01, J11 Expiry, J13 Double)');
result('O-06', 'Pass', 'Recycle Bin lists Tia (60 days) and restore brings it back (B-18/B-19)');
result('O-07', 'Blocked', 'No setup-change card possible for tags (J-08 Fail)');
result('O-08', 'Inconclusive', 'New-lead notifications not checked');
result('E2E-1', 'Fail', 'Admin side works (topic rule deployed and enforced, F-01..F-03), but the agent cannot get a private comment card on a ticket (J-06): journey stops at step 3');
result('E2E-2', 'Fail', 'CRM user: pipeline question returns an internal error (I-04), "list my QA TIA deals" says none exist (I-02); updating a lead works (J-04) once the lead has a Name');
result('E2E-3', 'Fail', 'Desk agent: the suggested "How many open tickets do I have?" fails (I-12), "Summarise this ticket" works (I-14), "Draft a private comment" cannot work (J-06)');
result('E2E-4', 'Pass', 'Workspace allowance 0 → TIA_TENANT_DAILY_CAP for users; allowance cleared → Tia answers again (G-10/G-11; one retry needed for the cache)');
// Z rows
const Z = [
 ['Z-01', 'Gap', 'Answers come as text + cards (links, table, list, details); no chart card type exists in the panel code and no "add to dashboard". Zia: question → chart → dashboard.'],
 ['Z-02', 'Gap', 'No report building in the chat; Tia can only list/run saved reports (and I-10 failed). Zia co-creates reports.'],
 ['Z-03', 'Gap', 'No "how this was worked out" view; only reference chips. Zia shows criteria/code viewer.'],
 ['Z-04', 'Gap', 'No scheduled/recurring questions. Zia has routines.'],
 ['Z-05', 'Gap', 'Tia cannot be opened from global search ("Search or jump to…"); only the floating launcher.'],
 ['Z-06', 'Gap', 'No like/dislike on answers; panel buttons are only What Tia can see / Past chats / New chat / Minimise / Close / Send; /agents/tia/feedback 404.'],
 ['Z-07', 'Gap', 'No voice input (no microphone button); /agents/tia/voice 404.'],
 ['Z-08', 'Partly', 'Record page has the suggestion "Summarise this record" in the panel, not a Record Assistant button with record/conversation/note/email summaries.'],
 ['Z-09', 'Gap', 'No Tia drafting in the email composer / note editor with tone and length (Desk ticket AI writing assistant is a separate feature, NDC-2947).'],
 ['Z-10', 'Gap', 'No choice of AI model or own provider key in Tia setup (definition has unused model_hint/vendor_hint).'],
 ['Z-11', 'Not a gap', 'AI policy has an on/off per AI feature (tia, triage, summarize, translate, mail_draft, reply_suggest, auto_tag…), shown in CRM AI Features (UI not opened).'],
 ['Z-12', 'Partly', 'Per-feature permissions exist for some AI features (ai:tia:use, ai:reply:use, ai:summary:view, ai:translate:use), not 14 like Zia.'],
 ['Z-13', 'Partly', 'Workflow rule from chat works (J-09) but only 4 fixed recipes, the given name is ignored, raw JSON on the card; blueprints cannot be proposed (E-08).'],
 ['Z-14', 'Not a gap', 'Past chats, rename, delete (H-15..H-20).'],
 ['Z-15', 'Not a gap', 'Tia respects record, department and app access (K-01..K-08, K-01b).'],
 ['Z-16', 'Out of Tia scope', 'Customer-facing answer bot is the separate Omnichannel AI agent, not Tia.'],
 ['Z-17', 'Out of scope', 'Desk reply/writing assistance is NDC-2947 (not tested).'],
 ['Z-18', 'Gap', 'No field prediction (picklists/owner) seen in Desk or Tia.'],
 ['Z-19', 'Gap', 'No AI steps in Desk workflow rules (no AI action type in the workflow editor code). Zia Actions: extraction, prediction, content, auto reply.'],
 ['Z-20', 'Gap', 'No setting to mask personal data before it goes to the AI (Zia PII anonymization).'],
 ['Z-21', 'Gap', 'No AI preferences per department; Tia settings are workspace-wide (apps, audience, topics).'],
 ['Z-22', 'Partly', 'Tia makes a KB draft from a prompt (J-07); not from chosen ticket conversations with personal details stripped (Zia Ticket to Article).'],
];
for (const [id, v, n] of Z) result(id, v, n);
return 'ok';
