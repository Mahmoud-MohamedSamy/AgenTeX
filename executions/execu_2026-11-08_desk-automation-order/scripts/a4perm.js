// A4 Group A (A3/A4/A6/A7/A8) as a non-admin agent: reads and writes on workflow endpoints. Writes must be refused; anything created is deleted.
const T='88e8ea44-1658-4df3-9930-d0902b91073d';const o={};
const me=(await api('GET','/iam/me')).j?.data||{};o.me=[me.profile_name||me.profile?.name||me.role||'',(me.permissions||[]).filter(p=>/workflow/.test(p)).join(',')];
for(const p of ['/workflow/rules?take=1','/workflow/actions?take=1','/workflow/executions?take=1','/workflow/custom-actions'])o['GET '+p]=(await api('GET',p)).s;
const L=arr((await api('GET','/workflow/rules?take=1')).j?.data);const rid=L[0]&&L[0].id;
const w=await api('POST','/workflow/rules',{moduleId:T,name:'QA AO WF A4 perm',isActive:false,mode:'Recurring',trigger:{kind:'RecordCreated'},criteria:{kind:'StringMatch',field:'subject',operator:'StartsWith',stringValue:'QA AO WF A4perm ',caseInsensitive:false},actions:[{order:0,type:'AddTicketComment',commentBody:'x',commentPublic:false}]});o['POST rule']=w.s;if(w.j?.data?.id){o.cleanup=(await api('DELETE','/workflow/rules/'+w.j.data.id)).s;}
if(rid){o['PATCH rule']=(await api('PATCH','/workflow/rules/'+rid,{name:L[0].name})).s;o['POST execute']=(await api('POST','/workflow/rules/'+rid+'/execute',{recordId:'00000000-0000-0000-0000-000000000000'})).s;o['POST deactivate']=(await api('POST','/workflow/rules/'+rid+'/deactivate')).s;}
const a=await api('POST','/workflow/actions',{moduleId:T,name:'QA AO WF A7 perm',type:'AddTags',action:{type:'AddTags',order:0,delaySeconds:0,tagIds:[],mode:'append'}});o['POST action']=a.s;if(a.j?.data?.id)o.cleanupA=(await api('DELETE','/workflow/actions/'+a.j.data.id)).s;
return o;
