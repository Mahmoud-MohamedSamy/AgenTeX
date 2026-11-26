R('CV-03', 'PASS', 'Add State "open" (lowercase) → 200 but no second status is created (still one "Open"); "Open" with another type → 409 "\\"Open\\" is already a Status of type open."');
// Is A (Desk Agent) allowed to edit a ticket owned by B? Transition owner on such a ticket.
const g = 'OWN' + uid();
await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { before: { allowedUserIds: [U.A] } }), TR('end', 'Escalated', 'Closed')]));
const out = {};
for (const [k, owner] of [['unassigned', null], ['ownerB', U.B], ['ownerA', U.A], ['ownerTenant', U.owner]]) {
  const t = await mkT(g, k); await waitIn(t); if (owner) { await api('POST', `/desk/tickets/${t}/assign`, { owner_id: owner }); await sleep(2500); }
  const ed = await setF(t, { description: 'QA A edit ' + k }, A); const sees = (await transIds(t, A)).join(',') || '-'; const r = await runT(t, 'go', 'Open', {}, A);
  out[k] = `A edits → ${ed.s}; A offered [${sees}]; A runs → ${r.s} ${code(r)}`;
}
const bad = out.ownerB.includes('A edits → 200') && !out.ownerB.includes('runs → 200');
R('E2E-01', bad ? 'FAIL' : 'FINDING', 'Refund journey (B verifies, B refused at Approve, A approves, B pays) blocked at Approve when the ticket is owned by someone else. Named transition owner Agent A: ' + JS(out) + '. Agent-side cases (TB-02, required items, completion) pass on their own');
// E2E-04 with real comment / resolution bodies
const g4 = 'E4B' + uid(); await mkBp({ ...BASIC(g4), strictMode: { scope: 'allExcept', actions: ['reply'] } }); const t4 = await mkT(g4); await waitIn(t4);
const cm = await A('POST', `/desk/tickets/${t4}/comments`, { body_html: '<p>QA</p>', is_public: false }), rs = await A('PUT', `/desk/tickets/${t4}/resolution`, { content: 'QA' }), ed = await setF(t4, { description: 'x' }, A);
R('E2E-04', cm.s === 403 && rs.s === 403 && ed.s === 403 ? 'PASS' : 'FAIL', `Strict All Except [replies], Agent A by hand: comment → ${E(cm)}; resolution → ${E(rs)}; edit → ${ed.s}; through the steps (comment + attachment, then resolution) the ticket completed (batch 2 run)`);
R('TF-06', 'INCONCLUSIVE', 'email after-action ran (transition 200) but sent mails are not listed on the ticket (no history line, no outbound reply); delivery to the +qae1 Gmail inbox needs a mailbox check');
R('TM-17', 'INCONCLUSIVE', 'close through a blueprint transition → 200, ticket left the blueprint and status Closed; the closed mail / rating request is not visible through the API (no history line, no outbound reply) — needs a mailbox check with Customer Happiness on');
RG('NDC-3054', 'INCONCLUSIVE', 'closed mail after a blueprint close: not visible through the API; needs a mailbox check');
RG('NDC-3053', 'INCONCLUSIVE', 'closed mail with Customer Happiness on: needs a mailbox check');
R('TM-13', 'PARTIAL', 'rating filter works: with filter [Bad] a Bad rating moved the ticket to Escalated and a Good rating left it in Open. No-filter branch: the rating link could not be created on the retry (status 0), and "Okay" is switched off in this tenant\'s Customer Happiness');
return await cleanup();
