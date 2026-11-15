const o={}; const red=s=>String(s).replace(/[\w.+-]+@[\w.-]+/g,'<email>');
const mk=async(t,v)=>{const x=await api('POST','/modules/'+L+'/records',Object.assign(rec(Object.assign({first_name:'QA RT18',last_name:t},v)),{layout_id:'bf971461-2edc-45f2-b6e4-6e180aa64288'})); const id=x.j&&x.j.data&&(x.j.data.id||(x.j.data.record&&x.j.data.record.id)); if(id) LED('lead "QA RT18 '+t+'" '+id+' (Leads)'); return id;};
const sb=await api('GET','/emails/sendability'); o.sendability=red(SR(sb)+' '+sb.t.slice(0,300));
for(const [k,t,to,subj] of [['A','2630 send','qa.rt18.2630@example.com','QA RT18 2630 bounce'],['B','2630 send real','mmohamed@anyware.software','QA RT18 2630 refused sender']]){
  if(!I['l2630'+k]){ I['l2630'+k]=await mk(t,{email:to}); SAVE(); }
  const d=await api('POST','/mail/drafts',{to:[to],subject:subj,body:'QA NDC-2630 check',body_html:'<p>QA NDC-2630 check</p>',record_type:'leads',record_id:I['l2630'+k],attachments:[]});
  const s=await api('POST','/mail/drafts/'+(d.j&&d.j.data&&d.j.data.id)+'/send',{}); o['send'+k]=red(SR(d)+' → '+SR(s));
}
await sleep(15000);
for(const k of ['A','B']){ const m=await api('GET','/mail/records/leads/'+I['l2630'+k]+'/emails?box=mails&limit=10'); o['mails'+k]=red(JSON.stringify(arr(m.j&&m.j.data).map(e=>{const z={}; for(const f of Object.keys(e)) if(/status|error|bounce|retry|sent_at/i.test(f)) z[f]=e[f]; return z;}))).slice(0,600);
  const tl=await api('GET','/timeline/records/leads/'+I['l2630'+k]+'/feed'); o['timeline'+k]=(tl.t.match(/"entry_type":"(\w+)"/g)||[]).join(' '); }
return o;
