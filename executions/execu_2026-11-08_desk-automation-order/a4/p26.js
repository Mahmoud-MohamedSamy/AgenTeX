const o={};const base={moduleId:T,name:'QA AO WF P26 saved comment',type:'AddTicketComment'};
const ex=arr2((await api('GET','/workflow/actions?take=50')).j?.data).find(a=>a.type==='AddTags');o.exKeys=ex?Object.keys(ex).join(','):'';o.exAction=ex?JSON.stringify(ex.action||ex.config||{}).slice(0,200):'';
for(const [k,a] of [['noType',{commentBody:'QA AO WF P26 saved comment',commentPublic:false}],['withOrder',{type:'AddTicketComment',order:0,delaySeconds:0,commentBody:'QA AO WF P26 saved comment',commentPublic:false}]]){
 const r=await api('POST','/workflow/actions',{...base,action:a});o[k]=[r.s,r.t.slice(0,200)];if(r.j?.data?.id){track('savedAction',r.j.data.id,'P26');o.id=r.j.data.id;break;}}
return o;
