const o={};
let w=(await api('GET','/workflow/rules/'+I.W)).j.data;
const body={...w, actions:[{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{qa_rt17_tier:{kind:'string',stringValue:'Silver'}}}]};
let r=await api('PATCH','/workflow/rules/'+I.W,body); o.patch=SR(r)+' '+(r.s>=300?r.t.slice(0,200):'');
w=(await api('GET','/workflow/rules/'+I.W)).j.data; o.act=w.actions[0].fieldUpdates.qa_rt17_tier.stringValue; o.crit=w.criteria.value.stringValue;
let g=await gs(I.T); o.set=g.values.map(v=>v.value)+' | unused '+g.unused_values.map(v=>v.value);
// remove a value only used by the rule action
r=await api('POST','/global-sets/'+I.T+'/values/remove',{values:['Silver']}); o.removeRuleAction=SR(r)+' '+(r.s>=300?r.t.slice(0,300):'');
g=await gs(I.T); o.set2=g.values.map(v=>v.value)+' | unused '+g.unused_values.map(v=>v.value);
if(/^2/.test(o.removeRuleAction)) await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Silver']});
// replace Silver -> Bronze (restore Bronze first), then run rule
await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Bronze']});
r=await api('POST','/global-sets/'+I.T+'/values/replace',{replacements:{Silver:'Bronze'}}); o.rep=SR(r); await sleep(2500);
w=(await api('GET','/workflow/rules/'+I.W)).j.data; o.actAfter=w.actions[0].fieldUpdates.qa_rt17_tier.stringValue;
r=await api('PATCH','/workflow/rules/'+I.W,{...w,isActive:true}); o.on=SR(r)+' '+(r.s>=300?r.t.slice(0,200):''); LED('rule '+I.W+' switched ON');
const x=await mkRec('2866 run Gold',{qa_rt17_tier:'Gold'}); await sleep(12000);
o.runResult=await recVal(L,x[1],'qa_rt17_tier');
w=(await api('GET','/workflow/rules/'+I.W)).j.data; r=await api('PATCH','/workflow/rules/'+I.W,{...w,isActive:false}); o.off=SR(r); LED('rule '+I.W+' switched OFF '+o.off);
g=await gs(I.T); o.set3=g.values.map(v=>v.value)+' | unused '+g.unused_values.map(v=>v.value);
// 2867 view list
const lr=await api('GET','/modules/'+L+'/records?view_id='+I.V67+'&limit=50'); o.viewRows=SR(lr)+' '+arr(lr.j&&lr.j.data).length+' '+JSON.stringify(arr(lr.j&&lr.j.data).map(x=>x.id)).slice(0,200);
o.exp67=I.recs.slice(-2);
fs.writeFileSync(RUN+'/out/2866b.json',JSON.stringify(o,null,1)); return o;
