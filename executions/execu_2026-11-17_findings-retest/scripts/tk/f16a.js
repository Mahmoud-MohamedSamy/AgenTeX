const safe=s=>String(s).replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g,'<addr>');
const d=await api('GET','/desk/departments?take=200');const L=arr(d.j?.data??d.j);const N=L.find(x=>x.name==='QA RT19 NTF Dept');log('NTF',N?.id,N?.is_active);
if(N){const r=await api('GET','/desk/notification-rules/departments/'+N.id);const Ls=arr(r.j?.data);log('rules',r.s,Ls.filter(x=>x.category==='contact').map(x=>x.key+' en='+x.is_enabled).join(' ; '));}
const A=arr((await api('GET','/desk/channels/addresses')).j?.data);log('addresses',A.map(a=>a.display_name+' local='+String(a.address).split('@')[0]+' active='+a.is_active+' recv='+a.mail?.receiving).join(' ; '));
const ch=(await api('GET','/desk/channels/settings')).j?.data;log('channel ack',ch?.acknowledgement_enabled);
// recent email-channel tickets
const q=await api('POST','/modules/'+TK+'/records/search',{limit:15,sort:[{field:'created_at',direction:'desc'}],criteria:{conditions:[{field:'channel',operator:'equals',value:'email'}]}});log('search',q.s,safe(q.t.slice(0,300)));
