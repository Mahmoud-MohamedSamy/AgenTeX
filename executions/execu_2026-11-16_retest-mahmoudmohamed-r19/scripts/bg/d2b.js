var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const R={at:new Date().toISOString(),steps:[]};const S=(...a)=>{const l=a.join(' ');R.steps.push(l);log(l);};const K='BUGD2B'+U;
const ids=[];
for(const [i,act] of [[1,'close'],[2,'close'],[3,'priority'],[4,'none']]){const id=await tk(K+' '+i+' '+act,{},AOB);ids.push([id,act]);let p='';if(act==='close')p=E(await patch(id,{status:'Closed'}));if(act==='priority')p=E(await patch(id,{priority:'low'}));S('#'+i,act,'patch',p,'at',new Date().toISOString().slice(11,19));}
for(let k=0;k<9;k++){await sleep(10000);const row=[];for(const [id] of ids){row.push((await rec(id)).ticket_number||'NONE');}S('t+'+(k+1)*10+'s numbers',row.join(','));if(row.every(x=>x!=='NONE'))break;}
R.final=[];for(const [id,act] of ids){const o=await rec(id);const f=(await api('GET','/desk/tickets/'+id+'/activity')).j?.data||[];R.final.push([act,o.ticket_number||'NONE',o.status,'act '+f.length]);}
S('final',JSON.stringify(R.final));
for(const [id,act] of ids)if(act!=='close')await patch(id,{status:'Closed'});
save('d2b.json',R);return R;
