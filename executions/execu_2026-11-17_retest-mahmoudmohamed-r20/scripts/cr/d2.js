eval(fs.readFileSync('cr/lib.js','utf8'));const o={};
let rules=[];for(let skip=0;skip<2000;skip+=200){const r=arr((await api('GET','/workflow/rules?take=200&skip='+skip)).j?.data);rules.push(...r);if(r.length<200)break;}
o.n=rules.length;o.types={};
for(const r of rules)for(const a of r.actions||[]){o.types[a.type]=(o.types[a.type]||0)+1;}
o.create=rules.flatMap(r=>(r.actions||[]).filter(a=>/Create/.test(a.type)&&!/Task|Call|Event|Meeting/.test(a.type)||/Connected/.test(a.type)).map(a=>({rule:r.id,name:r.name,active:r.isActive,mod:r.moduleId,type:a.type,tm:a.targetModuleId,tl:a.targetLayoutId,keys:Object.keys(a.fieldMappings||{}),a:JSON.stringify(a).slice(0,600)})));
const sa=await api('GET','/workflow/actions?take=200');o.saS=sa.s;o.saved=arr(sa.j?.data).map(a=>({id:a.id,name:a.name,type:a.type||a.actionType,j:JSON.stringify(a).slice(0,700)}));
save('d2-'+(process.env.APP||'desk'),o);return {n:o.n,types:o.types,ncreate:o.create.length,saS:o.saS,nsaved:o.saved.length};
