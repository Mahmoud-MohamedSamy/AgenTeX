eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const orig=await notif();const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};const c=(f,op,v)=>({field_key:f,operator:op,value:v});
const run=async(tag,move,wfDeptCond)=>{const k='PC5'+tag+U;const ids=[];
 if(move){const d=await prule('direct','PC5 '+tag+' d',[daT(k,{kind:'unassigned',user_id:null,team_id:null},{coming:DB,move:DA})]);ids.push(d.id);}
 await wrule('PC5 '+tag,{kind:'RecordCreated'},wfDeptCond?wand(wcon(k),{kind:'Membership',field:'department',negate:false,values:[{kind:'string',stringValue:DA}]}):wcon(k),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'urgent'}}}],{dept:DA});
 const rr=await prule('round_robin','PC5 '+tag+' rr',[rrT(k,'sequential',[A2],[c('priority','equals','urgent')])],{on:['create']});ids.push(rr.id);
 const id=await ptk(k,{},move?DB:DA);const o=await waitRec(id,x=>x.owner,24);await sleep(4000);const r=await rec(id);await off(...ids);return {num:r.ticket_number,owner:nm(o.owner),feed:await feedS(id)};};
try{await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});
 await cs(R,'g move + workflow Urgent (dept cond) + RR needs Urgent',()=>run('g',true,true));
 await cs(R,'h no move + workflow Urgent + RR needs Urgent',()=>run('h',false,false));
 await cs(R,'i move + workflow Urgent (no dept cond) + RR needs Urgent',()=>run('i',true,false));
}finally{R.switch=(await api('PUT','/desk/assignment/notification-settings',orig)).s;}
fs.writeFileSync('../pc5d-result.json',JSON.stringify(R,null,1));return R;
