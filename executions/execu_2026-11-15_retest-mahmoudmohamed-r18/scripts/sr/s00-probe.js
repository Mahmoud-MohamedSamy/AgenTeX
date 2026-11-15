const rl = await listRules(); log('leads rules', rl.length, rl.map(x => x.name + ' ' + x.is_active).join(' | '));
const fs_ = await fieldsOf(L); const sc = fs_.find(x => x.fieldName === 'score'); log('score field', sc ? sc.datatypeKey + ' ' + sc.id : 'none');
log('user fields', fs_.filter(x => /user|owner/i.test(x.datatypeKey)).map(x => x.fieldName + ':' + x.datatypeKey).join(','));
log('qa fields', fs_.filter(x => /qa_/.test(x.fieldName)).map(x => x.fieldName).join(','));
const r = await api('GET', '/scoring-rules/00000000-0000-0000-0000-000000000002'); log('get unknown', SR(r));
log('sample rule shape', rl[0] ? JSON.stringify(rl[0]).slice(0, 600) : '-');
