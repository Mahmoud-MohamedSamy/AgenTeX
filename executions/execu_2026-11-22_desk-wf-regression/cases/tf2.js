const FCT = f => ({ kind: 'SpecificFieldChanged', fieldName: f, fieldNames: [f], fieldMatch: 'any', alsoOnCreate: false });
const mark = FU({ qa_ndc_agency_code: 'WF' }); const out = {};
for (const [tag, f, v] of [['TF02cr', 'customer_responded', true], ['TF02dt', 'qa_ndc_issue_date', '2026-12-01'], ['TF02dc', 'qa_ndc_traveling_ticket_number', 12.5], ['TF02cb', 'checkbox_displayed_by_layout_rules', true]]) {
  const r = await mkRule(tag, FCT(f), [mark]); const t = await mkTicket(tag); await sleep(4000);
  const before = (await getTicket(t.id))[f]; const p = await patchTicket(t.id, { [f]: v });
  await waitFor(async () => (await fired(t.id, r.id)) > 0, 30);
  out[f] = { save: r.s, err: r.err, before, patch: p.s + (p.err ? ' ' + p.err.slice(0, 100) : ''), after: (await getTicket(t.id))[f], fired: await fired(t.id, r.id) };
}
return out;
