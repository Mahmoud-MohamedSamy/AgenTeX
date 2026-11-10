const out={};const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const s=await api('GET','/desk/tickets/send-as-email/departments');out.sendAsEmail=s.s+' '+s.t.slice(0,600);
for(const p of ['/desk/email/channels','/desk/channels/email','/desk/email-channels','/desk/mail/channels','/desk/support-emails']){const r=await api('GET',p);out[p]=r.s+' '+r.t.slice(0,400);}
const c=await api('GET',`/modules/${CT}/records?pageSize=5&search=mmohamed`);out.contactSearch=c.s+' '+JSON.stringify(arr(c.j).map(x=>({id:x.id,d:(x.data||[]).filter(z=>/name|email/.test(z.field)).map(z=>z.field+'='+(z.value&&z.value.value))}))).slice(0,800);
const c2=await api('GET',`/modules/${CT}/records?pageSize=5&q=mmohamed%40anyware.software`);out.contactQ=c2.s+' '+JSON.stringify(arr(c2.j).map(x=>({id:x.id,d:(x.data||[]).filter(z=>/name|email/.test(z.field)).map(z=>z.field+'='+(z.value&&z.value.value))}))).slice(0,800);
return out;
