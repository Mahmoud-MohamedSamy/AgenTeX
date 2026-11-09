const f = arr((await api('o','GET',`/modules/${T.LEADS}/fields`)).j?.data);
const ls = f.find(x => x.apiName==='lead_source');
const bp = arr((await api('o','GET',`/modules/${T.LEADS}/blueprints`)).j?.data)[0];
return { opts: JSON.stringify(ls.datatypeOptions).slice(0,800), entry: bp.definition.entryCriteria, layout: bp.definition.layoutId, states: bp.definition.states.map(s=>s.id) };
