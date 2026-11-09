const st=(await api('GET','/desk/integrations/crm/status')).j.data;
const out={mods:{c:st.contacts_module_id,t:st.tickets_module_id}};
for(const q of [`/modules/${st.contacts_module_id}/records?pageSize=5`,`/modules/${st.contacts_module_id}/records?page=1&page_size=5`]){const r=await api('GET',q);out[q]={s:r.s,t:r.t.slice(0,1500)};if(r.s===200)break;}
const n=await api('GET','/notifications?limit=50');out.notif={s:n.s,types:[...new Set(arr(n.j&&n.j.data).map(x=>x.type||x.kind||x.event_type))].slice(0,30),sample:arr(n.j&&n.j.data).filter(x=>/sync|import|crm/i.test(JSON.stringify(x))).slice(0,3)};
return out;
