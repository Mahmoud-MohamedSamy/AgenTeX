const out = {};
for (const f of ['title', 'description', 'last_name', 'mobile', 'type']) { const r = await mkRule('P14' + f, { kind: 'RecordCreated' }, [{ type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { [f]: S('QA WF x') } }], { active: false }); out[f] = r.s + ' ' + (r.err || ''); if (r.id) await api('DELETE', '/workflow/rules/' + r.id); }
const cf = arr((await api('GET', '/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/fields')).j.data).find(f => f.fieldName === 'description');
out.descField = cf && { sys: cf.isSystemManaged, ro: cf.config && cf.config.readOnly, dt: cf.datatypeKey, opts: JSON.stringify(cf.datatypeOptions).slice(0, 100) };
return out;
