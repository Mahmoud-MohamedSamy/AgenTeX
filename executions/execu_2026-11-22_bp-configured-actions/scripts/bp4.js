const fs=require('fs');const S=process.argv[2];
const tok=JSON.parse(fs.readFileSync(S+'/owner.json','utf8')).cookies.find(c=>c.name==='aw_staging_access_token').value;
const H={'x-app-key':'desk','x-tenant-id':'a7a7a7a7-0000-0000-0000-000000000004',authorization:'Bearer '+tok};
const B='https://staging-desk.taviportal.com/api/v1/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/f46a195a-5e4d-40a9-818a-83c412348876';
const val=x=>!x?undefined:x.kind==='array'?(x.items||[]).map(val):x.value;
(async()=>{const r=await (await fetch(B,{headers:H})).json();const f=Object.fromEntries((r.data?.data||[]).map(x=>[x.field,val(x.value)]));
 console.log(JSON.stringify({num:f.ticket_number,status:f.status,channel:f.channel,language:f.language,owner:!!f.owner_id||!!f.ticket_owner}));
 const t=await fetch(B+'/blueprint-transitions',{headers:H});const tj=await t.json().catch(()=>null);fs.writeFileSync(S+'/tr.json',JSON.stringify(tj,null,1));
 console.log('transitions',t.status,JSON.stringify(tj).slice(0,900));
 const h=await fetch(B+'/history?limit=30',{headers:H});console.log('history',h.status);if(h.ok){const hj=await h.json();fs.writeFileSync(S+'/hist.json',JSON.stringify(hj,null,1));}
})();
