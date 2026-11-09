const fs=require('fs'),path=require('path');const RUN=path.join(__dirname,'..');const d=JSON.parse(fs.readFileSync(path.join(RUN,'plane-draft-I12.json'),'utf8'));
const KEY=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g,'').trim();
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy';const PID='efce4d84-5876-4015-b472-2efca7ad73f3';const P=W+'/projects/'+PID;const h={'X-API-Key':KEY,'Content-Type':'application/json'};const BUG='34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const J=async(u,o={})=>{const r=await fetch(u,{headers:h,...o});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{s:r.status,ok:r.ok,j,t};};
const res=x=>x.results||x;
(async()=>{const out={};
 const ref=await J(W+'/work-items/NDC-2821/?expand=labels,assignees');const labels=(ref.j.labels||[]).map(l=>l.id||l);const assignees=(ref.j.assignees||[]).map(a=>a.id||a);out.refLabels=(ref.j.labels||[]).map(l=>l.name).join(',');out.refAssignees=assignees.length;
 const cy=res((await J(P+'/cycles/?per_page=100')).j||[]);const cyc=cy.find(c=>/^Sprint 15$/i.test(c.name));const mo=res((await J(P+'/modules/?per_page=100')).j||[]);const mod=mo.find(m=>/^Desk$/i.test(m.name));out.cycle=cyc&&cyc.name;out.module=mod&&mod.name;
 if(!cyc||!mod||!labels.length){console.log('STOP lookup',JSON.stringify(out));return;}
 const c=await J(P+'/work-items/',{method:'POST',body:JSON.stringify({name:d.name,description_html:d.description_html,priority:'medium',state:BUG,labels,assignees})});out.create=c.s;if(!c.ok){console.log('create failed',c.t.slice(0,400));return;}
 const id=c.j.id;out.seq='NDC-'+c.j.sequence_id;fs.writeFileSync(path.join(RUN,'out/plane-filed-I12.json'),JSON.stringify({id,seq:out.seq}));
 const file=path.join(RUN,d.attach),buf=fs.readFileSync(file),name=path.basename(file);
 const a=await J(P+'/work-items/'+id+'/attachments/',{method:'POST',body:JSON.stringify({name,type:'image/png',size:buf.length})});
 if(a.ok){const fd=new FormData();for(const[k,v]of Object.entries(a.j.upload_data.fields||{}))fd.append(k,v);fd.append('file',new Blob([buf],{type:'image/png'}),name);const u=await fetch(a.j.upload_data.url,{method:'POST',body:fd});const aid=a.j.asset_id||(a.j.attachment&&a.j.attachment.id);out.attach=u.status+' / '+(await J(P+'/work-items/'+id+'/attachments/'+aid+'/',{method:'PATCH',body:JSON.stringify({is_uploaded:true})})).s;}else out.attach='create '+a.s;
 out.cycleAdd=(await J(P+'/cycles/'+cyc.id+'/cycle-issues/',{method:'POST',body:JSON.stringify({issues:[id]})})).s;
 out.moduleAdd=(await J(P+'/modules/'+mod.id+'/module-issues/',{method:'POST',body:JSON.stringify({issues:[id]})})).s;
 const rel=[];for(const k of d.relates){const w=await J(W+'/work-items/'+k+'/');rel.push(w.j.id);}
 const r=await J(P+'/work-items/'+id+'/relations/',{method:'POST',body:JSON.stringify({relation_type:'relates_to',issues:rel})});out.relations=r.s+(r.ok?'':' '+r.t.slice(0,200));
 const b=await J(W+'/work-items/'+out.seq+'/?expand=state,labels,assignees');const as=await J(P+'/work-items/'+id+'/attachments/');
 out.readBack={name:b.j.name.slice(0,60),state:b.j.state.name,priority:b.j.priority,labels:(b.j.labels||[]).map(l=>l.name).join(','),assignees:(b.j.assignees||[]).length,attachments:(as.j.results||as.j||[]).map(x=>[(x.attributes&&x.attributes.name)||x.name,x.is_uploaded])};
 const cm=await J(P+'/cycles/'+cyc.id+'/cycle-issues/?per_page=100');out.inCycle=JSON.stringify(cm.j||'').includes(id);const mm=await J(P+'/modules/'+mod.id+'/module-issues/?per_page=100');out.inModule=JSON.stringify(mm.j||'').includes(id);
 const rr=await J(P+'/work-items/'+id+'/relations/');out.relRead=JSON.stringify(rr.j).slice(0,200);
 console.log(JSON.stringify(out,null,1));})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
