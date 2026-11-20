const L = [];
const y3 = { after: await bl(IDS.TK_Y3), owner: await ownN(IDS.TK_Y3), dept: (await getT(IDS.TK_Y3)).department === IDS.DA ? 'DA' : 'DB' };
L.push(R_('F-11', y3.after === false ? 'Pass' : 'Fail', 'in_backlog cleared: Y2 true → manual assign to A2 → false (after ~5 s); Y3 true → moved to Dept A via Desk move (200) → in_backlog ' + y3.after + ', dept ' + y3.dept + ', owner ' + y3.owner));
await prefsS(IDS.DB, { assign_backlogs: true }); const before = await ownN(IDS.TK_Y1); const a1 = await wlo(IDS.A1, IDS.DB);
const mv = await moveT(IDS.TK_X3, IDS.DA); const s = await watchK(['TK_Y1'], 100);
L.push(R_('F-07e', s.TK_Y1 && s.TK_Y1.startsWith('A1') ? 'Pass' : 'Fail', 'Assign backlogs on; A1 full (' + a1 + '/7); A1 ticket X3 moved Dept B → Dept A (' + mv.s + '): backlog Y1 (owner before ' + before + ') → ' + JSON.stringify(s)));
return L;
