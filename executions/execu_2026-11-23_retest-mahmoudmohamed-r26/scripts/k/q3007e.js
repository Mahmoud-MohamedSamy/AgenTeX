const T='0c626758-7a53-4bf1-816d-0a7472d9d563';const o={};
for(const s of ['need_more_info','needs_more_info','answered','unanswered','in_progress','working_on_it','no_status']){const r=await api('POST','/desk/community/topics/'+T+'/status',{status:s});o[s]=E(r);if(r.s<300)break;}
const d2=(await api('GET','/desk/community/topics/'+T)).j?.data;o.after=d2.status;await sleep(4000);
const tk=(await api('GET','/modules/'+TK+'/records/1dc9f6e3-6899-4e1c-af5c-50019b5f77d7')).j?.data?.data||[];o.rec=tk.map(f=>f.field).join(',');return o;
