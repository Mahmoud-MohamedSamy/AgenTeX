// Read-only: round 9 QA RT workflow rules / approval / review / assignment processes that exist now (orphans from a broken run).
const q = async p => arr((await api('o', 'GET', p)).j?.data).filter(x => /^QA RT/.test(x.name || '')).map(x => [x.id, x.name, x.isActive]);
return { rules: await q('/workflow/rules?take=200'), approvals: await q('/workflow/approval-processes'), reviews: await q('/workflow/review-processes'), assign: await q('/workflow/assignment-rules') };
