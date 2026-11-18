const R={};const LK=RUN+'/locks/happiness.lock';const ids=I.t2851mu.map(x=>x.id);
for(let i=0;i<20&&fs.existsSync(LK);i++)await sleep(15000);if(fs.existsSync(LK))return {lock:'busy'};
fs.writeFileSync(LK,'NTF lane '+new Date().toISOString());
const ro=['expiry_days_min','expiry_days_max','question_max_length','public_page_configured','supervisors_max','closed_email_subject_max','closed_email_body_max','resend_after_hours_max','option_icons','option_label_max','option_text_max','option_image_max_bytes'];const strip=x=>{const y={...x};for(const q of ro)delete y[q];return y;};
try{const hs=(await api('GET','/desk/happiness/settings')).j.data;fs.writeFileSync(OUT+'2851-happiness-orig.json',JSON.stringify(hs,null,1));
R.hOn=E(await api('PUT','/desk/happiness/settings',strip({...hs,is_enabled:true,department_scope_enabled:true,department_ids:[D]})));LED('Customer Happiness ON scoped to QA RT19 NTF Dept (NDC-2851 bulk close with ratings on) ('+R.hOn+')');
R.bulkAt=new Date().toISOString();R.bulk=E(await api('POST','/desk/tickets/bulk/close',{ticket_ids:ids}));
const s=await mkT('2851 single close happiness on control',{contact_id:I.contact,email:MAIL});await sleep(3000);s.closeAt=new Date().toISOString();s.close=E(await api('POST','/desk/tickets/'+s.id+'/close',{}));R.s=s;I.t2851hs=s;saveI();
await sleep(35000);
for(const id of [...ids,s.id]){const x=await rec(id);R[x.ticket_number]={status:x.status,hls:x.happiness_link_status||null,feed:(await feedS(id)).filter(y=>/reply|closed|happi/.test(y)),replies:Ls((await api('GET','/desk/tickets/'+id+'/replies')).j?.data).map(r=>r.status+' '+r.subject)};}
const cur=(await api('GET','/desk/happiness/settings')).j.data;const back=strip(hs);for(const q of['row_version','version'])if(q in cur)back[q]=cur[q];
R.hOff=E(await api('PUT','/desk/happiness/settings',back));const n=(await api('GET','/desk/happiness/settings')).j.data;R.hDiff=Object.keys(hs).filter(q=>!['updated_at','row_version','version','updated_by'].includes(q)&&JSON.stringify(hs[q])!==JSON.stringify(n[q]));LED('Customer Happiness restored ('+R.hOff+', diff ['+R.hDiff.join(',')+'])');
}finally{fs.unlinkSync(LK);}
return R;
