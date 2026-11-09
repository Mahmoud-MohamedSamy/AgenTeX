const out={};
const m=await api('o','GET','desk:/modules'); out.mods=m.s+' '+arr(m.j?.data).map(x=>(x.apiName||x.moduleKey)+':'+x.id.slice(0,8)+(x.isStandard||x.isSystem?'*':'')).join(', ');
const ts=await api('o','GET','desk:/teamspaces'); out.ts=arr(ts.j?.data).map(x=>x.id+' '+x.name).join(' | ');
const p=await api('o','GET','/iam/profiles?limit=200'); out.profiles=arr(p.j?.data).filter(x=>/desk|agent|admin/i.test(x.name)).map(x=>(x.profileId||x.id)+' '+x.name+' '+(x.appScope||x.app_key||x.app||''));
const d=await api('o','GET','desk:/desk/departments'); out.depts=d.s+' '+arr(d.j?.data).map(x=>x.id.slice(0,8)+' '+x.name).join(', ');
return out;
