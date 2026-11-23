const X=JSON.parse(fs.readFileSync(RUN+'/out/3136.json','utf8'));const o={};
const pols=arr((await api('GET','/desk/sla/policies?department_id='+CS)).j);o.csPolicies=pols.map(p=>p.name+' active='+p.is_active);
const id=await mkT('sla','C2 CS',{},CS);await sleep(8000);o.c2=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;o.c2=o.c2?.state+' '+(o.c2?.policy?.name||'')+' '+JSON.stringify((o.c2?.obligations||[]).map(x=>x.kind+':'+x.state+':'+x.remaining_seconds));
X.t.C2=id;fs.writeFileSync(RUN+'/out/3136.json',JSON.stringify(X,null,1));return o;
