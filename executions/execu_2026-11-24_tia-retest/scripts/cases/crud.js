// Tia CRUD capability test (25 Nov). Per object: create QA item -> update it -> delete it. Confirm only QA-named items;
// if create fails, ask update/delete on an existing item and REJECT the card (capability check only).
const APPN = process.env.APP === 'crm' ? 'CRM' : 'Desk';
const OUT = RUN + '/out/crud-results.jsonl';
const doneKeys = new Set((fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l)) : []).filter(x => x.app === process.env.APP).map(x => x.obj + ':' + x.op));
const SAFE = 'Keep it inactive / not active, and if it needs criteria, apply it only to records whose name starts with "QA TIA CRUD".';
const CRM = [
 ['record (lead)', 'Create a lead with first name QA TIA CRUD, last name Lead, company QA CRUD Co.', 'Change the lead source of the lead "QA TIA CRUD Lead" to Referral.', 'Delete the lead "QA TIA CRUD Lead".'],
 ['module', 'Create a new custom module in CRM named "QA TIA CRUD Module".', 'Rename the CRM module "QA TIA CRUD Module" to "QA TIA CRUD Module v2".', 'Delete the CRM module "QA TIA CRUD Module v2".'],
 ['field', 'Add a new single-line text field named "QA TIA CRUD Field" to the Leads module.', 'Rename the Leads field "QA TIA CRUD Field" to "QA TIA CRUD Field v2".', 'Delete the Leads field "QA TIA CRUD Field v2".'],
 ['layout', 'Create a new layout named "QA TIA CRUD Layout" in the Leads module.', 'Rename the Leads layout "QA TIA CRUD Layout" to "QA TIA CRUD Layout v2".', 'Delete the Leads layout "QA TIA CRUD Layout v2".'],
 ['workflow rule', `Create a workflow rule named "QA TIA CRUD Workflow" on Leads: when a lead is created, add a task "QA TIA CRUD follow up". ${SAFE}`, 'Rename the workflow rule "QA TIA CRUD Workflow" to "QA TIA CRUD Workflow v2".', 'Delete the workflow rule "QA TIA CRUD Workflow v2".'],
 ['assignment rule', `Create an assignment rule named "QA TIA CRUD Assignment" on Leads that assigns leads to me. ${SAFE}`, 'Rename the assignment rule "QA TIA CRUD Assignment" to "QA TIA CRUD Assignment v2".', 'Delete the assignment rule "QA TIA CRUD Assignment v2".'],
 ['approval process', `Create an approval process named "QA TIA CRUD Approval" on Leads with me as the approver. ${SAFE}`, 'Rename the approval process "QA TIA CRUD Approval" to "QA TIA CRUD Approval v2".', 'Delete the approval process "QA TIA CRUD Approval v2".'],
 ['review process', `Create a review process named "QA TIA CRUD Review" on Leads with me as the reviewer. ${SAFE}`, 'Rename the review process "QA TIA CRUD Review" to "QA TIA CRUD Review v2".', 'Delete the review process "QA TIA CRUD Review v2".'],
 ['blueprint', `Create a blueprint named "QA TIA CRUD Blueprint" on Leads using the Lead Status field, with one transition from New to Contacted. ${SAFE}`, 'Rename the blueprint "QA TIA CRUD Blueprint" to "QA TIA CRUD Blueprint v2".', 'Delete the blueprint "QA TIA CRUD Blueprint v2".'],
 ['scoring rule', `Create a scoring rule named "QA TIA CRUD Scoring" on Leads that adds 10 points when the lead source is Web. ${SAFE}`, 'Rename the scoring rule "QA TIA CRUD Scoring" to "QA TIA CRUD Scoring v2".', 'Delete the scoring rule "QA TIA CRUD Scoring v2".'],
 ['validation rule', `Create a validation rule named "QA TIA CRUD Validation" on Leads: Company must not be empty. ${SAFE}`, 'Rename the validation rule "QA TIA CRUD Validation" to "QA TIA CRUD Validation v2".', 'Delete the validation rule "QA TIA CRUD Validation v2".'],
 ['layout rule', `Create a layout rule named "QA TIA CRUD Layout Rule" on Leads: when Lead Source is Web, make Company mandatory. ${SAFE}`, 'Rename the layout rule "QA TIA CRUD Layout Rule" to "QA TIA CRUD Layout Rule v2".', 'Delete the layout rule "QA TIA CRUD Layout Rule v2".'],
 ['pipeline', 'Create a pipeline named "QA TIA CRUD Pipeline" for Transactions with the stages Open and Won.', 'Rename the pipeline "QA TIA CRUD Pipeline" to "QA TIA CRUD Pipeline v2".', 'Delete the pipeline "QA TIA CRUD Pipeline v2".'],
 ['web form', 'Create a web form named "QA TIA CRUD Form" for Leads with the fields Last Name and Company.', 'Rename the web form "QA TIA CRUD Form" to "QA TIA CRUD Form v2".', 'Delete the web form "QA TIA CRUD Form v2".'],
 ['custom button', 'Create a custom button named "QA TIA CRUD Button" on the Leads detail page that opens https://example.com.', 'Rename the button "QA TIA CRUD Button" to "QA TIA CRUD Button v2".', 'Delete the button "QA TIA CRUD Button v2".'],
];
const DESK = [
 ['record (ticket)', 'Create a ticket with subject "QA TIA CRUD Ticket" in my first department, priority Low.', 'Change the priority of the ticket "QA TIA CRUD Ticket" to High.', 'Delete the ticket "QA TIA CRUD Ticket".'],
 ['field', 'Add a new single-line text field named "QA TIA CRUD Field" to Tickets.', 'Rename the Tickets field "QA TIA CRUD Field" to "QA TIA CRUD Field v2".', 'Delete the Tickets field "QA TIA CRUD Field v2".'],
 ['layout', 'Create a new ticket layout named "QA TIA CRUD Layout".', 'Rename the ticket layout "QA TIA CRUD Layout" to "QA TIA CRUD Layout v2".', 'Delete the ticket layout "QA TIA CRUD Layout v2".'],
 ['workflow rule', `Create a ticket workflow rule named "QA TIA CRUD Workflow": when a ticket is created, set priority to High. ${SAFE}`, 'Rename the ticket workflow rule "QA TIA CRUD Workflow" to "QA TIA CRUD Workflow v2".', 'Delete the ticket workflow rule "QA TIA CRUD Workflow v2".'],
 ['assignment rule', `Create a ticket assignment rule named "QA TIA CRUD Assignment" that assigns tickets to me. ${SAFE}`, 'Rename the ticket assignment rule "QA TIA CRUD Assignment" to "QA TIA CRUD Assignment v2".', 'Delete the ticket assignment rule "QA TIA CRUD Assignment v2".'],
 ['SLA policy', `Create an SLA policy named "QA TIA CRUD SLA" with a first response time of 8 hours for High priority. ${SAFE}`, 'Rename the SLA policy "QA TIA CRUD SLA" to "QA TIA CRUD SLA v2".', 'Delete the SLA policy "QA TIA CRUD SLA v2".'],
 ['blueprint', `Create a ticket blueprint named "QA TIA CRUD Blueprint" on the Status field with one transition from Open to On Hold. ${SAFE}`, 'Rename the ticket blueprint "QA TIA CRUD Blueprint" to "QA TIA CRUD Blueprint v2".', 'Delete the ticket blueprint "QA TIA CRUD Blueprint v2".'],
 ['macro', 'Create a macro named "QA TIA CRUD Macro" that sets the ticket status to On Hold.', 'Rename the macro "QA TIA CRUD Macro" to "QA TIA CRUD Macro v2".', 'Delete the macro "QA TIA CRUD Macro v2".'],
 ['tag', 'Create a ticket tag named "QA TIA CRUD Tag".', 'Rename the tag "QA TIA CRUD Tag" to "QA TIA CRUD Tag v2".', 'Delete the tag "QA TIA CRUD Tag v2".'],
];
const LIST = process.env.APP === 'crm' ? CRM : DESK;
const turn = async (msg, conv) => { let r = await ask(msg, conv ? { conversation_id: conv } : {}); if (/TIA_BUSY|RATE_LIMIT/.test(String(r.error) + String(r.j?.error?.code))) { await sleep(20000); r = await ask(msg, conv ? { conversation_id: conv } : {}); } return r; };
const REFUSE = /cannot|can't|can not|not able|unable|not support|not allowed|couldn't build/i;
const one = async (obj, op, msg, conv, allowConfirm) => {
  let r = await turn(msg + ' Prepare it as a card for me to confirm.', conv); conv = r.final?.conversation_id || conv;
  let acts = r.final?.pending_actions || [];
  if (!acts.length && !REFUSE.test(r.text || r.final?.text || '')) { const r2 = await turn('Yes, please prepare the card now.', conv); acts = r2.final?.pending_actions || []; r = { ...r, text: (r.text || r.final?.text || '') + ' || FOLLOW-UP: ' + (r2.text || r2.final?.text || '') }; }
  const row = { app: process.env.APP, obj, op, msg, conv, status: r.status, err: r.error || null, card: acts.map(a => a.kind).join(',') || null,
    summary: acts.map(a => (a.summary || '').replace(/\s+/g, ' ').slice(0, 300)).join(' | ') || null, lines: acts[0]?.lines?.slice(0, 8) || null,
    text: (r.text || r.final?.text || '').replace(/\s+/g, ' ').slice(0, 900), at: stamp() };
  if (acts.length) {
    if (allowConfirm) {
      const c = await api('POST', `/agents/tia/actions/${acts[0].id}/confirm`, {});
      row.confirm = { s: c.s, status: c.j?.data?.status, err: c.j?.error?.code, msg: String(c.j?.error?.message || c.j?.data?.error || '').slice(0, 300), data: JSON.stringify(c.j?.data || '').slice(0, 600) };
      for (const x of acts.slice(1)) await api('POST', `/agents/tia/actions/${x.id}/reject`, {});
      if (c.s < 300) ledger(`CRUD ${process.env.APP} ${obj} ${op}: Tia card confirmed (${c.j?.data?.status}) — check cleanup`);
    } else { row.rejected = []; for (const x of acts) row.rejected.push((await api('POST', `/agents/tia/actions/${x.id}/reject`, {})).s); }
  }
  fs.appendFileSync(OUT, JSON.stringify(row) + '\n'); return { row, conv };
};
const lbl = row => row.confirm ? 'card→' + (row.confirm.status || row.confirm.err || row.confirm.s) : (row.card || 'no card');
const sum = [];
for (const [obj, c, u, d] of LIST) {
  if (doneKeys.has(obj + ':delete') || doneKeys.has(obj + ':delete-existing')) continue;
  const a = await one(obj, 'create', c, null, true);
  const ok = a.row.confirm && a.row.confirm.s < 300 && !/fail|error|reject/i.test(String(a.row.confirm.status));
  await sleep(3000);
  if (ok) {
    const b = await one(obj, 'update', u, a.conv, true); await sleep(3000);
    const renamed = b.row.confirm && b.row.confirm.s < 300 && !/fail|error/i.test(String(b.row.confirm.status));
    const x = await one(obj, 'delete', renamed ? d : d.replace(' v2"', '"'), a.conv, true);
    sum.push([obj, 'C:' + lbl(a.row), 'U:' + lbl(b.row), 'D:' + lbl(x.row)]);
  } else {
    const b = await one(obj, 'update-existing', `Pick any existing ${obj} in ${APPN} (not one starting with QA TIA CRUD) and change its name by adding " (edited)" at the end.`, null, false); await sleep(3000);
    const x = await one(obj, 'delete-existing', `Pick any existing ${obj} in ${APPN} and delete it.`, b.conv, false);
    sum.push([obj, 'C:' + lbl(a.row), 'U(existing):' + lbl(b.row), 'D(existing):' + lbl(x.row)]);
  }
}
return sum;
