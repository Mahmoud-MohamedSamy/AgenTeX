const mid = await modId(); const L = await getLayout(mid, I.layout); const v = L.views.CREATE; const s = v.layout.sections.find(s => s.columns.some(c => c.fields.some(f => f.fieldName === 'qa_lr_order')));
return { sec: JSON.stringify(s).slice(0, 900), keys: Object.keys(v.layout) };
