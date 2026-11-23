const fs=require('fs');const S=process.argv[2];
const tok=JSON.parse(fs.readFileSync(S+'/owner.json','utf8')).cookies.find(c=>c.name==='aw_staging_access_token').value;
const H={'x-app-key':'desk','x-tenant-id':'a7a7a7a7-0000-0000-0000-000000000004',authorization:'Bearer '+tok};
const B='https://staging-desk.taviportal.com/api/v1/modules/88e8ea44-1658-4df3-9930-d0902b91073d/blueprints/82eee361-e3c5-41a3-9a40-7432e58ac3b3/versions';
(async()=>{for(const v of [1,2,3]){for(const p of ['/'+v,'?includeDefinition=true']){const r=await fetch(B+p,{headers:H});const j=await r.json().catch(()=>null);
 let d=j?.data;if(Array.isArray(d))d=d.find(x=>x.version===v);const def=d?.definition;
 console.log('v'+v,p,r.status,def?.transitions?'':'(no def)');
 if(def?.transitions){fs.writeFileSync(S+'/v'+v+'.json',JSON.stringify(d,null,1));console.log(' states '+def.states.map(s=>s.id).join(','));
  for(const t of def.transitions)console.log('  '+t.name+' '+t.fromStateId+'->'+t.toStateId+' vis='+JSON.stringify(t.before?.visibilityCriteria||null)+' crit='+JSON.stringify(t.criteria||null)+' allowOwner='+t.before?.allowOwner+' owners='+JSON.stringify(t.before?.ownerIds||t.before?.owners||t.owners||null));break;}}}})();
