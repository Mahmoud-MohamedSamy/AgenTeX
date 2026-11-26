// Tia CRUD test, part 2 (25 Nov): remaining Desk features (SET=desk2) and Omnichannel (SET=omni).
// mode n = confirm cards for QA items; r = workspace-wide item: any card is REJECTED; s = one settings object: ask a change, REJECT the card.
const SET = process.env.SET; const APPN = SET === 'omni' ? 'Omnichannel' : 'Desk';
const OUT = RUN + '/out/crud2-results.jsonl';
const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
const doneObj = new Set(prev.filter(x => x.set === SET && /delete|settings/.test(x.op)).map(x => x.obj));
const SAFE = 'Keep it inactive / not active, and if it needs criteria, apply it only to records whose name starts with "QA TIA CRUD".';
const G = (obj, extra = '', mode = 'n') => [obj, `Create a new ${obj} named "QA TIA CRUD ${obj}"${extra ? ' ' + extra : ''}. ${SAFE}`, `Rename the ${obj} "QA TIA CRUD ${obj}" to "QA TIA CRUD ${obj} v2".`, `Delete the ${obj} "QA TIA CRUD ${obj} v2".`, mode];
const S = (obj, change) => [obj, null, change, null, 's'];
const DESK2 = [
  ['contact', 'Create a contact with last name "QA TIA CRUD Contact" and email qa.tia.crud@example.com.', 'Change the phone of the contact "QA TIA CRUD Contact" to 0100000000.', 'Delete the contact "QA TIA CRUD Contact".', 'n'],
  ['account', 'Create an account named "QA TIA CRUD Account".', 'Change the website of the account "QA TIA CRUD Account" to https://example.com.', 'Delete the account "QA TIA CRUD Account".', 'n'],
  ['task', 'Create a task with subject "QA TIA CRUD Task" due tomorrow, owned by me.', 'Change the priority of the task "QA TIA CRUD Task" to High.', 'Delete the task "QA TIA CRUD Task".', 'n'],
  ['call', 'Log a call with subject "QA TIA CRUD Call" for today, 5 minutes.', 'Change the subject of the call "QA TIA CRUD Call" to "QA TIA CRUD Call v2".', 'Delete the call "QA TIA CRUD Call v2".', 'n'],
  ['event', 'Create an event "QA TIA CRUD Event" tomorrow from 10:00 to 10:30.', 'Move the event "QA TIA CRUD Event" to 11:00–11:30.', 'Delete the event "QA TIA CRUD Event".', 'n'],
  ['product', 'Create a product named "QA TIA CRUD Product".', 'Rename the product "QA TIA CRUD Product" to "QA TIA CRUD Product v2".', 'Delete the product "QA TIA CRUD Product v2".', 'n'],
  ['contract', 'Create a contract named "QA TIA CRUD Contract" for the account "QA TIA CRUD Account" starting today.', 'Rename the contract "QA TIA CRUD Contract" to "QA TIA CRUD Contract v2".', 'Delete the contract "QA TIA CRUD Contract v2".', 'n'],
  ['time entry', 'Add a time entry of 15 minutes named "QA TIA CRUD Time" for today, not billable.', 'Change the time entry "QA TIA CRUD Time" to 20 minutes.', 'Delete the time entry "QA TIA CRUD Time".', 'n'],
  G('round-robin rule', 'for tickets, between me only'), G('skill', 'of the default skill type'), G('skill type'), G('holiday list', 'with one holiday on 31 December 2026'),
  G('support plan'), G('ticket template', 'with subject "QA TIA CRUD template"'), G('knowledge base category'), G('knowledge base section'),
  ['knowledge base article', 'Create a draft knowledge base article titled "QA TIA CRUD Article" with the text "Test article". Do not publish it.', 'Change the title of the article "QA TIA CRUD Article" to "QA TIA CRUD Article v2".', 'Delete the article "QA TIA CRUD Article v2".', 'n'],
  G('email template', 'for tickets, with subject "QA TIA CRUD"'), G('email template folder'), G('snippet', 'with the text "Thanks for contacting us"'),
  G('notification rule', 'that notifies me when a ticket is created'), G('SLA escalation template'), G('SLA contract'), G('ticket view', 'showing open tickets'),
  G('assignment notification'), G('email suppression', 'for the address qa.tia.crud@example.com'), G('ticket layout rule', 'that makes Subject mandatory'), G('ticket validation rule', 'that requires Subject'), G('field dependency', 'between two ticket pick-list fields'), G('web form', 'for tickets with the field Subject'), G('custom action', 'that opens https://example.com'),
  G('department', '', 'r'), G('team', 'with me as the only member', 'r'), G('role', '', 'r'), G('profile', 'copied from the Agent profile', 'r'), G('agent', 'with email qa.tia.crud.agent@example.com', 'r'), G('ticket status', 'in the Open group', 'r'), G('agent skill', 'mapping me to a skill', 'r'), G('team assignment', '', 'r'),
  S('ticket number format', 'Change the ticket number format prefix to "QA-".'), S('spam settings', 'Turn spam detection off.'), S('time tracking', 'Turn time tracking off.'), S('happiness survey', 'Change the happiness survey question to "QA TIA CRUD how did we do?".'), S('team feed settings', 'Turn the team feed off.'), S('AI tagging', 'Turn AI tagging off.'), S('pick-list values', 'Add the value "QA TIA CRUD" to the ticket Priority pick list.'), S('business hours', 'Change our business hours to 9:00–17:00, Sunday to Thursday.'),
];
const OMNI = [
  ['contact', 'Create a contact (visitor) named "QA TIA CRUD Contact" with email qa.tia.crud@example.com.', 'Change the phone of the contact "QA TIA CRUD Contact" to 0100000000.', 'Delete the contact "QA TIA CRUD Contact".', 'n'],
  ['conversation', 'Start a new conversation with the contact "QA TIA CRUD Contact" with the message "QA TIA CRUD hello".', 'Add the tag "QA" to the conversation with "QA TIA CRUD Contact".', 'Close the conversation with "QA TIA CRUD Contact".', 'n'],
  G('chat routing rule', 'that routes chats to me'), G('visitor routing rule', 'that routes visitors to me'), G('call routing rule', 'that routes calls to me'), G('smart routing rule'), G('priority rule', 'that gives priority 1'),
  G('skill map', 'mapping me to the skill "QA"'), G('canned reply', 'with the text "Thanks for waiting"'), G('conversation tag'), G('message template', 'with the text "Hello"'), G('WhatsApp template', 'with the text "Hello", language English'),
  G('bot', 'with one welcome message "Hi"'), G('auto reply', 'with the text "We will be with you shortly"'), G('chat timeout override', 'of 10 minutes for my department'), G('moderation library', 'with the word "qatiacrud"'),
  G('people scoring rule', 'that adds 5 points when a visitor opens the pricing page'), G('monitor rule', 'that alerts me when a chat waits 5 minutes'), G('feedback form', 'with one rating question'), G('company scoring rule', 'that adds 5 points for company size over 100'),
  G('people view', 'showing contacts created today'), G('contact list'), G('chatbot value group', 'with the values A and B'), G('Live View preset'), G('article', 'with the text "Test article", not published'), G('chat invitation', 'shown after 60 seconds on the pricing page'),
  G('department', '', 'r'), G('operator', 'with email qa.tia.crud.op@example.com', 'r'), G('brand', '', 'r'), G('operator department link', 'adding me to the QA department', 'r'), G('department–brand link', '', 'r'), G('email domain', 'qa-tia-crud.example.com', 'r'),
  S('chat timeout', 'Change the chat timeout to 15 minutes.'), S('global settings', 'Change the visitor idle time to 10 minutes.'), S('conversation layout', 'Add the field Phone to the conversation layout.'), S('brand chat settings', 'Turn off the file upload in chat for our brand.'), S('routing selection settings', 'Change routing selection to round robin.'), S('lead scoring settings', 'Turn lead scoring off.'), S('brand moderation', 'Turn on moderation for our brand.'), S('brand isolation', 'Turn on brand isolation.'),
];
const LIST = SET === 'omni' ? OMNI : DESK2;
const PAGE = { app: process.env.APPKEY || process.env.APP };
const turn = async (msg, conv) => { const ex = { page: PAGE, ...(conv ? { conversation_id: conv } : {}) }; let r = await ask(msg, ex); if (/TIA_BUSY|RATE_LIMIT/.test(String(r.error) + String(r.j?.error?.code))) { await sleep(25000); r = await ask(msg, ex); } if (/CAP_REACHED/.test(String(r.error))) throw new Error('CAP_REACHED'); return r; };
const REFUSE = /cannot|can't|can not|not able|unable|not support|not allowed|couldn't build|could not/i;
const one = async (obj, op, msg, conv, allowConfirm) => {
  let r = await turn(msg + ' Prepare it as a card for me to confirm.', conv); conv = r.final?.conversation_id || conv;
  let acts = r.final?.pending_actions || [];
  if (!acts.length && !REFUSE.test(r.text || r.final?.text || '')) { const r2 = await turn('Yes, please prepare the card now.', conv); acts = r2.final?.pending_actions || []; r = { ...r, error: r.error || r2.error, text: (r.text || r.final?.text || '') + ' || FOLLOW-UP: ' + (r2.text || r2.final?.text || '') }; }
  const row = { set: SET, app: PAGE.app, obj, op, msg, conv, status: r.status, err: r.error || null, card: acts.map(a => a.kind).join(',') || null,
    summary: acts.map(a => (a.summary || '').replace(/\s+/g, ' ').slice(0, 300)).join(' | ') || null, lines: acts[0]?.lines?.slice(0, 8) || null,
    text: (r.text || r.final?.text || '').replace(/\s+/g, ' ').slice(0, 900), at: stamp() };
  if (acts.length) {
    if (allowConfirm) {
      const c = await api('POST', `/agents/tia/actions/${acts[0].id}/confirm`, {});
      row.confirm = { s: c.s, status: c.j?.data?.status, err: c.j?.error?.code, msg: String(c.j?.error?.message || '').slice(0, 300), data: JSON.stringify(c.j?.data || '').slice(0, 700) };
      for (const x of acts.slice(1)) await api('POST', `/agents/tia/actions/${x.id}/reject`, {});
      if (c.s < 300) ledger(`CRUD2 ${SET} ${obj} ${op}: Tia card confirmed (${c.j?.data?.status}) — check cleanup`);
    } else { row.rejected = []; for (const x of acts) row.rejected.push((await api('POST', `/agents/tia/actions/${x.id}/reject`, {})).s); }
  }
  fs.appendFileSync(OUT, JSON.stringify(row) + '\n'); return { row, conv };
};
const okc = row => row.confirm && row.confirm.s < 300 && row.confirm.status === 'done';
let n = 0;
for (const [obj, c, u, d, mode] of LIST) {
  if (doneObj.has(obj)) continue; n++;
  if (mode === 's') { await one(obj, 'settings', u, null, false); await sleep(2500); continue; }
  const a = await one(obj, 'create', c, null, mode === 'n'); await sleep(2500);
  if (okc(a.row)) {
    const b = await one(obj, 'update', u, a.conv, true); await sleep(2500);
    await one(obj, 'delete', okc(b.row) ? d : d.replace(' v2"', '"'), a.conv, true);
  } else {
    const b = await one(obj, 'update-existing', `Pick any existing ${obj} in ${APPN} (not one starting with QA TIA CRUD) and change its name by adding " (edited)" at the end.`, null, false); await sleep(2500);
    await one(obj, 'delete-existing', `Pick any existing ${obj} in ${APPN} and delete it.`, b.conv, false);
  }
  await sleep(2500);
}
return { set: SET, objects: n };
