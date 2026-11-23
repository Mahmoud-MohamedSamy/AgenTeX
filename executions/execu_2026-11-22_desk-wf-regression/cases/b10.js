const o = {}; const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const b2 = await mkRule('RG07 B2', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', fieldUpdates: { created_by: S(TU1) } }], { active: false }); o.B2 = b2.s + ' ' + (b2.err || 'saved'); if (b2.id) await api('DELETE', '/workflow/rules/' + b2.id);
const b8 = await mkRule('RG07 B8', { kind: 'RecordCreated' }, [{ type: 'CreateRecord', targetModuleId: CM, fieldMappings: { title: S('QA WF RG07 no last name') } }]); o.B8save = b8.s + ' ' + (b8.err || 'saved');
if (b8.id) { const t = await mkTicket('RG07 B8', { department: DEPT2 }); await sleep(20000); o.B8run = (await execs(t.id, b8.id)).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 200) + ')' : '')).join(',')); }
o.contactRequired = arr((await api('GET', `/modules/${CM}/fields`)).j?.data).filter(f => f.isRequired || f.required || f.is_required).map(f => f.fieldName);
return o;
