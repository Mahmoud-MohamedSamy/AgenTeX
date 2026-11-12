const mid = await modId(); const out = {}; const PR = '11111111-1111-1111-1111-111111111103';
for (const [f, p] of [['qa_lr_order', 'read_only'], ['qa_lr_date', 'hidden']]) { const r = await api('POST', '/modules/' + mid + '/field-permissions', { fieldId: I.fields[f], profileId: PR, permission: p }); out[f] = SR(r).slice(0, 250); if (r.j && r.j.data && r.j.data.id) { (I.fps = I.fps || []).push(r.j.data.id); SAVE(); LED('field permission ' + f + ' ' + p + ' for profile User id ' + r.j.data.id); } }
return out;
