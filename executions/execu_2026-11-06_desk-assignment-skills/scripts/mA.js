// 8 Nov: B-06 layout vs criteria; H-13 skill types; discover web form + import endpoints
eval(require('fs').readFileSync('lib.js','utf8'));
const o={};
const FL=(await api('GET','/desk/assignment-rules/criteria-fields')).j.data.fields;
const crit=g=>FL.filter(f=>f.group===g).map(f=>f.key.replace(g+'.',''));
const mods=(await api('GET','/modules')).j;const ML=arr(mods.data&&(mods.data.modules||mods.data));
o.modules=ML.map(m=>(m.api_name||m.name)+':'+m.id).join(' | ').slice(0,1500);
const fields=async id=>{for(const p of ['/modules/'+id+'/fields','/modules/'+id+'/layouts']){const r=await api('GET',p);if(r.s===200)return {p,j:r.j};}return null;};
for(const [n,id] of [['tickets',T],['contacts',CM]]){const f=await fields(id);if(!f){o[n]='no fields api';continue;}
 const L=arr(f.j.data&&(f.j.data.fields||f.j.data));o[n+'_api']=f.p;o[n+'_count']=L.length;
 o[n+'_fields']=L.map(x=>(x.api_name||x.key||x.name)+(x.is_system||x.system?'*':'')+'/'+(x.data_type||x.type||'')).join(', ');}
o.crit_contact=crit('contact').join(', ');o.crit_account=crit('account').join(', ');
o.crit_ticket_escal=FL.filter(f=>/escal/i.test(f.key+f.label)).map(f=>f.key);
o.crit_ticket_sample=FL.filter(f=>f.group==='ticket').slice(0,200).map(f=>f.key).join(', ');
o.skillTypes=sh(await api('GET','/desk/skill-types'));
for(const p of ['/desk/web-forms','/desk/webforms','/web-forms','/webforms','/desk/forms','/forms','/desk/imports','/imports','/modules/'+T+'/imports','/data-import','/desk/import'])o['probe '+p]=(await api('GET',p)).s;
return o;
