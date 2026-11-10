const out={};
const r=await api('GET','/modules');const ms=arr(r.j.data!==undefined?r.j.data:r.j);
out.mods=ms.map(m=>({n:m.api_name||m.name,id:m.id.slice(0,8),vis:m.record_visibility||m.visibility||m.data_sharing||m.default_access||null,keys:undefined})).slice(0,40);
const lead=ms.find(m=>/^leads?$/i.test(m.api_name||m.name));out.leadKeys=lead?Object.keys(lead):null;out.leadId=lead&&lead.id;
const s=await api('GET','/settings/resolved');const flat=JSON.stringify(s.j);out.settingsHits=(flat.match(/"[a-z_]*(hierarch|visib|sharing|reporting)[a-z_]*":[^,}]{0,80}/gi)||[]).slice(0,20);
return out;
