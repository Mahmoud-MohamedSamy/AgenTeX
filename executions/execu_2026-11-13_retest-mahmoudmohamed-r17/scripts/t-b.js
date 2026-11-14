const o={};
const lay=arr((await api('GET','/modules/'+L+'/layouts')).j.data); const std=lay.find(x=>/standard/i.test(x.name))||lay[0]; I.LAY=std.id; SAVE();
// 2866 workflow rule on set T field qa_rt17_tier
let r=await api('POST','/workflow/rules',{moduleId:L,appKey:'crm',layoutId:null,departmentIds:[],name:'QA RT17 2866 Bronze rule',description:'QA RT17 - safe to delete',mode:'Recurring',isActive:false,
 trigger:{kind:'RecordCreated',fieldName:null,fieldNames:null,fieldMatch:null,dateFieldName:null,offsetSeconds:null,offsetMode:null},
 criteria:{kind:'Comparison',field:'qa_rt17_tier',operator:'Equal',value:{kind:'string',stringValue:'Bronze'},negate:null},
 actions:[{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{qa_rt17_tier:{kind:'string',stringValue:'Silver'}}}]});
o.rule=SR(r); I.W=r.j&&r.j.data&&r.j.data.id; if(I.W){SAVE();LED('workflow rule QA RT17 2866 Bronze rule (inactive) '+I.W);}
let u=await api('GET','/global-sets/'+I.T+'/used-in'); o.usedInRule=JSON.stringify(u.j.data.fields[0].workflow_rules).slice(0,300);
const rb=await mkRec('2866 Bronze',{qa_rt17_tier:'Bronze'});
r=await api('POST','/global-sets/'+I.T+'/values/replace',{replacements:{Bronze:'Gold'}}); o.rep1=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); await sleep(3000);
let w=(await api('GET','/workflow/rules/'+I.W)).j.data; o.critAfter1=w.criteria.value.stringValue; o.recAfter1=await recVal(L,rb[1],'qa_rt17_tier');
r=await api('POST','/global-sets/'+I.T+'/values/replace',{replacements:{Silver:'Gold'}}); o.rep2=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); await sleep(3000);
w=(await api('GET','/workflow/rules/'+I.W)).j.data; o.actAfter2=JSON.stringify(w.actions[0].fieldUpdates); o.critAfter2=w.criteria.value.stringValue;
let g=await gs(I.T); o.set=g.values.map(v=>v.value)+' | unused '+g.unused_values.map(v=>v.value);
// remove warning: restore Silver, rule action -> Silver, try remove Silver
await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Silver']});
w=(await api('GET','/workflow/rules/'+I.W)).j.data; const wb=Object.assign({},w); wb.actions=[{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{qa_rt17_tier:{kind:'string',stringValue:'Silver'}}}];
r=await api('PUT','/workflow/rules/'+I.W,wb); o.setActSilver=SR(r)+' '+(r.s>=300?r.t.slice(0,200):'');
r=await api('POST','/global-sets/'+I.T+'/values/remove',{values:['Silver']}); o.removeUsedByRule=SR(r)+' '+(r.s>=300?r.t.slice(0,300):'');
// Run the rule: criteria now Gold? activate, create lead Gold
w=(await api('GET','/workflow/rules/'+I.W)).j.data; o.critBeforeRun=w.criteria.value.stringValue; o.actBeforeRun=JSON.stringify(w.actions[0].fieldUpdates);
fs.writeFileSync(RUN+'/out/2866.json',JSON.stringify({o,w},null,1));
const ok=/^200/.test(o.rep1)&&o.critAfter1==='Gold'&&/Gold/.test(o.actAfter2);
RES('2866', ok?'PASS?':'FAIL', JSON.stringify(o));
// 2867 custom view
const q={};
r=await mkSet('QA RT17 GS 2867',['Gold','Silver','Bronze'],'S67');
r=await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:'qa_rt17_cv',labels:{en:'QA RT17 CV'},datatypeKey:'pick_list',datatypeOptions:{global_set_id:I.S67},config:{}}]}); I.f67=fid(r); SAVE(); LED('field Leads qa_rt17_cv '+I.f67);
const g1=await mkRec('2867 Gold A',{qa_rt17_cv:'Gold'}), g2=await mkRec('2867 Gold B',{qa_rt17_cv:'Gold'});
r=await api('POST','/modules/'+L+'/views',{name:'QA RT17 2867 Gold view',kind:'list',layout_id:I.LAY,visibility:'private',settings:{columns:['first_name','last_name','qa_rt17_cv'],sort:null,criteria:{pattern:null,conditions:[{field:'qa_rt17_cv',operator:'equals',value:'Gold'}]},related_criteria:[]}});
q.view=SR(r); I.V67=r.j&&r.j.data&&r.j.data.id; if(I.V67){SAVE();LED('Leads view QA RT17 2867 Gold view '+I.V67);}
r=await api('POST','/global-sets/'+I.S67+'/values/replace',{replacements:{Gold:'Silver'}}); q.replace=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); await sleep(3000);
const v=(await api('GET','/modules/'+L+'/views/'+I.V67)).j.data; q.viewCrit=JSON.stringify(v.settings.criteria.conditions);
q.recs=[await recVal(L,g1[1],'qa_rt17_cv'),await recVal(L,g2[1],'qa_rt17_cv')];
g=await gs(I.S67); q.set=g.values.map(v=>v.value)+' | unused '+g.unused_values.map(v=>v.value);
fs.writeFileSync(RUN+'/out/2867.json',JSON.stringify({q,v},null,1));
RES('2867-api', /^200/.test(q.replace)&&/Silver/.test(q.viewCrit)&&!/Gold/.test(q.viewCrit)?'PASS?':'FAIL', JSON.stringify(q));
return {o,q};
