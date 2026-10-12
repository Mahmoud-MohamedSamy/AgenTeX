const r = await api('GET', '/workflow/rules');
return done(arr(r.j.data).map(x => ({ id: x.id, name: x.name, trig: x.trigger, active: x.isActive, actions: x.actions.map(a => a.type + (a.tagIds ? JSON.stringify(a.tagIds) : '')), createdBy: x.createdBy, createdAt: x.createdAt })));
