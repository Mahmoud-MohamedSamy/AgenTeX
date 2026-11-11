// U-04: rules via API in Marketing (names "QA MAN wf …"), behaviour checked on tickets. 01 share, 03 pattern, 04 delayed comment, 05 non-matching, 06 loop, 07 cancel scheduled.
const L=require('./lib');const SALES='ef8dc91f-1d30-491d-a1fc-9b62b96eca94';
module.exports=async()=>{const R={rules:{}};let step='';
 const S=(f,op,v)=>({kind:'StringMatch',field:f,operator:op,stringValue:v,caseInsensitive:false});const and=(...o)=>({kind:'Logical',operator:'And',operands:o});const or=(...o)=>({kind:'Logical',operator:'Or',operands:o});
 const mkRule=async(name,trigger,criteria,actions)=>{const ex=arr((await api('GET','/workflow/rules?moduleId='+T+'&pageSize=200')).j.data).find(x=>x.name===name);if(ex){await api('DELETE','/workflow/rules/'+ex.id);}
  const r=await api('POST','/workflow/rules',{moduleId:T,departmentIds:[L.D.MK],name,isActive:true,mode:'Recurring',trigger,criteria,actions:actions.map((a,i)=>({order:i,delaySeconds:0,...a}))});const id=r.j&&r.j.data&&(r.j.data.id||r.j.data.rule&&r.j.data.rule.id);R.rules[name]=r.s+(id?'':' '+r.t.slice(0,160));if(id)LED('U-04 rule "'+name+'" '+id);return id;};
 const tk=async(subject,extra={})=>{const c=await api('POST','/modules/'+T+'/records',L.body({subject,department:L.D.MK,status:'Open',...extra}));const id=c.j&&c.j.data&&c.j.data.id;if(id)LED('U-04 ticket "'+subject+'" '+id);return id;};
 const comments=async id=>{const a=((await api('GET','/desk/tickets/'+id+'/activity')).j||{}).data;const acts=(Array.isArray(a)?a:[]).map(x=>x.action+' '+JSON.stringify(x.summary||{}));return {acts:acts.filter(x=>/comment|workflow|rule/i.test(x)).map(x=>x.slice(0,140)),n:acts.length};};
 const rec=async id=>fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);
 const created={kind:'RecordCreated'};
 try{
 step='rules2';
 await mkRule('QA MAN wf pattern',created,or(and(S('subject','StartsWith','QA MAN pat'),S('description','Contains','TWO')),S('description','Contains','MAGIC3')),[{type:'AddTicketComment',commentBody:'QA MAN pattern fired',commentPublic:false}]);
 await mkRule('QA MAN wf cancel',created,and(S('subject','StartsWith','QA MAN cancel'),S('status','Contains','Open')),[{type:'AddTicketComment',commentBody:'QA MAN cancel check',commentPublic:false,delaySeconds:300}]);
 const tA=await tk('QA MAN pat both',{description:'has TWO here'});const tB=await tk('Zq other 3',{description:'has MAGIC3 inside'});const tC=await tk('QA MAN pat only1',{description:'nothing'});
 const tF=await tk('QA MAN cancel 01');await W(4000);await api('POST','/desk/tickets/'+tF+'/close',{});R.closedF=(await rec(tF)).status;const tG=await tk('QA MAN cancel control');
 await W(25000);R.pattern={both:await comments(tA),only3:await comments(tB),only1:await comments(tC)};
 await W(330000);R.cancel={closed:await comments(tF),control:await comments(tG)};
 }catch(x){R.err=step+': '+String(x.message).slice(0,160);}return R;};
