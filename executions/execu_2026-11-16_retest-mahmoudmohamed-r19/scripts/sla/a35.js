eval(fs.readFileSync('sla/lib.js','utf8'));
const u=Math.random().toString(36).slice(2,6); const R={u}; const made=[];
const lv=(min,unit='minutes')=>({timing:'before',offset:{value:min,unit},recipients:[{kind:'agent',id:SAMY}],template_ref:null,actions:{assign_owner:null,assign_team:null,set_priority:null}});
const body=(tag,resp,respEsc,resEsc=[],res={value:3,unit:'hours'})=>({department_id:D,name:'QA RT19 SLA 2835 '+tag+' '+u,description:null,is_active:false,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:false,targets:[{name:'t',criteria:{conditions:[{field_key:'description',operator:'contains',value:'R19SLAnever'+u}],pattern:null},response:resp,resolution:res,calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:respEsc,resolution:resEsc}}]});
const tryP=async(k,b)=>{const r=await api('POST','/desk/sla/policies',b);R[k]=r.s+' '+(r.s<300?'saved':JSON.stringify(r.j?.error||r.t).slice(0,500));if(r.s<300){made.push(r.j.data.id);led(`SLA policy 2835 ${k} ${r.j.data.id} (inactive)`);}return r;};
await tryP('resp1h_before2h',body('a',{value:1,unit:'hours'},[lv(2,'hours')]));
await tryP('resp60m_before60m_equal',body('b',{value:60,unit:'minutes'},[lv(60)]));
await tryP('resp1h_before61m',body('c',{value:1,unit:'hours'},[lv(61)]));
await tryP('resp1h_before59m_control',body('d',{value:1,unit:'hours'},[lv(59)]));
await tryP('res3h_before4h',body('e',{value:1,unit:'hours'},[],[lv(4,'hours')]));
await tryP('resp1d_before25h',body('f',{value:1,unit:'days'},[lv(25,'hours')]));
// PUT path: take control policy and edit to 2h before
const ctl=made[made.length-1]?null:null;
const cr=await api('POST','/desk/sla/policies',body('g',{value:1,unit:'hours'},[lv(30)]));if(cr.s<300){const id=cr.j.data.id;made.push(id);led(`SLA policy 2835 g ${id} (inactive)`);const g=(await api('GET','/desk/sla/policies/'+id)).j.data;g.targets[0].escalations.response[0].offset={value:2,unit:'hours'};const p=await api('PUT','/desk/sla/policies/'+id,g);R.put_edit_to_before2h=p.s+' '+JSON.stringify(p.j?.error||'').slice(0,400);const g2=(await api('GET','/desk/sla/policies/'+id)).j.data;R.after_put_offset=g2.targets[0].escalations.response[0].offset;}
R.made=made;
for(const id of made){const d=await api('DELETE','/desk/sla/policies/'+id);R['del_'+id.slice(0,8)]=d.s;led(`SLA policy ${id} deleted (2835 probe) ${d.s}`);}
save('a35',R);return R;
