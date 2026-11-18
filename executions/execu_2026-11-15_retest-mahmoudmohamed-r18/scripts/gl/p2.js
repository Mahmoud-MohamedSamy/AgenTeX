const o={};
for (const d of ['7e1ac409-58b0-41ab-97e1-0e7d5c8c5158','2a73bbc0-efb3-4250-bf9b-2fdc98236794']) { const r=await api('GET','/desk/notification-rules/departments/'+d); o[d]=r.s+' '+r.t.slice(0,3500); }
return o;
