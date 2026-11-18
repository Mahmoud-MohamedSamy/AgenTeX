const t=await mkT('F08 spam ticket',{priority:'Low'});log(t);if(!t.id)return;C.f08=t.id;saveC();LED('ticket created '+t.id+' "QA RT21 TK F08 spam ticket" in QA RT20 TK Dept (no contact)');
const p=await api('PUT','/desk/tickets/'+t.id+'/shares',{shares:[{department_id:C.D2,access:'full'}]});log('share',E(p));if(p.s<300)LED('ticket '+t.id+' shared with QA RT20 TK Dept B (full)');
const g=await api('GET','/desk/tickets/'+t.id+'/shares');log('shares',g.s,(g.t.match(/"(department_name|access)":"[^"]+"/g)||[]).join(','));
await sleep(3000);const o=await rec(t.id);log('num',String(o.ticket_number));
