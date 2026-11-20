async (page) => { EVAL
const a=await z('GET','/api/v1/blueprints/1499272000000432068');const j=a.j;return {name:j.name,active:j.active,criteria:j.criteria,trans:(j.transitions||[]).map(t=>t.name+' id='+t.id+' from='+JSON.stringify(t.fromState||t.from||'')+' to='+JSON.stringify(t.toState||t.to||'')),states:JSON.stringify(j.states||j.fieldValues||'').slice(0,400),keys:Object.keys(j)};}
