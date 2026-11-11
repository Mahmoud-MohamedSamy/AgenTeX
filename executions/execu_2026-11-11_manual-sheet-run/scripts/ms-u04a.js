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
 step='rules';
 await mkRule('QA MAN wf share',created,S('subject','StartsWith','QA MAN wf'),[{type:'ShareTicket',shareDepartmentId:SALES,shareAccess:'read_only'}]);
 await mkRule('QA MAN wf pattern',created,or(and(S('subject','StartsWith','QA MAN pat'),S('priority','Equals','high')),S('description','Contains','MAGIC3')),[{type:'AddTicketComment',commentBody:'QA MAN pattern fired',commentPublic:false}]);
 await mkRule('QA MAN wf delayed',created,S('subject','StartsWith','QA MAN delay'),[{type:'AddTicketComment',commentBody:'QA MAN delayed comment',commentPublic:false,delaySeconds:300}]);
 await mkRule('QA MAN wf loop A',{kind:'SpecificFieldChanged',fieldName:'priority',fieldNames:['priority'],fieldMatch:'any',alsoOnCreate:false},S('subject','StartsWith','QA MAN loop'),[{type:'FieldUpdate',fieldUpdates:{description:{kind:'string',stringValue:'QA MAN loop A'}}}]);
 await mkRule('QA MAN wf loop B',{kind:'SpecificFieldChanged',fieldName:'description',fieldNames:['description'],fieldMatch:'any',alsoOnCreate:false},S('subject','StartsWith','QA MAN loop'),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'low'}}}]);
 step='tickets';const t01=await tk('QA MAN wf 01');const tA=await tk('QA MAN pat both',{priority:'high'});const tB=await tk('Zq other 3',{description:'has MAGIC3 inside'});const tC=await tk('QA MAN pat only1',{priority:'low'});
 const tD=await tk('QA MAN delay 01');const tE=await tk('QA MAN delay cancel');const t05=await tk('Zq non matching subject');
 await api('POST','/desk/tickets/'+tE+'/close',{});R.closedE=(await rec(tE)).status;
 const tL=await tk('QA MAN loop 01',{priority:'medium',description:'start'});await W(5000);const up=await api('PATCH','/modules/'+T+'/records/'+tL,L.body({priority:'high'}));R.loopPatch=up.s;
 await W(25000);
 R.t01share=(await api('GET','/desk/tickets/'+t01+'/shares')).t.slice(0,200);
 R.pattern={both:await comments(tA),only3:await comments(tB),only1:await comments(tC)};R.t05=await comments(t05);
 const l1=await rec(tL);R.loop={priority:l1.priority,desc:l1.description,acts:(await comments(tL)).n};const get=await api('GET','/modules/'+T+'/records/'+tL);R.loopUsable=get.s;
 R.delayEarly={D:await comments(tD)};
 await W(330000);R.delayLate={D:await comments(tD),E:await comments(tE)};const l2=await rec(tL);R.loopLater={priority:l2.priority,desc:l2.description,acts:(await comments(tL)).n};
 require('fs').writeFileSync(OUT+'/u04.json',JSON.stringify({t01,tA,tB,tC,tD,tE,t05,tL}));
 }catch(x){R.err=step+': '+String(x.message).slice(0,160);}return R;};
