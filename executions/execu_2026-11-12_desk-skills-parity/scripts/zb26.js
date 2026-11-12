const d=await z('GET',`/layouts/1475109000000439896`); const j=d.j;
const out=[]; for(const s of (j.sections||[])) for(const f of (s.fields||[])) if(/skill/i.test(f.apiName||f.name||'')) out.push({section:s.name, f});
return {n:(j.sections||[]).length, sectionNames:(j.sections||[]).map(s=>s.name), skill:out};
