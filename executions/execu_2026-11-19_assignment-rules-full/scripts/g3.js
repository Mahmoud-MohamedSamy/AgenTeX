const L = [];
// F-07e slot freed by moving a ticket to another department
await mk('Y1', 'QA AR FB Y1 move-trigger'); await sleep(8000); L.push({ y1backlog: await bl(IDS.TK_Y1) });
const mv = sh(await patchT(IDS.TK_X3, { department: IDS.DA })); let s = await watchK(['TK_Y1'], 100);
L.push(R_('F-07e', s.TK_Y1 && s.TK_Y1.startsWith('A1') ? 'Pass' : 'Fail', 'Assign backlogs on; A1 full; one A1 ticket moved Dept B → Dept A (' + mv.s + '): backlog ticket Y1 → ' + JSON.stringify(s)));
// F-11 in_backlog flag
await mk('Y2', 'QA AR FB Y2 manual'); await mk('Y3', 'QA AR FB Y3 move'); await prefsS(IDS.DB, { assign_backlogs: false }); await sleep(8000);
const b2 = await bl(IDS.TK_Y2), b3 = await bl(IDS.TK_Y3);
const asg = sh(await api('POST', '/desk/tickets/' + IDS.TK_Y2 + '/assign', { owner_id: IDS.A2, team_id: null })); await sleep(3000);
const mv2 = sh(await patchT(IDS.TK_Y3, { department: IDS.DA })); await sleep(3000);
const a2 = await bl(IDS.TK_Y2), a3 = await bl(IDS.TK_Y3);
L.push(R_('F-11', b2 && b3 && a2 === false && a3 === false ? 'Pass' : 'Fail', 'in_backlog: Y2 ' + b2 + ' → manual assign to A2 (' + asg.s + ') → ' + a2 + '; Y3 ' + b3 + ' → moved to Dept A (' + mv2.s + ') → ' + a3 + ' (owner ' + await ownN(IDS.TK_Y3) + ')'));
// F-16 unmatched unassigned ticket is not backlog
const u = await mkTicket('QA AR NOMATCH unassigned', IDS.DB); IDS.TK_NOM = u.id; saveIds(); await sleep(8000);
L.push(R_('F-16', (await bl(u.id)) === false && !(await ownN(u.id)) ? 'Pass' : 'Fail', 'Unassigned ticket matching no round-robin rule: owner ' + await ownN(u.id) + ', in_backlog ' + await bl(u.id) + ' (expected not backlog)'));
return L;
