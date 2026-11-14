const T='88e8ea44-1658-4df3-9930-d0902b91073d', TK='d120a6c2-2596-4254-968b-a1bcd3a000bf', CL='f7e488b5-0232-42fd-811c-1f24356af653', CT='43004ce2-577f-4eda-b00a-0750fe40c3d4'; const o={}; const del=async p=>(await api('DELETE',p)).s;
o.rule=await del('/workflow/rules/'+I.W94); o.team=await del('/desk/teams/'+I.TM94);
o.view=await del('/modules/'+T+'/views/'+I.V23);
const tickets=[...(I.T74||[]),...(I.T23||[]),I.T23c,I.TK94,I.A35.ticket].filter(Boolean); const tr={}; for(const id of tickets){const s=await del('/modules/'+T+'/records/'+id); tr[s]=(tr[s]||0)+1;} o.tickets=tr;
o.taskB=await del('/modules/'+TK+'/records/'+I.A35.tasks[1]); o.call=await del('/modules/'+CL+'/records/'+I.A35.call);
o.contactB=await del('/modules/'+CT+'/records/'+I.S10.B.id);
o.layout=await del('/modules/'+T+'/layouts/'+I.L74);
await api('PATCH','/desk/departments/'+I.D74,{agent_user_ids:[]}); let r=await api('DELETE','/desk/departments/'+I.D74); o.dept=SR(r);
LED('CLEANUP DESK '+JSON.stringify(o)); return o;
