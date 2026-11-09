const fs=require('fs');const KEY=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g,'').trim();
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy';const P=W+'/projects/efce4d84-5876-4015-b472-2efca7ad73f3';const h={'X-API-Key':KEY};
const J=async u=>{const r=await fetch(u,{headers:h});return r.json();};
(async()=>{const w=await J(W+'/work-items/NDC-2630/?expand=state,assignees');const I=P+'/work-items/'+w.id;
 const cs=await J(I+'/comments/?per_page=100');const L=(cs.results||[]).sort((x,y)=>x.created_at<y.created_at?-1:1);
 console.log('state',w.state.name,'| updated',w.updated_at,'| assignees',(w.assignees||[]).map(a=>a.display_name||a.first_name).join(','));
 console.log('comments',L.length);for(const c of L.slice(-3))console.log('-',c.created_at.slice(0,16),(c.actor_detail&&c.actor_detail.display_name)||c.created_by,'|',(c.comment_stripped||'').replace(/\s+/g,' ').slice(0,220));
 const ac=await J(I+'/activities/?per_page=100');const A=(ac.results||[]).filter(a=>a.field==='state').sort((x,y)=>x.created_at<y.created_at?-1:1);
 for(const a of A.slice(-4))console.log('state change',a.created_at.slice(0,16),(a.actor_detail&&a.actor_detail.display_name)||a.actor,a.old_value,'->',a.new_value);})().catch(e=>console.error('ERR',e.message));
