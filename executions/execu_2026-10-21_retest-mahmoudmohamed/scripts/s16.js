const MID = 'c0394292-52a2-446d-a326-06733fe289ba', LID = '83c29e1a-37f1-4a43-b6b2-33a47cb4b666';
const F = await fieldsOf(MID); const id = n => F.find(f => f.fieldName === n).id;
const lay = await getLayout(MID, LID); const b = { ...lay }; delete b.id;
b.dependencies = [{ id: crypto.randomUUID(), parentFieldId: id('qa_pl'), parentValues: ['Alpha'], action: 'SHOW', childFieldIds: [id('qa_sl10')] }, { id: crypto.randomUUID(), parentFieldId: id('qa_pl'), parentValues: ['Beta'], action: 'HIDE', childFieldIds: [id('qa_email')] }];
const put = await api('PUT', `/modules/${MID}/layouts/${LID}`, b);
const after = (await getLayout(MID, LID)).dependencies;
return done({ put: put.s + ' ' + (put.s >= 300 ? put.t.slice(0, 200) : ''), deps: (after || []).length });
