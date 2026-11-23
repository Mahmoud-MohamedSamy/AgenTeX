const LAY='913b2c84-f235-404d-b563-c2cfa9566b6a',CB='checkbox_mandatory_by_layout_rules';const o={};
const lays=arr((await api('GET','/modules/'+TK+'/layouts')).j);o.layout=lays.find(l=>l.id===LAY)?.name||'MISSING';
const lr=await api('GET','/modules/'+TK+'/layout-rules?layout_id='+LAY);o.rules=lr.s+' '+JSON.stringify(arr(lr.j?.data?.rules||lr.j).map(r=>({n:r.name,a:r.is_active??r.active}))).slice(0,400);
const post=async(tag,x)=>{const r=await api('POST','/modules/'+TK+'/records',{layout_id:LAY,data:fields({subject:'QA RT26 3062 '+tag,status:'Open',department:CS,...x})});const id=r.j?.data?.id;if(id){made.tickets.push(id);keep();LED('3062: ticket '+tag+' '+id);}return {id,res:r.s+' '+(r.s>=300?JSON.stringify(r.j?.error).slice(0,350):'layout='+(r.j?.data?.created_with_layout_id===LAY?'Test Layout Rules':r.j?.data?.created_with_layout_id))};};
const a=await post('tech false',{category:'technical',[CB]:false});o.techFalse=a.res;
const b=await post('tech missing',{category:'technical'});o.techMissing=b.res;
const c=await post('tech true',{category:'technical',[CB]:true});o.techTrue=c.res;
const d=await post('general missing',{category:'general'});o.generalMissing=d.res;
if(c.id){const r=await api('PATCH','/modules/'+TK+'/records/'+c.id,{data:fields({[CB]:false})});o.editUntick=r.s+' '+(r.s>=300?JSON.stringify(r.j?.error).slice(0,300):'');o.afterEdit=(await rec(c.id))[CB];}
if(d.id){const r=await api('PATCH','/modules/'+TK+'/records/'+d.id,{data:fields({category:'technical'})});o.editToTechNoCb=r.s+' '+(r.s>=300?JSON.stringify(r.j?.error).slice(0,300):'');}
return o;
