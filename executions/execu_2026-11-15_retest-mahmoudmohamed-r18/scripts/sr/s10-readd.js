const f = (await fieldsOf(L)).find(x => x.fieldName === 'qa_rt18sr_pl3');
const r = await api('PUT', '/modules/' + L + '/fields/' + f.id, { ...f, datatypeOptions: { allowed_values: ['Alpha', 'Beta'] }, config: { ...(f.config || {}), allowed_values: ['Alpha', 'Beta'] } });
const u = await updRec(I.k2ui.rec, { qa_rt18sr_pl3: 'Alpha' });
LED('changed field qa_rt18sr_pl3 options back to Alpha,Beta; record QA RT18 SR K2 ui lead ' + I.k2ui.rec + ' set to Alpha again (Leads)');
const g = await getRule(I.k2ui.rule);
return { put: SR(r).slice(0, 100), rec: u.s, score: await score(I.k2ui.rec), stale: JSON.stringify(g.j.data.stale_entries) };
