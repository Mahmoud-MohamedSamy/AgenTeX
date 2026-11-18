// NDC-3053: dept QA RT19 NTF Dept never saved contact.ticket_closed. Happiness OFF: rule should show off; close -> no mail. Turn rule ON -> close -> mail even with Happiness off. Then Happiness ON scoped to D -> close -> mail with rating.
const R={};const LK=RUN+'/locks/happiness.lock';
if(!I.contact){const c=await api('POST','/modules/'+CON+'/records',{data:fields({first_name:'QA RT19 NTF',last_name:'inbox customer',email:MAIL})});I.contact=c.j?.data?.id;saveI();R.contact=E(c);if(I.contact)LED('contact created '+I.contact+' "QA RT19 NTF inbox customer" (the user\'s plus-address +r19ntf)');}
const rule=async()=>{const x=Ls((await api('GET','/desk/notification-rules/departments/'+D)).j?.data).find(x=>x.key==='contact.ticket_closed');return 'en='+x.is_enabled+' customized='+x.is_customized+' tpl='+x.template_id;};
const happ=async()=>{const h=(await api('GET','/desk/happiness/settings')).j.data;return 'on='+h.is_enabled+' scoped='+h.department_scope_enabled+' inD='+(h.department_ids||[]).includes(D);};
const mk=s=>mkT(s,{contact_id:I.contact,email:MAIL});
const close=async(t,k)=>{t.closeAt=new Date().toISOString();t.close=E(await api('POST','/desk/tickets/'+t.id+'/close',{}));R[k]=t;I['t3053'+k]=t;saveI();};
R.s0rule=await rule();R.s0happ=await happ();
const a=await mk('3053 A happiness off rule never saved');await sleep(3000);await close(a,'A');
await sleep(2000);
R.ruleOn=E(await api('PUT','/desk/notification-rules/departments/'+D+'/rules/contact.ticket_closed',{is_enabled:true}));LED('QA RT19 NTF Dept contact rule "Closing a ticket" turned ON ('+R.ruleOn+')');
R.s1rule=await rule();R.s1happ=await happ();
const b=await mk('3053 B happiness off rule on');await sleep(3000);await close(b,'B');
// Happiness ON scoped to D (lock)
if(fs.existsSync(LK)){R.lock='happiness.lock held by another lane - C skipped';}else{
fs.writeFileSync(LK,'NTF lane '+new Date().toISOString());
const ro=['expiry_days_min','expiry_days_max','question_max_length','public_page_configured','supervisors_max','closed_email_subject_max','closed_email_body_max','resend_after_hours_max','option_icons','option_label_max','option_text_max','option_image_max_bytes'];
const strip=x=>{const y={...x};for(const q of ro)delete y[q];return y;};
try{
const hs=(await api('GET','/desk/happiness/settings')).j.data;fs.writeFileSync(OUT+'3053-happiness-orig.json',JSON.stringify(hs,null,1));
R.hOn=E(await api('PUT','/desk/happiness/settings',strip({...hs,is_enabled:true,department_scope_enabled:true,department_ids:[D]})));LED('Customer Happiness ON scoped to QA RT19 NTF Dept for NDC-3053 ('+R.hOn+'), original in scripts/ntf/out/3053-happiness-orig.json');
R.s2happ=await happ();
const c=await mk('3053 C happiness on rule on');await sleep(3000);await close(c,'C');
await sleep(25000);
const cur=(await api('GET','/desk/happiness/settings')).j.data;const back=strip(hs);for(const q of['row_version','version'])if(q in cur)back[q]=cur[q];
R.hOff=E(await api('PUT','/desk/happiness/settings',back));const n=(await api('GET','/desk/happiness/settings')).j.data;R.hDiff=Object.keys(hs).filter(q=>!['updated_at','row_version','version','updated_by'].includes(q)&&JSON.stringify(hs[q])!==JSON.stringify(n[q]));
LED('Customer Happiness restored ('+R.hOff+', diff ['+R.hDiff.join(',')+'])');
}finally{fs.unlinkSync(LK);}}
await sleep(20000);
for(const k of['A','B','C'])if(R[k]){R[k].status=(await rec(R[k].id)).status;R[k].feed=await feedS(R[k].id);}
return R;
