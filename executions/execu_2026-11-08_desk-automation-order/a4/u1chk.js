const U=JSON.parse(fs.readFileSync('../a4/u1.json','utf8'));const o={};
for(const [t,x] of Object.entries(U.tickets)){const ex=arr2((await api('GET','/workflow/executions?recordId='+x.id)).j?.data).filter(e=>e.outcome!=='SkippedNoMatch');
 o['#'+x.num+' '+t]=ex.map(e=>e.evaluatedAt.slice(11,19)+' '+e.triggerKind+' '+e.outcome+' rule '+String(e.ruleId).slice(0,8)+' '+(e.dispatches||[]).map(d=>d.actionType+':'+d.status).join(','));
 const r=await api('GET','/desk/tickets/'+x.id+'/happiness-ratings');const rr=arr2(r.j?.data);if(rr.length)o['#'+x.num+' rating']=rr.map(z=>(z.rating||z.value)+' '+String(z.created_at||z.submitted_at||'').slice(11,19));
 const cm=arr2((await api('GET','/desk/tickets/'+x.id+'/comments')).j?.data).map(c=>String(c.body_html).replace(/<[^>]+>/g,'').slice(0,40));if(cm.length)o['#'+x.num+' comments']=cm;}
o.rules={p5good:'',p5bad:U.p5b.slice(0,8),p5any:U.p5a.slice(0,8)};
const all=arr2((await api('GET','/workflow/rules?take=300')).j?.data).filter(r=>/U1 P5/.test(r.name));o.rules=all.map(r=>r.name+' '+r.id.slice(0,8));
return o;
