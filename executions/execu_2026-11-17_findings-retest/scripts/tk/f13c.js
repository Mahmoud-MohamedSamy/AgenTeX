const DA='93949fbd-f9df-4e2e-ae45-00b8dc38385b';const g=await api('GET','/desk/departments/'+DA);const a=(g.j.data.agent_user_ids||[]).filter(x=>x!==O);log('others',a.join(','),'routing',g.j.data.routing_strategy);
const t=await mkT('F13 clone source C (owner other agent, my dept)',{priority:'Medium',owner:a[0]},DA);log(t);if(t.id){C.f13c=t.id;C.f13cOwner=a[0];saveC();LED('ticket created '+t.id+' "QA RT21 TK F13 clone source C" in QA AO Dept A (fixture), owner '+a[0]);}
await sleep(3000);const o=await rec(t.id);log(o.ticket_number,'owner',String(o.owner));
