const L = []; const tS = async id => (await getT(id)).skills;
L.push({ prefs: (await prefsG(IDS.DA)).assign_to_offline_agents, pres: await pres([IDS.A1, IDS.A2, IDS.A3]) });
const go = async s => { const t = await mkTicket(s, IDS.DA); const o = await waitO(t.id, 25); const h = (await hist(t.id)).filter(x => /auto_assigned|skill/.test(x)).map(x => x.slice(0, 160)); return { s, skills: await tS(t.id), owner: o.owner, in_backlog: await bl(t.id), h }; };
const r = [await go('QA AR SKR clean none 1'), await go('QA AR SKR clean none 2'), await go('QA AR SKR clean QA AR SK1 QA AR SK2'), await go('QA AR SKR clean QA AR SK1')];
L.push(r);
L.push(R_('E-14a', r[3].owner === 'A1' ? 'Pass' : 'Fail', 'Skill-based, ticket with sk1 only → ' + r[3].owner + ' (A1 holds sk1)'));
L.push(R_('E-14b', r[0].owner && r[1].owner ? 'Pass' : 'Fail', 'Skill-based, tickets with no skills → ' + r[0].owner + ', ' + r[1].owner + ' (RR-9: any agent of the department is eligible); in_backlog ' + r[0].in_backlog + '/' + r[1].in_backlog));
L.push(R_('E-14c', !r[2].owner ? 'Pass' : 'Fail', 'Skill-based, ticket with sk1 + sk2 (no agent holds both) → ' + r[2].owner + ', in_backlog ' + r[2].in_backlog + ' (RR-9: only agents holding every skill are eligible)'));
return L;
