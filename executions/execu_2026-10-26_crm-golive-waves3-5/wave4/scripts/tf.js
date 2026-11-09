const f = await call('GET', `/modules/${MODS.tasks}/fields`);
const arr = Array.isArray(f.j.data) ? f.j.data : f.j.data.fields;
const ro = await call('GET', '/desk/activities/reminders/options');
return { fields: arr.filter(x => /due|remind|status|subject|repeat|owner|related|priority/i.test(x.apiName)).map(x => x.apiName + ':' + x.datatypeKey + ' ' + JSON.stringify(x.datatypeOptions || {}).slice(0, 160)), reminderOptions: ro.s + ' ' + ro.t.slice(0, 400) };
