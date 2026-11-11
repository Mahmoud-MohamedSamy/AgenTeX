const v=await api('GET','/modules/'+L+'/views/6548f7d2-7548-4fd7-8326-49711cc86a30'); 
const ws=arr((await api('GET','/workflow/rules?appKey=crm&moduleId='+L)).j.data); const w=ws.find(x=>x.criteria&&JSON.stringify(x.criteria).includes('Comparison'))||ws.find(x=>x.criteria);
return {view:JSON.stringify(v.j.data.settings).slice(0,800), kind:v.j.data.kind, vis:v.j.data.visibility, wf: w&&JSON.stringify({criteria:w.criteria,actions:w.actions}).slice(0,1200)};
