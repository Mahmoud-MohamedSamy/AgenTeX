const o={};
const l=await z('GET',`/layouts?module=tickets&departmentId=${DEPT}`); const lay=(l.j?.data||[])[0]; o.layouts=(l.j?.data||[]).map(x=>[x.id,x.layoutName]);
const f=await z('GET',`/organizationFields?module=tickets&limit=200`); o.fieldsStatus=f.s; o.skillFields=(f.j?.data||[]).filter(x=>/skill/i.test(x.displayLabel+x.apiName)).map(x=>[x.displayLabel,x.apiName,x.type,x.isCustomField]);
o.allFieldNames=(f.j?.data||[]).map(x=>x.apiName).join(',');
if(lay){ const d=await z('GET',`/layouts/${lay.id}`); o.layoutSkill=JSON.stringify(d.j||{}).match(/.{0,80}[Ss]kill.{0,80}/g); }
return o;
