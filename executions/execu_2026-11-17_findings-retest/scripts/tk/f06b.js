const CON2='0924eb24-e42a-4eab-8efd-e3428f19e882',DA='6edaf8a3-7e99-4213-bd90-451802d63be6',DB='09b9df1d-2345-44c5-9e4e-6778e219fd7e';
const planA='68789c8d-569f-44d7-8683-de4991d2c717',planB='6863c25d-e7e6-4062-ba45-27003d13854b',acc='217f16bf-3be7-4a1d-9fdb-12e372f7ff34';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const T=()=>new Date().toISOString().slice(11,19);
const today=new Date().toISOString().slice(0,10),later=new Date(Date.now()+90*86400000).toISOString().slice(0,10);
const fld=async(id,k)=>((await api('GET','/modules/'+CON2+'/records/'+id)).j?.data?.data||[]).find(z=>z.field===k)?.value?.value;
const nm=x=>x===DA?'Dept A':x===DB?'Dept B':x===planA?'plan A':x===planB?'plan B':String(x);
const cov=async id=>{const r=await api('GET','/desk/sla/contracts/'+id+'/coverage');return r.s+' plan='+(r.j?.data?.plan?.name||'none')+' status='+r.j?.data?.status;};
C.f06=C.f06||[];const out=[];
for(const tag of ['1','2']){
const c=await api('POST','/modules/'+CON2+'/records',{data:[f('contract_name','QA RT21 TK F06 Contract '+tag),f('department',DA),f('account_id',acc),f('support_plan',planA),f('start_date',today),f('end_date',later)]});const id=c.j?.data?.id;out.push([T(),'create '+tag,E(c)]);if(!id)continue;C.f06.push(id);saveC();LED('contract "QA RT21 TK F06 Contract '+tag+'" '+id+' (QA RT19 SLA Dept, plan A)');
out.push([T(),'before',nm(await fld(id,'department')),nm(await fld(id,'support_plan')),await cov(id)]);
const p=await api('PATCH','/modules/'+CON2+'/records/'+id,{data:[f('department',DB)]});out.push([T(),'PATCH department only → Dept B',E(p)]);
out.push([T(),'after',nm(await fld(id,'department')),nm(await fld(id,'support_plan')),await cov(id)]);}
// control: move with matching plan
const c3=await api('POST','/modules/'+CON2+'/records',{data:[f('contract_name','QA RT21 TK F06 Contract 3 control'),f('department',DA),f('account_id',acc),f('support_plan',planA),f('start_date',today),f('end_date',later)]});const id3=c3.j?.data?.id;if(id3){C.f06.push(id3);saveC();LED('contract "QA RT21 TK F06 Contract 3 control" '+id3+' (QA RT19 SLA Dept, plan A)');
const p3=await api('PATCH','/modules/'+CON2+'/records/'+id3,{data:[f('department',DB),f('support_plan',planB)]});out.push([T(),'control PATCH dept B + plan B',E(p3),nm(await fld(id3,'department')),nm(await fld(id3,'support_plan')),await cov(id3)]);
const p4=await api('PATCH','/modules/'+CON2+'/records/'+id3,{data:[f('support_plan',planA)]});out.push([T(),'control PATCH plan A only on Dept B contract',E(p4).slice(0,200)]);}
fs.writeFileSync(RUN+'/scripts/tk/f06.out.json',JSON.stringify(out,null,1));for(const o of out)log(o.join(' | '));
