const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const b=await api('GET',`/modules/${T}/blueprints`); o.bp=b.s+' '+JSON.stringify(arr(b.j&&b.j.data).map(x=>[x.name,x.isActive??x.is_active,x.departmentId||x.department_id,JSON.stringify(x.criteria||x.definition&&x.definition.criteria||'').slice(0,150)])).slice(0,2000);
const l=await api('GET',`/modules/${T}/layouts`); o.layouts=JSON.stringify(arr(l.j&&l.j.data).map(x=>[x.id,x.name,x.departmentId||x.department_id||x.departmentIds,x.isDefault])).slice(0,800);
const s=await api('GET','/desk/sla/policies'); o.sla=JSON.stringify(s.j&&s.j.data).slice(0,900);
const c=await api('GET','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records?limit=50'); o.contacts=JSON.stringify(arr(c.j&&c.j.data).map(r=>{const d={};(r.data||[]).forEach?.(f=>d[f.field||f.apiName]=f.value);return [r.id,JSON.stringify(r).match(/[\w.+-]+@[\w.-]+/g)?.slice(0,1)];}).filter(x=>x[1]&&/anyware|mohamedsamy|meinvr/.test(x[1][0]))).slice(0,800);
const wr=await api('GET','/workflow/rules?take=200'); o.replaceTag=JSON.stringify(arr(wr.j&&wr.j.data).filter(r=>/Replace Tag|test$|Append/.test(r.name)).map(r=>[r.name,JSON.stringify(r.criteria).match(/stringValue\?":\?"(\w+)/g),JSON.stringify(r.actions).slice(0,200)]));
return done(o);
