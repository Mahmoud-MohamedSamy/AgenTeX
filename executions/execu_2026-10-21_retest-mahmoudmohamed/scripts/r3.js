const MID = 'c0394292-52a2-446d-a326-06733fe289ba', LID = '83c29e1a-37f1-4a43-b6b2-33a47cb4b666';
const lay = await getLayout(MID, LID);
const hits = []; for (const v of Object.keys(lay.views)) for (const s of (lay.views[v].layout?.sections || [])) for (const c of s.columns) for (const f of c.fields) if (f.fieldName === 'qa_rx') hits.push(v + ' ' + JSON.stringify(f.config));
const fld = (await fieldsOf(MID)).find(f => f.fieldName === 'qa_rx');
return done({ hits, fieldCfg: JSON.stringify(fld.config), fieldOpts: JSON.stringify(fld.datatypeOptions) });
