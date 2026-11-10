const out={};const S=v=>({kind:'string',value:v});
for(const k of ['LO','LD','LA','LB']){const g=await api('GET',`/modules/${LEADS}/records/${ids[k]}`);out['get'+k]=g.s;}
const p=await api('PATCH',`/modules/${LEADS}/records/${ids.LO}`,{data:[{field:'single_line_3_9',value:S('QA edited by Samy')}]});out.patchLO=p.s+' '+p.t.slice(0,200);
if(p.s<300)log(`NOTE Samy PATCH on lead LO succeeded (${p.s}) under public_read_only`);
const l=await api('GET',`/modules/${LEADS}/records?pageSize=50&q=QA%20SS%202417`);out.listCount=arr(l.j&&l.j.data).length;
return out;
