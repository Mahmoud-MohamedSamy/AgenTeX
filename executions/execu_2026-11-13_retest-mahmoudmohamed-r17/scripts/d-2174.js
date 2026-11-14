const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const me=(await api('GET','/iam/me')).j.data; const uid=me.userId||me.id||me.user_id;
let r=await api('POST','/desk/departments',{name:'QA RT17 2174 Dept',agent_user_ids:[uid],visibility:'public'}); I.D74=r.j&&r.j.data&&(r.j.data.id||(r.j.data.department&&r.j.data.department.id)); o.dept=SR(r); if(I.D74){SAVE();LED('desk department QA RT17 2174 Dept '+I.D74);}
const SRC=(await api('GET','/modules/'+T+'/layouts/0dabc9a3-c7f2-4f74-bd1b-9e21373a6c06')).j.data;
r=await api('POST','/modules/'+T+'/layouts',{name:'QA RT17 2174 Layout',views:SRC.views,dependencies:[],departmentIds:[I.D74],description:'QA retest 13 Nov - safe to delete'}); I.L74=r.j&&r.j.data&&(r.j.data.id||r.j.data.layoutId); o.layout=SR(r)+' '+(r.s>=300?r.t.slice(0,200):''); if(I.L74){SAVE();LED('desk layout QA RT17 2174 Layout '+I.L74);}
r=await api('PUT','/modules/'+T+'/layouts/'+I.L74+'/ticket-statuses',{statuses:['Open','Escalated','Closed'],defaultStatus:'Escalated',fallbackToDefault:false}); o.statuses=SR(r)+' '+r.t.slice(0,250); LED('layout '+I.L74+' statuses Open/Escalated/Closed default Escalated');
const g=(await api('GET','/modules/'+T+'/layouts/'+I.L74)).j.data; o.ts=JSON.stringify(g.ticketStatuses);
// API create without status
const c=await api('POST','/modules/'+T+'/records',{data:[{field:'subject',value:{kind:'string',value:'QA RT17 2174 no status'}},{field:'department_id',value:{kind:'string',value:I.D74}}]}); o.createNoStatus=SR(c)+' '+(c.s>=300?c.t.slice(0,300):'');
const cid=c.j&&c.j.data&&(c.j.data.id||(c.j.data.record&&c.j.data.record.id)); if(cid){I.T74=[cid];SAVE();LED('desk ticket QA RT17 2174 no status '+cid); const d=(await api('GET','/modules/'+T+'/records/'+cid)).j.data; o.statusStored=(JSON.stringify(d).match(/"status","value":\{"kind":"[a-z]+","value":"([^"]*)"/)||[])[1]; o.layoutOfTicket=(JSON.stringify(d).match(/"layout_?[iI]d":"([^"]+)"/)||[])[1];}
fs.writeFileSync(RUN+'/out/2174.json',JSON.stringify(o,null,1)); return o;
