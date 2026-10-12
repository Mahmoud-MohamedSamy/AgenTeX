const r = await api('GET', '/workflow/rules');
const mine = arr(r.j.data).filter(x => /^QA 2205/.test(x.name)).map(x => ({ id: x.id, name: x.name, active: x.isActive, layout: x.layoutId, trig: x.trigger.kind + ' ' + (x.trigger.fieldName || ''), crit: JSON.stringify(x.criteria).slice(0, 200), act: x.actions.map(a => a.type + ' ' + JSON.stringify(a.fieldUpdates)) }));
const others = arr(r.j.data).filter(x => !/^QA 2205/.test(x.name)).map(x => ({ name: x.name, active: x.isActive, trig: x.trigger.kind, act: x.actions.map(a => a.type + ' ' + JSON.stringify(a.fieldUpdates || a.tagIds || a.taskTitle)) }));
return done({ mine, others });
