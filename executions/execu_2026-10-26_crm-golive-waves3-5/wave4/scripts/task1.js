const due = new Date(Date.now() + 7 * 60000); due.setSeconds(0, 0);
const s = v => ({ kind: 'string', value: v });
const c = await call('POST', `/modules/${MODS.tasks}/records`, { layout_id: '40c084f2-f062-45d5-ac70-132a7597fac0', data: [{ field: 'name', value: s('QA W4 Reminder task') }, { field: 'subject', value: s('QA W4 Reminder task') }, { field: 'status', value: s('Not Started') }, { field: 'due_date', value: s(due.toISOString().replace('.000Z', 'Z')) }, { field: 'reminder_offset_minutes', value: s('5') }, { field: 'related_to', value: s('f68207e6-1bf9-4134-a3ae-7e29db2c45e9') }] });
return { create: c.s + ' ' + (c.s < 300 ? c.j.data.id : c.t.slice(0, 400)), due: due.toISOString(), now: new Date().toISOString() };
