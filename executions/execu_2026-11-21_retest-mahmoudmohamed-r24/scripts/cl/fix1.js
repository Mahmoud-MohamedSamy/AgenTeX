const o={};const RE=/QA RT(1[89]|2[0-3])/;const T='88e8ea44-1658-4df3-9930-d0902b91073d';const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CLEANUP desk: '+m+'\n');
// support plans
const sp=await api('GET','/desk/sla/support-plans');const SL=arr(sp.j?.data?.plans||sp.j?.data?.items||sp.j?.data);o.plans=sp.s+' qa='+SL.filter(x=>RE.test(x.name)).length;
for(const p of SL.filter(x=>RE.test(x.name))){const d=await api('DELETE','/desk/sla/support-plans/'+p.id);o['plan '+p.name]=d.s+(d.s>=300?' '+String(d.t).slice(0,100):'');}
for(const id of ['ba980555-9206-4aed-9aeb-3e1ae90cc85a','5571e16b-6e43-47f6-8c57-848c69abbdea','68a9cb45-4025-4a40-bb8f-da33a1430614','9d470069-0840-400e-a2dc-a88092d7695a','a5859600-5fa7-445a-a22d-8c4e70484459']){const d=await api('DELETE','/desk/sla/policies/'+id);o['sla '+id.slice(0,8)]=d.s;}
// tag with confirm
for(const q of ['?confirm=true','?force=true']){const d=await api('DELETE','/desk/tags/dbdbd304-652f-4bf1-b4af-f73065323d5e'+q);o['tag'+q]=d.s;if(d.s<300||d.s===404)break;}
// blueprint: which record is in progress?
const bp=await api('DELETE','/modules/'+T+'/blueprints/865d108f-4793-4f8e-882b-d652e8bd855c');o.bp=bp.s+' '+String(bp.t).slice(0,250);
LED('support plans/SLA/tag/blueprint '+JSON.stringify(o).slice(0,400));return o;
