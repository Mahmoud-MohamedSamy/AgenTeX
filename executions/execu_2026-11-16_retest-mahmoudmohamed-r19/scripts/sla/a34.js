eval(fs.readFileSync('sla/lib.js','utf8'));
const u=Math.random().toString(36).slice(2,6); const R={u};
const mkT=async n=>{const id=ok(await api('POST','/desk/email-templates',{name:'QA RT19 SLA Tpl 2834 '+n+' '+u,module:'desk_tickets',notification_type:'agent',use_case:'ticket.sla_escalation',subject:'QA RT19 SLA 2834 '+n,body_html:'<p>QA RT19 SLA 2834 '+n+'</p>'}),'tpl').j.data.id;led(`email template "QA RT19 SLA Tpl 2834 ${n} ${u}" ${id}`);return id;};
const lvl=(timing,min,ref)=>({timing,offset:timing==='at'?null:{value:min,unit:'minutes'},recipients:[{kind:'agent',id:SAMY}],template_ref:ref,actions:{assign_owner:null,assign_team:null,set_priority:null}});
const pol=async(tag,active,resp,resl=[])=>{const r=ok(await api('POST','/desk/sla/policies',{department_id:D,name:'QA RT19 SLA 2834 '+tag+' '+u,description:null,is_active:active,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:false,targets:[{name:'t',criteria:{conditions:[{field_key:'description',operator:'contains',value:'R19SLAnever'+u}],pattern:null},response:{value:1,unit:'hours'},resolution:{value:3,unit:'hours'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:resp,resolution:resl}}]}),'pol');const id=r.j.data.id;led(`SLA policy "QA RT19 SLA 2834 ${tag} ${u}" ${id} ${active?'active':'inactive'} (matches nothing)`);return id;};
const t1=await mkT('resp'),t2=await mkT('resol'),t3=await mkT('unused');
const p1=await pol('active',true,[lvl('at',null,t1)]);
const p2=await pol('inactive',false,[],[lvl('after',30,t2)]);
const p3=await pol('second user of resp',false,[lvl('before',30,t1)]);
let d=await api('DELETE','/desk/email-templates/'+t1);R.del_used_by_active_and_inactive=d.s+' '+JSON.stringify(d.j?.error||d.t).slice(0,600);
d=await api('DELETE','/desk/email-templates/'+t2);R.del_used_in_resolution_by_inactive=d.s+' '+JSON.stringify(d.j?.error||d.t).slice(0,600);
R.t1_still=(await api('GET','/desk/email-templates/'+t1)).s;R.p1_ref=(await api('GET','/desk/sla/policies/'+p1)).j?.data?.targets?.[0]?.escalations?.response?.[0]?.template_ref;
d=await api('DELETE','/desk/email-templates/'+t3);R.del_unused_control=d.s;led(`template ${t3} deleted (control) ${d.s}`);
// remove t2 from p2 then delete -> should work
const g=(await api('GET','/desk/sla/policies/'+p2)).j.data;g.targets[0].escalations.resolution[0].template_ref=null;const pu=await api('PUT','/desk/sla/policies/'+p2,g);R.p2_put_clear=pu.s+' '+(pu.s>=300?pu.t.slice(0,300):'');
d=await api('DELETE','/desk/email-templates/'+t2);R.del_after_unlink=d.s+' '+(d.s>=300?d.t.slice(0,300):'');if(d.s<300)led(`template ${t2} deleted after unlink ${d.s}`);
// delete policy p1 -> deleting t1 still refused due to p3?
R.ids={t1,t2,p1,p2,p3};
setCfg({a34:R});return R;
