const mid = await modId(); const o = {};
for (const f of (await fieldsOf(mid)).filter(f => f.fieldName.startsWith('qa_vr_'))) { const d = await api('DELETE', '/modules/' + mid + '/fields/' + f.id); if (d.s >= 300) o['field ' + f.fieldName] = SR(d).slice(0, 150); }
o.fieldsLeft = (await fieldsOf(mid)).filter(f => f.fieldName.startsWith('qa_vr_')).map(f => f.fieldName);
if (APP === 'desk' && I.contact) { const cm = await modId('desk_contacts'); const d = await api('DELETE', '/modules/' + cm + '/records/' + I.contact); o.contact = d.s; if (d.s < 300) { I.purgeExtra = (I.purgeExtra || []).concat([I.contact]); SAVE(); } }
o.rulesLeft = (await rules(mid)).map(r => r.name); o.layoutsLeft = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data).filter(l => l.name.startsWith(P)).map(l => l.name);
LED('final cleanup ' + JSON.stringify(o).slice(0, 300)); return o;
