eval(require('fs').readFileSync('lib.js','utf8'));
const r=await api('GET','/workflow/rules?moduleId='+T+'&limit=200'); const L=arr(r.j&&r.j.data); const o={s:r.s,n:L.length};
const all=JSON.stringify(L); o.ownerAction=(all.match(/\{[^{}]*"type":"OwnerAssignment"[^]*?\}\}?/)||[''])[0].slice(0,600);
o.ownerCrit=(all.match(/.{0,200}"field":"owner".{0,300}/)||[''])[0];
o.andCrit=(all.match(/.{0,50}"kind":"And".{0,400}/)||[''])[0];
o.tagAction=(all.match(/\{[^{}]*"type":"AddTags".{0,250}/)||[''])[0];
o.active=L.filter(x=>x.isActive).map(x=>x.name+' | '+(x.trigger&&x.trigger.kind)+' | '+JSON.stringify(x.criteria).slice(0,160));
return o;
