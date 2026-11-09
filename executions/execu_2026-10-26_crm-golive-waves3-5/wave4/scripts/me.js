const a = await call('GET', '/iam/me/profile'); const b = await call('GET', '/iam/me/permissions'); const c = await call('GET', `/modules/${MODS.leads}/records?page=1&per_page=1&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288`);
return { me: a.s + ' ' + a.t.slice(0, 600), perms: b.s + ' ' + b.t.slice(0, 200), leads: c.s + ' ' + c.t.slice(0, 150) };
