const mid = await modId(); const out = {}; const F = await fieldsOf(mid); const t = F.find(f => f.fieldName === 'qa_lr_tier');
const vals = process.env.UNDO ? ['Gold', 'Silver', 'Bronze'] : ['Gold', 'Silver', 'Bronze', 'ذهبي'];
const body = { ...t, datatypeOptions: { ...t.datatypeOptions, allowed_values: vals } }; for (const k of ['id','moduleId','createdAt','createdBy','createdByName','lastModifiedAt','lastModifiedBy','lastModifiedByName','layouts','capabilities']) delete body[k];
if (process.env.UNDO) { const tr = (await getRule(mid, I.r2)).j.data; tr.branches = I.r2orig; out.rule = SR(await putRule(mid, I.r2, tr)); out.opt = SR(await api('PUT', '/modules/' + mid + '/fields/' + t.id, body)); return out; }
out.opt = SR(await api('PUT', '/modules/' + mid + '/fields/' + t.id, body)).slice(0, 200);
const tr = (await getRule(mid, I.r2)).j.data; tr.branches = [...I.r2orig, br(eq('qa_lr_tier', 'ذهبي'), [show(['qa_lr_order'])]), br(eq('qa_lr_tier', 'Silver'), [{ type: 'show_message', field: null, tone: 'info', message: { en: 'QA en only msg' } }])];
out.rule = SR(await putRule(mid, I.r2, tr)).slice(0, 300); return out;
