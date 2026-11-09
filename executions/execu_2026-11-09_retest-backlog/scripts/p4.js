const o={};const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data);
const by={};F.forEach(x=>{(by[x.datatypeKey]=by[x.datatypeKey]||[]).push(x)});o.types=Object.fromEntries(Object.entries(by).map(([k,v])=>[k,v.length]));
const s=(k,n=1)=>(by[k]||[]).slice(0,n).map(x=>x.fieldName+' | opts='+JSON.stringify(x.datatypeOptions).slice(0,400)+' | config='+JSON.stringify(x.config).slice(0,400));
for(const k of Object.keys(by)) if(/dec|curr|lookup|pick|num|percent/i.test(k)) o['s_'+k]=s(k,2);
o.anyDefault=F.filter(x=>/default/i.test(JSON.stringify([x.datatypeOptions,x.config]))).map(x=>x.fieldName+': '+JSON.stringify([x.datatypeOptions,x.config]).match(/.{0,60}default.{0,80}/i)[0]).slice(0,8);
o.anyRound=F.filter(x=>/round/i.test(JSON.stringify([x.datatypeOptions,x.config]))).map(x=>x.fieldName).slice(0,8);
return o;
