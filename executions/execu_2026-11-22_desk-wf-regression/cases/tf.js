const out = {}; const FCT = (fields, o = {}) => ({ kind: 'SpecificFieldChanged', fieldName: fields[0], fieldNames: fields, fieldMatch: o.match || 'any', alsoOnCreate: !!o.onCreate });
const mark = FU({ qa_ndc_agency_code: 'WF' });
// TF-01/02: one watch field per type
const types = { subject: ['QA WF TF02s ticket X', 'subject'], priority: ['high'], description: ['changed desc'], due_date: ['2026-12-30T10:00:00Z'], qa_ndc_agent_id: [77], customer_responded: [true], qa_ndc_issue_date: ['2026-12-01'], qa_ndc_traveling_ticket_number: [12.5] };
const per = {};
for (const [f, [v]] of Object.entries(types)) {
  const tag = 'TF02' + f.slice(0, 6);
  const r = await mkRule(tag, FCT([f]), [mark]);
  const t = await mkTicket(tag);
  await sleep(4000);
  await patchTicket(t.id, { classification: 'question' });           // other field: must NOT fire
  await sleep(12000); const other = await fired(t.id, r.id);
  const p = await patchTicket(t.id, { [f]: f === 'subject' ? `QA WF ${tag} renamed` : v });
  await waitFor(async () => (await fired(t.id, r.id)) > other, 30);
  per[f] = { save: r.s, err: r.err, onCreate: 0, otherField: other, patch: p.s + (p.err ? ' ' + p.err.slice(0, 80) : ''), afterChange: await fired(t.id, r.id) };
}
out.TF02 = per;
// TF-03 any of 3 / TF-04 all of 2
const rA = await mkRule('TF03', FCT(['priority', 'classification', 'description']), [mark]);
const tA = await mkTicket('TF03'); await sleep(3000); await patchTicket(tA.id, { description: 'x' }); await waitFor(async () => (await fired(tA.id, rA.id)) > 0, 30);
out.TF03 = { save: rA.s, err: rA.err, oneOf3: await fired(tA.id, rA.id) };
const rB = await mkRule('TF04', FCT(['priority', 'classification'], { match: 'all' }), [mark]);
const tB = await mkTicket('TF04'); await sleep(3000);
await patchTicket(tB.id, { priority: 'high' }); await sleep(12000); const onlyOne = await fired(tB.id, rB.id);
await patchTicket(tB.id, { priority: 'low', classification: 'feature' }); await waitFor(async () => (await fired(tB.id, rB.id)) > onlyOne, 30);
out.TF04 = { save: rB.s, err: rB.err, oneChanged: onlyOne, bothChanged: await fired(tB.id, rB.id) };
// TF-05 same field twice / 4 fields
const dup = await mkRule('TF05dup', FCT(['priority', 'priority']), [mark]); const four = await mkRule('TF05four', FCT(['priority', 'classification', 'description', 'subject']), [mark]);
out.TF05 = { dup: dup.s + ' ' + (dup.err || ''), four: four.s + ' ' + (four.err || '') };
// TF-06/07 also on create on/off
const rC = await mkRule('TF06', FCT(['priority'], { onCreate: true }), [mark]);
const tC = await mkTicket('TF06'); await waitFor(async () => (await fired(tC.id, rC.id)) > 0, 30); const cc = await fired(tC.id, rC.id);
await patchTicket(tC.id, { classification: 'question' }); await sleep(12000);
out.TF06 = { onCreate: cc, afterOtherEdit: await fired(tC.id, rC.id) };
// TF-08 changed to / changed from
const rD = await mkRule('TF08', FCT(['priority']), [mark], { criteria: { kind: 'ChangedTo', field: 'priority', value: S('urgent') } });
const tD = await mkTicket('TF08'); await sleep(3000); await patchTicket(tD.id, { priority: 'high' }); await sleep(12000); const toHigh = await fired(tD.id, rD.id);
await patchTicket(tD.id, { priority: 'urgent' }); await waitFor(async () => (await fired(tD.id, rD.id)) > toHigh, 30);
const rE = await mkRule('TF08b', FCT(['priority']), [mark], { criteria: { kind: 'ChangedFrom', field: 'priority', value: S('medium') } });
const tE = await mkTicket('TF08b'); await sleep(3000); await patchTicket(tE.id, { priority: 'high' }); await waitFor(async () => (await fired(tE.id, rE.id)) > 0, 30); const fromMed = await fired(tE.id, rE.id);
await patchTicket(tE.id, { priority: 'low' }); await sleep(12000);
out.TF08 = { changedTo: { save: rD.s, err: rD.err, toHigh, toUrgent: await fired(tD.id, rD.id) }, changedFrom: { save: rE.s, err: rE.err, medToHigh: fromMed, highToLow: await fired(tE.id, rE.id) } };
// TF-09 clear and set
const rF = await mkRule('TF09', FCT(['due_date']), [mark]);
const tF = await mkTicket('TF09', { due_date: '2026-12-20T10:00:00Z' }); await sleep(3000);
await patchTicket(tF.id, { due_date: null }); await waitFor(async () => (await fired(tF.id, rF.id)) > 0, 30); const cl = await fired(tF.id, rF.id);
await patchTicket(tF.id, { due_date: '2026-12-21T10:00:00Z' }); await waitFor(async () => (await fired(tF.id, rF.id)) > cl, 30);
out.TF09 = { cleared: cl, set: await fired(tF.id, rF.id), dueNow: (await getTicket(tF.id)).due_date };
fs.writeFileSync(RUN + '/out/tf.json', JSON.stringify(out, null, 1));
return out;
