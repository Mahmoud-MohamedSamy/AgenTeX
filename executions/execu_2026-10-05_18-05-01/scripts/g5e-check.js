const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets'); const MID = QA.id;
const DEF = arr((await api('GET', `/modules/${MID}/layouts`)).j.data).find(x => x.isDefault);
const f = arr((await api('GET', `/modules/${MID}/fields`)).j.data).find(x => x.fieldName === 'qa_req');
const lay = (await api('GET', `/modules/${MID}/layouts/${DEF.id}`)).j.data; let lf = null;
for (const s of lay.views.CREATE.layout.sections) for (const c of s.columns) for (const x of c.fields) if (x.fieldName === 'qa_req') lf = x;
page.off('request', onReq);
return JSON.stringify({ field: { required: f.required, config: f.config, datatypeOptions: f.datatypeOptions }, inLayout: lf && { required: lf.required, config: lf.config, readOnly: lf.readOnly, read_only: lf.read_only } });
