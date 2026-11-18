const TM='88e8ea44-1658-4df3-9930-d0902b91073d', MK='2a73bbc0-efb3-4250-bf9b-2fdc98236794', A='ce1a9907-f037-4465-9148-b17c2e9fc33d'; const o={};
const rr=await api('POST','/workflow/rules',{moduleId:TM,departmentIds:[MK],name:'QA RT18 WF uses CA echo',isActive:false,mode:'Recurring',trigger:{kind:'RecordCreated'},criteria:{kind:'StringMatch',field:'subject',operator:'StartsWith',stringValue:'QA RT18 WF CA ',caseInsensitive:false},actions:[{order:0,delaySeconds:0,type:'RunCustomAction',customActionId:A,customActionInputs:{ref:'QARTREF'}}]});
o.rule=rr.s+' '+rr.t.slice(0,200); const rid=rr.j&&rr.j.data&&rr.j.data.id; o.rid=rid;
if(rid) fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} workflow-rule "QA RT18 WF uses CA echo" (inactive, Marketing) ${rid} (Desk)\n`);
return o;
