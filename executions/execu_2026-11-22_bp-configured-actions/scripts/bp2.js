const fs=require('fs');const S=process.argv[2];
const tok=JSON.parse(fs.readFileSync(S+'/owner.json','utf8')).cookies.find(c=>c.name==='aw_staging_access_token').value;
const H={'x-app-key':'desk','x-tenant-id':'a7a7a7a7-0000-0000-0000-000000000004',authorization:'Bearer '+tok};
const B='https://staging-desk.taviportal.com/api/v1';const TK='88e8ea44-1658-4df3-9930-d0902b91073d';const ID='82eee361-e3c5-41a3-9a40-7432e58ac3b3';
const g=async p=>{const r=await fetch(B+p,{headers:H});return {s:r.status,j:await r.json().catch(()=>null)}};
const sum=def=>def&&def.transitions.map(t=>t.name+' '+t.fromStateId+'->'+t.toStateId+' crit='+JSON.stringify(t.criteria||null)+' vis='+JSON.stringify(t.before?.visibilityCriteria||null)).join('\n ');
(async()=>{for(const p of ['/draft','/versions']){const r=await g('/modules/'+TK+'/blueprints/'+ID+p);fs.writeFileSync(S+'/bp'+p.replace('/','-')+'.json',JSON.stringify(r.j,null,1));
  const d=r.j?.data;console.log(p,r.s,Array.isArray(d)?d.map(v=>JSON.stringify({v:v.version,st:v.status||v.state,at:v.createdAt||v.created_at,pub:v.publishedAt})).join(' | '):'');
  const def=d?.definition||(Array.isArray(d)?null:d);if(def?.transitions)console.log(' '+sum(def));}
 const tb=(await g('/modules/'+TK+'/blueprints/c2da4020-5b62-4f6c-969a-95f32108b91e')).j?.data?.definition;console.log('test blueprint:\n '+sum(tb));
})();
