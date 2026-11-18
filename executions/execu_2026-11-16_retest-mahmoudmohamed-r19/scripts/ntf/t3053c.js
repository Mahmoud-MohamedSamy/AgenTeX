const R={};const LK=RUN+'/locks/happiness.lock';const mk=s=>mkT(s,{contact_id:I.contact,email:MAIL});
const chk=async t=>{const r=await rec(t.id);t.n=r.ticket_number;t.status=r.status;t.hls=r.happiness_link_status||null;t.feed=(await feedS(t.id)).filter(x=>/reply|closed|happi/.test(x));const rp=Ls((await api('GET','/desk/tickets/'+t.id+'/replies')).j?.data);t.replies=rp.map(x=>x.status+' '+x.subject+' | '+MASK(x.body_html||'').slice(-120));};
R.rule='en='+Ls((await api('GET','/desk/notification-rules/departments/'+D)).j?.data).find(x=>x.key==='contact.ticket_closed').is_enabled;
R.happ0=(await api('GET','/desk/happiness/settings')).j.data.is_enabled;
const b=await mk('3053 B3 happiness off rule on (repeat)');await sleep(4000);b.dept=(await rec(b.id)).department===D;b.closeAt=new Date().toISOString();b.close=E(await api('POST','/desk/tickets/'+b.id+'/close',{}));R.B3=b;
for(let i=0;i<20&&fs.existsSync(LK);i++)await sleep(15000);
if(fs.existsSync(LK)){R.lock='busy';}else{fs.writeFileSync(LK,'NTF lane '+new Date().toISOString());
const ro=['expiry_days_min','expiry_days_max','question_max_length','public_page_configured','supervisors_max','closed_email_subject_max','closed_email_body_max','resend_after_hours_max','option_icons','option_label_max','option_text_max','option_image_max_bytes'];const strip=x=>{const y={...x};for(const q of ro)delete y[q];return y;};
try{const hs=(await api('GET','/desk/happiness/settings')).j.data;fs.writeFileSync(OUT+'3053c-happiness-orig.json',JSON.stringify(hs,null,1));
R.hOn=E(await api('PUT','/desk/happiness/settings',strip({...hs,is_enabled:true,department_scope_enabled:true,department_ids:[D]})));LED('Customer Happiness ON scoped to QA RT19 NTF Dept (repeat C2, NDC-3053/3000) ('+R.hOn+')');
const c=await mk('3053 C2 happiness on scoped rule on (repeat)');await sleep(4000);c.dept=(await rec(c.id)).department===D;c.closeAt=new Date().toISOString();c.close=E(await api('POST','/desk/tickets/'+c.id+'/close',{}));R.C2=c;
await sleep(40000);await chk(c);
const cur=(await api('GET','/desk/happiness/settings')).j.data;const back=strip(hs);for(const q of['row_version','version'])if(q in cur)back[q]=cur[q];
R.hOff=E(await api('PUT','/desk/happiness/settings',back));const n=(await api('GET','/desk/happiness/settings')).j.data;R.hDiff=Object.keys(hs).filter(q=>!['updated_at','row_version','version','updated_by'].includes(q)&&JSON.stringify(hs[q])!==JSON.stringify(n[q]));LED('Customer Happiness restored ('+R.hOff+', diff ['+R.hDiff.join(',')+'])');
}finally{fs.unlinkSync(LK);}}
await chk(b);I.t3053B3=b;I.t3053C2=R.C2;saveI();
return R;
