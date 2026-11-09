const G='QA RT r10 2714';
const body={ moduleId:T.LEADS, layoutId:null, name:G+' AR', description:null, priority:10, allowedChannels:['Import'], fallback:{kind:'DefaultUser',userId:T.U4,poolCriteria:null},
 entries:[{condition:X.startsWith('first_name',G), target:{kind:'Category',members:[{userId:T.P_USER,order:0,kind:'Role'}],poolCriteria:null}, availability:{requireOnline:false,requireOnShift:false}, followUpTask:null}], isActive:false };
const r=await X.made('o','/workflow/assignment-rules',body,'assignment rule'); const id=r.j?.data?.id; if(!id) return r.s+' '+r.t.slice(0,400);
const cur=(await api('o','GET','/workflow/assignment-rules/'+id)).j?.data; const on=await api('o','PATCH','/workflow/assignment-rules/'+id,{...cur,isActive:true});
const after=(await api('o','GET','/workflow/assignment-rules/'+id)).j?.data;
return {id, on:on.s, err:on.s>299?on.t.slice(0,300):undefined, target:after.entries[0].target, active:after.isActive, rowVersion:after.rowVersion};
