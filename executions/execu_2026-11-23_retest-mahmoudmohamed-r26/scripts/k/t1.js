const st=(await api('GET','/desk/ticket-statuses')).j?.data?.statuses||[];const o={};
for(const s of st.filter(s=>/^QA NDC/.test(s.value))){const r=await api('POST','/modules/'+TK+'/records/query',{filters:{field:'status',operator:'equals',value:s.value},limit:5});o[s.value]=s.type+' '+r.s+' '+(r.j?.meta?.total??arr(r.j).length);}
return o;
