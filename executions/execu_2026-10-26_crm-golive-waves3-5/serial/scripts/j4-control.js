const L = 'bf971461-2edc-45f2-b6e4-6e180aa64288', s = v => ({ kind: 'string', value: v });
const r = await call('POST', `/modules/${MODS.leads}/records`, { layout_id: L, data: [{ field: 'first_name', value: s('QA W1 J4 outside-owned') }, { field: 'phone', value: s('0101' + String(Date.now()).slice(-7)) }, { field: 'single_line_3_9', value: s('QA W1') }, { field: 'owner', value: s('d23fb4e0-248d-41f6-af60-d28885a7007e') }] });
return { control: r.s < 300 ? r.j.data.id : r.s + ' ' + r.t.slice(0, 150) };
