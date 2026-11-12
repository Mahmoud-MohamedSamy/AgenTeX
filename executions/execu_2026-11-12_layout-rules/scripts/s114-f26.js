const mid = await modId(); const out = {};
const pid = '6f2daba4-7087-4950-8ddc-92c3491a663a'; I.f26prof = pid; SAVE(); LED('profile ' + pid);
const v = (await getRule(mid, I.r3)).j.data; v.branches[0].actions = [...v.branches[0].actions.filter(a => a.type !== 'show_message'), { type: 'show_message', field: null, tone: 'info', message: { en: 'QA F26 profile msg' }, profileIds: [pid] }];
out.rule = SR(await putRule(mid, I.r3, v)).slice(0, 200);
const d = await api('DELETE', '/iam/profiles/' + pid); out.delProf = SR(d).slice(0, 300);
const g = (await getRule(mid, I.r3)).j.data; out.after = g.status + ' err=' + JSON.stringify(g.definitionError || null) + ' msg=' + JSON.stringify(g.branches[0].actions.find(a => a.type === 'show_message'));
return out;
