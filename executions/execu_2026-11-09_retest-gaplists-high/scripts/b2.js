const me=await api('GET','/iam/me');const d=me.j&&me.j.data||{};
const out={profiles:(d.profiles||[]).map(p=>p.name+'@'+p.rank+(p.is_tenant_wide?'(tw)':'')),keys:Object.keys(d)};
const pm=await api('GET','/iam/me/permissions');out.perm={s:pm.s,n:(pm.t.match(/hierarch[a-z_.]*/g)||[]).slice(0,10)};
const mods=await api('GET','/modules');out.mods={s:mods.s,t:(mods.j&&JSON.stringify((mods.j.data||mods.j).map?.(m=>[m.apiName||m.api_name,m.recordVisibility||m.record_visibility]))||mods.t).slice(0,800)};
return out;
