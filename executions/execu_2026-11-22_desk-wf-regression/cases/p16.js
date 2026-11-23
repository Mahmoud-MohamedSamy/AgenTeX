const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF P16', isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: guard('QA WF P16 '), actions: [{ order: 0, type: 'OwnerAssignment', ownerTargetKind: 'Bogus', ownerValue: 'x' }], departmentIds: [DEPT2] });
const LG = fs.readFileSync(RUN + '/ledger.md', 'utf8');
const tid = n => LG.split('\n').filter(l => l.includes(`"QA WF ${n} ticket"`)).pop().split(' ').pop();
const rules = arr((await api('GET', '/workflow/rules?moduleId=' + T + '&take=200')).j.data);
const rr = rules.find(x => x.name === 'QA WF AC2r');
const lay = (await api('GET', `/modules/${T}/records/${tid('AC2l')}`)).j.data;
const exq = arr((await api('GET', '/workflow/executions?ruleId=' + rr.id)).j.data);
return { kinds: JSON.stringify(r.j && r.j.error && r.j.error.details), layoutOfTicket: lay.layout_id || lay.layoutId || JSON.stringify(Object.keys(lay)), replaceRule: { active: rr.isActive, actions: JSON.stringify(rr.actions.map(a => ({ t: a.type, mode: a.mode, tags: a.tagIds }))), runs: exq.length } };
