const LAY='913b2c84-f235-404d-b563-c2cfa9566b6a',CB='checkbox_mandatory_by_layout_rules';const o={};
const post=async(tag,x)=>{const r=await api('POST','/modules/'+TK+'/records',{layout_id:LAY,data:fields({subject:'QA RT22 BS 3062 L '+tag,status:'Open',department:CS,...x})});const id=r.j?.data?.id;if(id){made.tickets.push(id);keep();LED('3062: ticket '+tag+' '+id+' layout='+(r.j?.data?.created_with_layout_id||'?'));}return r.s+' layout='+(r.j?.data?.created_with_layout_id===LAY?'Test Layout Rules':r.j?.data?.created_with_layout_id)+' '+(r.s>=300?JSON.stringify(r.j?.error).slice(0,300):'');};
o.techFalse=await post('tech false',{category:'technical',[CB]:false});
o.techMissing=await post('tech missing',{category:'technical'});
o.techTrue=await post('tech true',{category:'technical',[CB]:true});
o.generalMissing=await post('general missing',{category:'general'});
return o;
