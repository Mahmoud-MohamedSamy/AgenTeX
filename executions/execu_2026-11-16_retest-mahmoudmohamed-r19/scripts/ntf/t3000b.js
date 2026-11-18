const R={};const A=Ls((await api('GET','/desk/channels/addresses')).j?.data);const tech=A.find(a=>a.display_name==='Tech');const dom=String(tech.address).split('@')[1];
const r=await api('POST','/desk/channels/addresses',{address:'qa-rt19-ntf@'+dom,local_part:'qa-rt19-ntf',department_id:D,display_name:'QA RT19 NTF Dept',kind:'hosted'});R.addr=E(r);const a=r.j?.data;
if(a?.id){I.addr=a.id;saveI();R.local=String(a.address).split('@')[0];R.sameDomain=String(a.address).split('@')[1]===dom;R.active=a.is_active;R.autoAck=a.auto_acknowledge;R.mail=a.mail&&{receiving:a.mail.receiving,verified:a.mail.verified,kind:a.mail.kind,enabled:a.mail.enabled};LED('receiving address qa-rt19-ntf@<Tech hosted domain> '+a.id+' created for QA RT19 NTF Dept');}
return R;
