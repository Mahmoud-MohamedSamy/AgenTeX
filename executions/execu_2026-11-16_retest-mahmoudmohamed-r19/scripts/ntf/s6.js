const R={};
for(const [k,id] of Object.entries({A:'86beb1f7-0e4d-4b7e-8ac5-2fffed78232d',B:'f2219c2f-0f2b-4c8b-9ff5-0846b858f1d9',B2:'1537c932-2dd2-4a84-8255-e5f113addc56',C:'8ae64a31-97f1-4a97-b8e5-605c98929d92'})){
const r=await rec(id);const rp=Ls((await api('GET','/desk/tickets/'+id+'/replies')).j?.data);
R[k]={n:r.ticket_number,status:r.status,hls:r.happiness_link_status,dept:r.department===D,replies:rp.map(x=>(x.created_at||'').slice(11,19)+' '+x.status+' '+MASK(x.subject||'')+' | '+MASK((x.body_html||x.body_text||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')).slice(0,400)+' | links='+((x.body_html||'').match(/href="[^"]*"/g)||[]).map(h=>h.replace(/[?#].*$/,'').slice(0,60)).join(','))};}
return R;
