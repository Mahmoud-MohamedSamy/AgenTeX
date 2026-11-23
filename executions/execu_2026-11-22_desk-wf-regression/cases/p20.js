const TLR = '913b2c84-f235-404d-b563-c2cfa9566b6a';
const rl = arr((await api('GET', '/workflow/rules?moduleId=' + T + '&take=300')).j.data).find(r => r.name === 'QA WF RMlay');
let y = await mkTicket('RMlay', { department: DEPT, _layout: TLR }, 'Y3');
const first = y.err;
if (!y.id) y = await mkTicket('RMlay', { department: DEPT, _layout: TLR, checkbox_mandatory_by_layout_rules: true, checkbox_in_section_displayed_by_layout_rules: true }, 'Y2');
await sleep(25000);
const rec = y.id ? (await api('GET', `/modules/${T}/records/${y.id}`)).j.data : {};
return { firstErr: first, second: y.id ? 'created' : y.err, layout: rec.created_with_layout_id, fired: y.id ? await fired(y.id, rl.id) : '-', otherLayoutTicket: 'N fired 0' };
