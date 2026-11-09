const fs=require('fs'),path=require('path');const RUN=path.join(__dirname,'..');const d=JSON.parse(fs.readFileSync(path.join(RUN,'plane-draft.json'),'utf8'));
const csv=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/)[1].split(',');const KEY=csv[3].replace(/"/g,'').trim();
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy';const P=W+'/projects/efce4d84-5876-4015-b472-2efca7ad73f3';const h={'X-API-Key':KEY,'Content-Type':'application/json'};const I=P+'/work-items/7ae77874-2a69-4a0a-ae58-177b7912a974';const BUG='34a7f4b6-7207-4955-b927-0d8d1dd3c666',ID='7ae77874-2a69-4a0a-ae58-177b7912a974';
const J=async(u,o)=>{const r=await fetch(u,o);const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{s:r.status,ok:r.ok,j,t};};
(async()=>{
 const before=await J(W+'/work-items/NDC-2275/?expand=state',{headers:h});console.log('state before:',before.j.state.name);if(before.j.state.name!=='Ready For Test'){console.log('STOP: state changed');return;}
 const c=await J(I+'/comments/',{method:'POST',headers:h,body:JSON.stringify({comment_html:d.comment_html})});console.log('comment',c.s);if(!c.ok){console.log(c.t.slice(0,300));return;}
 const file=path.join(RUN,d.attach),buf=fs.readFileSync(file),name=path.basename(file);
 const a=await J(I+'/attachments/',{method:'POST',headers:h,body:JSON.stringify({name,type:'image/png',size:buf.length})});if(!a.ok){console.log('attach create',a.s,a.t.slice(0,300));return;}
 const fd=new FormData();for(const[k,v]of Object.entries(a.j.upload_data.fields||{}))fd.append(k,v);fd.append('file',new Blob([buf],{type:'image/png'}),name);const u=await fetch(a.j.upload_data.url,{method:'POST',body:fd});if(!u.ok&&u.status!==204){console.log('upload',u.status);return;}
 const aid=a.j.asset_id||(a.j.attachment&&a.j.attachment.id);const pa=await J(I+'/attachments/'+aid+'/',{method:'PATCH',headers:h,body:JSON.stringify({is_uploaded:true})});console.log('attach',pa.s);
 const st=await J(I+'/',{method:'PATCH',headers:h,body:JSON.stringify({state:BUG})});console.log('state update',st.s);
 const after=await J(W+'/work-items/NDC-2275/?expand=state',{headers:h});const cs=await J(I+'/comments/?per_page=100',{headers:h});const as=await J(I+'/attachments/',{headers:h});
 const L=(cs.j.results||[]).sort((x,y)=>x.created_at<y.created_at?-1:1);console.log('READ BACK state:',after.j.state.name,'| comments:',L.length,'| last starts:',(L[L.length-1].comment_stripped||'').slice(0,60));console.log('attachments:',JSON.stringify((as.j.results||as.j||[]).map(x=>[(x.attributes&&x.attributes.name)||x.name,x.is_uploaded])));
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
