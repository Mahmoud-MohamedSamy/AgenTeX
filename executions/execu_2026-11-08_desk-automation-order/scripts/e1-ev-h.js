eval(fs.readFileSync('lib-as.js','utf8'));const hs=JSON.parse(fs.readFileSync('../e1-ev-happiness-orig.json','utf8'));
const ro=['expiry_days_min','expiry_days_max','question_max_length','public_page_configured','supervisors_max','closed_email_subject_max','closed_email_body_max','resend_after_hours_max','option_icons','option_label_max','option_text_max','option_image_max_bytes'];
const strip=o=>{const x={...o};for(const q of ro)delete x[q];return x;};const cur=(await api('GET','/desk/happiness/settings')).j.data;
const body=process.env.H==='on'?strip({...cur,is_enabled:true,department_scope_enabled:true,department_ids:[DA]}):(()=>{const b=strip(hs);for(const q of ['row_version','version'])if(q in cur)b[q]=cur[q];return b;})();
const p=await api('PUT','/desk/happiness/settings',body);const n=(await api('GET','/desk/happiness/settings')).j.data;
return {put:p.s,enabled:n.is_enabled,diffFromOrig:Object.keys(hs).filter(q=>!['updated_at','row_version','version','updated_by'].includes(q)&&JSON.stringify(hs[q])!==JSON.stringify(n[q]))};
