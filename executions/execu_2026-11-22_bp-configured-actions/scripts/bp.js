const fs=require('fs');const S=process.argv[2];
const st=JSON.parse(fs.readFileSync(S+'/owner.json','utf8'));const tok=st.cookies.find(c=>c.name==='aw_staging_access_token').value;
const H={'content-type':'application/json','x-app-key':'desk','x-tenant-id':'a7a7a7a7-0000-0000-0000-000000000004',authorization:'Bearer '+tok};
const B='https://staging-desk.taviportal.com/api/v1';const TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const g=async p=>{const r=await fetch(B+p,{headers:H});return {s:r.status,j:await r.json().catch(()=>null)}};
(async()=>{const l=await g('/modules/'+TK+'/blueprints');const arr=l.j?.data?.items||l.j?.data||[];
 const bp=(Array.isArray(arr)?arr:[]).filter(b=>/mail/i.test(b.name||b.definition?.name||''));
 console.log('list',l.s,(Array.isArray(arr)?arr:[]).map(b=>(b.name||b.definition?.name)+' '+b.id+' active='+b.isActive).join('\n'));
 for(const b of bp){const d=(await g('/modules/'+TK+'/blueprints/'+b.id)).j?.data;fs.writeFileSync(S+'/bp-'+b.id+'.json',JSON.stringify(d,null,1));
  const def=d.definition;console.log('== '+def.name,'entry',JSON.stringify(def.entryCriteria));
  console.log('states',def.states.map(s=>s.id+'/'+s.name).join(', '));
  for(const t of def.transitions)console.log(JSON.stringify({id:t.id,name:t.name,from:t.fromStateId,to:t.toStateId,before:t.before,during:Object.keys(t.during||{}),auto:t.auto||t.autoTransition}));}
 const r=await g('/modules/'+TK+'/records/f46a195a-5e4d-40a9-818a-83c412348876/blueprint-state');fs.writeFileSync(S+'/state-6375.json',JSON.stringify(r.j,null,1));
 const s0=(r.j?.data?.states||[])[0]||{};console.log('ticket state',r.s,s0.blueprintName,JSON.stringify(s0.activeStates));
 console.log('allTransitions',JSON.stringify((s0.allTransitions||[]).map(t=>({n:t.name,c:t.criteria||t.before?.criteria,o:t.before?.owners||t.owners}))));
})();
