const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const d=await api('GET','/desk/departments'); const deps=arr(d.j&&d.j.data); o.depts=deps.map(x=>({id:x.id,name:x.name,def:x.isDefault||x.is_default,st:x.status}));
for (const x of deps){ const ag=await api('GET',`/desk/departments/${x.id}/agents`); const a=arr(ag.j&&ag.j.data); o['agents_'+x.name]=a.map(u=>(u.email||u.user&&u.user.email||u.userId||u.id)).slice(0,15); }
const ar=await api('GET','/desk/assignment-rules'); o.assign=ar.s+' '+JSON.stringify(arr(ar.j&&ar.j.data).map(r=>[r.name,r.status||r.isActive||r.active,r.departmentId||r.department_id])).slice(0,1200);
const wr=await api('GET','/workflow/rules?take=200'); const w=arr(wr.j&&wr.j.data); o.wf=wr.s+' n='+w.length+' '+JSON.stringify(w.filter(r=>(r.moduleId||r.module_id)===T).map(r=>[r.name,r.isActive??r.status,r.trigger&&r.trigger.type||r.triggerType, JSON.stringify(r.criteria||r.conditions||'').slice(0,120)])).slice(0,2500);
const bp=await api('GET','/desk/blueprints'); o.bp=bp.s+' '+JSON.stringify(arr(bp.j&&bp.j.data).map(r=>[r.name,r.status||r.isActive,r.departmentId||r.department_id,JSON.stringify(r.criteria||'').slice(0,100)])).slice(0,1500);
const sl=await api('GET','/desk/sla/policies'); o.sla=sl.s+' '+JSON.stringify(arr(sl.j&&sl.j.data).map(r=>[r.name,r.status||r.isActive,r.departmentId||r.department_id])).slice(0,800);
const tm=await api('GET','/desk/teams'); o.teams=tm.s+' '+JSON.stringify(arr(tm.j&&tm.j.data).map(r=>[r.id,r.name,r.departmentId||r.department_id])).slice(0,800);
const st=await api('GET','/desk/ticket-statuses'); o.statuses=JSON.stringify(arr(st.j&&st.j.data).map(r=>r.name+'/'+(r.type||r.statusType||r.category))).slice(0,900);
const rc=await api('GET',`/modules/${T}/records?limit=3&sort=-created_at`); o.recent=JSON.stringify(arr(rc.j&&rc.j.data).map(r=>[r.ticket_number||r.data&&r.data.ticket_number,(r.subject||r.data&&r.data.subject||'').slice(0,40),r.created_at||r.createdAt])).slice(0,600);
const ct=await api('GET','/modules'); o.modules=JSON.stringify(arr(ct.j&&ct.j.data).filter(m=>/contact|account|ticket/i.test(m.name||m.apiName)).map(m=>[m.id,m.apiName||m.name,m.appKey||m.app_key]));
return done(o);
