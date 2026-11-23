const T='0c626758-7a53-4bf1-816d-0a7472d9d563';const d=(await api('GET','/desk/community/topics/'+T)).j?.data;const o={status:d.status,state:d.state,rowv:d.row_version};
for(const [m,p,b] of [['POST','/status',{status:'analyzing'}],['PUT','/status',{status:'analyzing'}],['PATCH','',{status:'analyzing',row_version:d.row_version}]]){const r=await api(m,'/desk/community/topics/'+T+p,b);o[m+p]=E(r);if(r.s<300)break;}
const d2=(await api('GET','/desk/community/topics/'+T)).j?.data;o.after=d2.status;return o;
